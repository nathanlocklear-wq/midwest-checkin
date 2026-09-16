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
