import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/analyze", "/results", "/api/analyze", "/api/stream"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const cookie = request.cookies.get("access")?.value;
  if (cookie && cookie.length > 0) return NextResponse.next();

  // API routes cannot be redirected — return 401 so the client handles it
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/access", request.url);
  loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/analyze(.*)", "/results(.*)", "/api/analyze(.*)", "/api/stream(.*)"],
};
