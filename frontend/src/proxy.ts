import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export function proxy(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/login";
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isAdminPath && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPath && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
