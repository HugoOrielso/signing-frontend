import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export default auth(async (req: NextRequest) => {

  try {
    const session = await auth();

    // Si no hay sesión → redirige al home
    if (!session) {
      const signInUrl = new URL("/", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    if ((session?.error as string)?.startsWith("RefreshFailed")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch {
    const signInUrl = new URL("/", req.url);
    return NextResponse.redirect(signInUrl);
  }

});

export const config = {
  matcher: ["/dashboard/:path*"],
};