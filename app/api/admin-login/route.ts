import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createSession, sameOrigin, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/session";
// Process-local backstop; production also requires a shared/edge rate limiter.
let attempts = 0;
let windowEnds = 0;
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });
  if (Date.now() >= windowEnds) { attempts = 0; windowEnds = Date.now() + 60_000; }
  if (++attempts > 20) return NextResponse.json({ success: false }, { status: 429, headers: { "Retry-After": "60" } });
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 16 || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    return NextResponse.json({ success: false }, { status: 503 });
  }
  try {
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ success: false }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4096) { await reader.cancel(); return NextResponse.json({ success: false }, { status: 413 }); }
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    const password = body?.password;
    if (typeof password !== "string" || !timingSafeEqual(createHash("sha256").update(password).digest(), createHash("sha256").update(expected).digest())) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, createSession(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS,
    });
    return response;
  } catch { return NextResponse.json({ success: false }, { status: 400 }); }
}
