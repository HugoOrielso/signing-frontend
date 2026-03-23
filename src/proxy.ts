import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;

  // Si no hay sesión → redirige al home
  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si el refresh token falló → redirige al home
  if (session.error?.startsWith("RefreshFailed")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};