import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
export const SESSION_COOKIE = "mwtt_admin_auth";
export const SESSION_SECONDS = 8 * 60 * 60;
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("Session secret is not configured");
  return value;
}
export function createSession(now = Date.now()) {
  const payload = `${Math.floor(now / 1000) + SESSION_SECONDS}.${randomBytes(24).toString("hex")}`;
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("hex")}`;
}
export function validSession(token: string | undefined, now = Date.now()) {
  if (!token || token.length > 200) return false;
  const match = /^(\d{10})\.([a-f0-9]{48})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  const seconds = Math.floor(now / 1000);
  if (expires <= seconds || expires > seconds + SESSION_SECONDS) return false;
  try {
    const expected = createHmac("sha256", secret()).update(`${match[1]}.${match[2]}`).digest();
    return timingSafeEqual(expected, Buffer.from(match[3], "hex"));
  } catch { return false; }
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
