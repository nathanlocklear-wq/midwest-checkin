import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Allow the login page through
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const auth = request.cookies.get("mwtt_admin_auth");

  if (!auth) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};