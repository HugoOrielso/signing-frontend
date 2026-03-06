import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login")) {
    if (session && !session.error) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session.error?.startsWith("RefreshFailed")) {
    return NextResponse.redirect(
      new URL("/login?error=SessionExpired", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};