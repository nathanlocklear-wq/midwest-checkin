import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { SESSION_COOKIE, validSession, sameOrigin } from "@/lib/session";
import { getServerDatabase } from "@/lib/supabase";
import { attendeeColumns, InvalidInput, record, keys, text, id, boolean, date, patch, importedRows } from "@/lib/staff-validation";
export const runtime = "nodejs";
const headers = { "Cache-Control": "private, no-store", "Vary": "Cookie" };
function error(message: string, status: number) {
  return NextResponse.json({ data: null, error: { message } }, { status, headers });
}
export async function POST(request: NextRequest) {
  // Authorize here even when middleware is bypassed or the endpoint is called directly.
  if (!validSession(request.cookies.get(SESSION_COOKIE)?.value)) return error("Sign in required", 401);
  if (!sameOrigin(request)) return error("Invalid request origin", 403);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return error("JSON required", 415);
  let input: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return error("Request body required", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 5_000_000) { await reader.cancel(); return error("Request is too large", 413); }
      chunks.push(value);
    }
    input = record(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch { return error("Invalid JSON request", 400); }
  try {
    // No caller-selected tables, schemas, column lists, filter expressions, or RPCs.
    const action = text(input.action, 40);
    let queryId = "", search = "", cutoff = "", filter = "";
    let checked = false;
    let updates: Record<string, unknown> = {};
    let rows: ReturnType<typeof importedRows> = [];
    switch (action) {
      case "list": keys(input, ["action"]); break;
      case "search":
        keys(input, ["action","search"]);
        search = text(input.search, 100).replace(/[%,().*\\":]/g," ").trim();
        if (!search) return NextResponse.json({ data: [], error: null }, { headers });
        break;
      case "find": keys(input, ["action","email"]); search = text(input.email).toLowerCase(); break;
      case "get": case "delete": case "badge":
        keys(input, ["action","id"]); queryId = id(input.id); break;
      case "checkin":
        keys(input, ["action","id","checked"]); queryId = id(input.id); checked = boolean(input.checked); break;
      case "update":
        keys(input, ["action","id","changes"]); queryId = id(input.id); updates = patch(input.changes); break;
      case "count":
        keys(input, ["action","filter"]); filter = text(input.filter, 30);
        if (!["checked_in","badge_still_needed"].includes(filter)) throw new InvalidInput();
        break;
      case "import":
        keys(input, ["action","rows"]); rows = importedRows(input.rows); break;
      case "settingsRead": keys(input, ["action"]); break;
      case "settingsWrite":
        keys(input, ["action","value"]); cutoff = date(input.value); break;
      default: throw new InvalidInput();
    }
    let db: ReturnType<typeof getServerDatabase>;
    try { db = getServerDatabase(); } catch { return error("Database is not configured",503); }
    let result;
    switch (action) {
      case "list": {
        const all = [];
        for (let offset = 0; offset < 100000; offset += 500) {
          const page = await db.from("attendees").select(attendeeColumns).order("last_name").order("id").range(offset, offset + 499);
          if (page.error) return error("Unable to load attendees",502);
          all.push(...(page.data ?? []));
          if ((page.data ?? []).length < 500) return NextResponse.json({data:all,error:null},{headers});
        }
        return error("Roster exceeds the supported size",422);
      }
      case "search":
        result = await db.from("attendees").select(attendeeColumns)
          .or(["full_name","email","company"].map(field => `${field}.ilike.%${search}%`).join(","))
          .order("last_name").limit(25); break;
      case "find": result = await db.from("attendees").select(attendeeColumns).eq("email",search).maybeSingle(); break;
      case "get": result = await db.from("attendees").select(attendeeColumns).eq("id",queryId).single(); break;
      case "update": result = await db.from("attendees").update(updates).eq("id",queryId).select(attendeeColumns).single(); break;
      case "checkin": result = await db.from("attendees").update({checked_in:checked,checked_in_at:checked ? new Date().toISOString() : null}).eq("id",queryId).select(attendeeColumns).single(); break;
      case "badge": result = await db.from("attendees").update({badge_still_needed:false,badge_printed_at:new Date().toISOString()}).eq("id",queryId).select(attendeeColumns).single(); break;
      case "delete": result = await db.from("attendees").delete().eq("id",queryId).select("id").single(); break;
      case "count": result = await db.from("attendees").select("id",{count:"exact",head:true}).eq(filter,true); break;
      case "import":
        // One insert is atomic; never delete or replace the existing roster.
        result = await db.from("attendees").insert(rows.map(row => ({...row,id:randomUUID()})));
        if (!result.error) return NextResponse.json({data:{imported:rows.length},error:null},{headers});
        break;
      case "settingsRead": result = await db.from("settings").select("value").eq("key","badge_cutoff_date").single(); break;
      case "settingsWrite": result = await db.from("settings").update({value:cutoff}).eq("key","badge_cutoff_date").select("value").single(); break;
    }
    if (!result || result.error) return error("Database operation failed",502);
    return NextResponse.json({data:result.data,count:result.count,error:null},{headers});
  } catch (cause) {
    if (cause instanceof InvalidInput) return error("Unsupported or invalid request",400);
    return error("Unable to complete database request",502);
  }
}
