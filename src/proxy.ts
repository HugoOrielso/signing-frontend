import { NextRequest, NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

const ADMIN_ACCESS_COOKIE = isProd
  ? "__Secure-admin_accessToken"
  : "admin_accessToken";

const REFRESH_COOKIE_NAME = isProd
  ? "__Secure-admin_refreshToken"
  : "admin_refreshToken";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const defaultAuthenticatedRoute = "/dashboard";

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;


  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Si ya tiene sesión admin, no debe volver al login admin
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL(defaultAuthenticatedRoute, request.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/", request.url);
    const callbackUrl = `${pathname}${search || ""}`;
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};