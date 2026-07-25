import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "budget_calc_token";

const publicRoutes = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isPublic = publicRoutes.has(pathname);

  // Not authenticated + protected route → redirect to login
  if (!token && !isPublic) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated + auth page → redirect to dashboard
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
