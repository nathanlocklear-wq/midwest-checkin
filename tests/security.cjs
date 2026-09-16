/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test harness loads transpiled TypeScript. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function load(file, aliases = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(source, { exports: compiledModule.exports, module: compiledModule, require: name => aliases[name] || require(name), process, Buffer, Date, URL, Uint8Array });
  return compiledModule.exports;
}
process.env.ADMIN_SESSION_SECRET = "test-only-independent-secret-".repeat(3);
process.env.ADMIN_PASSWORD = "test-only-password-at-least-sixteen";
const session = load("lib/session.ts");
const login = load("app/api/admin-login/route.ts", { "@/lib/session": session });
function request(body, origin = "https://checkin.example") {
  return new Request("https://checkin.example/api/admin-login", { method:"POST", headers:{"Content-Type":"application/json",Origin:origin}, body });
}
test("sessions reject forged, altered, expired and future tokens", () => {
  const now = Date.now();
  const token = session.createSession(now);
  assert.equal(session.validSession(token,now),true);
  for (const bad of [undefined,"true","",token+"x",token.replace(/.$/,token.endsWith("0")?"1":"0")]) assert.equal(session.validSession(bad,now),false);
  assert.equal(session.validSession(token,now+session.SESSION_SECONDS*1000),false);
  assert.equal(session.validSession(session.createSession(now+60000),now),false);
});
test("missing secret fails closed and rotation invalidates sessions", () => {
  const saved = process.env.ADMIN_SESSION_SECRET;
  const token = session.createSession();
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(session.validSession(token),false);
  assert.throws(() => session.createSession());
  process.env.ADMIN_SESSION_SECRET = "rotated-secret-".repeat(4);
  assert.equal(session.validSession(token),false);
  process.env.ADMIN_SESSION_SECRET = saved;
});
test("login validates origin, JSON, body size, password and configuration", async () => {
  assert.equal((await login.POST(request("{}", "https://attacker.example"))).status,403);
  assert.equal((await login.POST(request("{"))).status,400);
  assert.equal((await login.POST(request("x".repeat(4097)))).status,413);
  assert.equal((await login.POST(request("{}"))).status,401);
  assert.equal((await login.POST(request(JSON.stringify({password:"wrong"})))).status,401);
  const saved = process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_PASSWORD;
  assert.equal((await login.POST(request("{}"))).status,503);
  process.env.ADMIN_PASSWORD = saved;
});
test("successful login sets a signed HttpOnly Secure SameSite cookie", async () => {
  const saved = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  const response = await login.POST(request(JSON.stringify({password:process.env.ADMIN_PASSWORD})));
  assert.equal(response.status,200);
  const cookie = response.headers.get("set-cookie");
  assert.match(cookie,/HttpOnly/i);
  assert.match(cookie,/Secure/i);
  assert.match(cookie,/SameSite=strict/i);
  assert.equal(session.validSession(cookie.split(";")[0].split("=")[1]),true);
  if (saved === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = saved;
});
test("login rate limiting eventually rejects repeated attempts", async () => {
  let response;
  for (let i=0;i<21;i++) response = await login.POST(request("{}"));
  assert.equal(response.status,429);
});

const { NextRequest } = require("next/server");
const validation = load("lib/staff-validation.ts");
const recordId = "b8d59f1d-c602-4f1a-92a4-cc4841d9a3d2";
function harness(results = [{data:[],error:null}], configured = true) {
  const calls = [];
  let connections = 0;
  const db = { from(table) {
    calls.push(["from",table]);
    const chain = { then(resolve,reject) { return Promise.resolve(results.shift() ?? {data:[],error:null}).then(resolve,reject); } };
    for (const method of ["select","order","range","or","limit","eq","maybeSingle","single","update","insert","delete"]) {
      chain[method] = (...args) => { calls.push([method,...args]); return chain; };
    }
    return chain;
  }};
  const api = load("app/api/staff/route.ts", {
    "@/lib/session":session, "@/lib/staff-validation":validation,
    "@/lib/supabase": {getServerDatabase() { connections++; if(!configured)throw Error("missing"); return db; }},
  });
  const call = (payload, options={}) => api.POST(new NextRequest("https://checkin.example/api/staff", {
    method:"POST", headers: {
      Origin: options.origin ?? "https://checkin.example",
      "Content-Type": options.contentType ?? "application/json",
      Cookie: options.cookie ?? session.SESSION_COOKIE+"="+session.createSession(),
    }, body: options.raw ?? JSON.stringify(payload),
  }));
  return {call,calls,connections:()=>connections};
}
test("staff API rejects absent, forged, expired sessions and cross-origin requests before database access",async()=>{
  const h=harness();
  for(const cookie of ["",session.SESSION_COOKIE+"=true",session.SESSION_COOKIE+"="+session.createSession(Date.now()-9*3600000)]) {
    assert.equal((await h.call({action:"list"},{cookie})).status,401);
  }
  assert.equal((await h.call({action:"list"},{origin:"https://evil.example"})).status,403);
  assert.equal(h.connections(),0);
});
test("staff API rejects arbitrary tables, bulk deletes, unknown fields, malformed IDs and invalid dates",async()=>{
  const h=harness();
  for(const payload of [
    {action:"sql",sql:"delete from attendees"}, {action:"list",table:"auth.users"},
    {action:"delete"}, {action:"delete",id:"neq.*"}, {action:"delete",id:recordId,all:true},
    {action:"update",id:recordId,changes:{role:"admin"}},
    {action:"update",id:recordId,changes:{checked_in_at:"2026-01-01"}},
    {action:"checkin",id:recordId,checked:"true"},
    {action:"settingsWrite",value:"2026-02-30"},
    {action:"import",rows:[]}, {action:"import",rows:[{}]},
    {action:"count",filter:"email"}
  ]) assert.equal((await h.call(payload)).status,400,JSON.stringify(payload));
  assert.equal(h.connections(),0);
});
test("staff API bounds bodies and validates JSON and content type",async()=>{
  const h=harness();
  assert.equal((await h.call({}, {raw:"{"})).status,400);
  assert.equal((await h.call({}, {raw:"x".repeat(5_000_001)})).status,413);
  assert.equal((await h.call({}, {contentType:"text/plain"})).status,415);
  assert.equal(h.connections(),0);
});
test("staff API fails closed without server configuration and hides database error details",async()=>{
  assert.equal((await harness([],false).call({action:"list"})).status,503);
  const h=harness([{error:{message:"secret credential and private SQL"},data:null}]);
  const response=await h.call({action:"get",id:recordId});
  assert.equal(response.status,502);
  assert.equal((await response.text()).includes("secret credential"),false);
  assert.match(response.headers.get("cache-control"),/no-store/);
});
test("check-in writes server timestamps and only the selected attendee",async()=>{
  const h=harness([{data:{id:recordId,checked_in:true},error:null}]);
  const response=await h.call({action:"checkin",id:recordId,checked:true});
  assert.equal(response.status,200);
  assert.ok(h.calls.some(c=>c[0]==="eq"&&c[1]==="id"&&c[2]===recordId));
  const updates=h.calls.find(c=>c[0]==="update")[1];
  assert.equal(updates.checked_in,true);
  assert.ok(Math.abs(Date.now()-Date.parse(updates.checked_in_at))<5000);
  assert.equal(response.headers.get("vary"),"Cookie");
});
test("search constructs only the three intended filters",async()=>{
  const h=harness();
  assert.equal((await h.call({action:"search",search:'Ada%,id.neq.*,"('})).status,200);
  const filter=h.calls.find(c=>c[0]==="or")[1];
  assert.equal(filter.split(",").length,3);
  assert.equal(filter.includes("id.neq"),false);
  assert.ok(h.calls.some(c=>c[0]==="limit"&&c[1]===25));
});
test("list paginates beyond the default database row limit",async()=>{
  const h=harness([{data:Array.from({length:500},()=>({id:recordId})),error:null},{data:[{id:"last"}],error:null}]);
  const response=await h.call({action:"list"});
  assert.equal((await response.json()).data.length,501);
  assert.deepEqual(h.calls.filter(c=>c[0]==="range"),[["range",0,499],["range",500,999]]);
});
test("imports are validated, atomic inserts and cannot overwrite IDs or existing check-ins",async()=>{
  const row={id:recordId,first_name:"Test",last_name:"Person",full_name:"Test Person",email:"TEST@example.invalid",company:"Example",ticket_type:"Standard",presenting:false,shirt_size:"M",shirt_type:"STANDARD",shirt_reasons:[],badge_still_needed:false,checked_in:true,checked_in_at:"2020-01-01",badge_printed_at:null};
  const h=harness([{data:null,error:null}]);
  const response=await h.call({action:"import",rows:[row]});
  assert.equal(response.status,200);
  const inserted=h.calls.find(c=>c[0]==="insert")[1][0];
  assert.notEqual(inserted.id,recordId);
  assert.equal(inserted.checked_in,false);
  assert.equal(inserted.checked_in_at,null);
  assert.equal(inserted.email,"test@example.invalid");
  assert.equal(h.calls.some(c=>["delete","update"].includes(c[0])),false);
  const invalid=harness();
  assert.equal((await invalid.call({action:"import",rows:[row,{...row,shirt_type:"ADMIN"}]})).status,400);
  assert.equal(invalid.connections(),0);
});
test("individual deletion and badge/settings updates stay narrowly scoped",async()=>{
  for(const action of ["delete","badge","get","update"]) {
    const h=harness([{data:{id:recordId},error:null}]);
    const payload={action,id:recordId};
    if(action==="update")payload.changes={company:"Updated",presenting:false};
    assert.equal((await h.call(payload)).status,200);
    assert.ok(h.calls.some(c=>c[0]==="eq"&&c[1]==="id"&&c[2]===recordId));
  }
  const h=harness([{data:{value:"2026-09-16"},error:null}]);
  assert.equal((await h.call({action:"settingsWrite",value:"2026-09-16"})).status,200);
  assert.ok(h.calls.some(c=>c[0]==="eq"&&c[1]==="key"&&c[2]==="badge_cutoff_date"));
});

