import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/landing", "/_next", "/favicon.ico"];
export function middleware(request: NextRequest) {
  const isPublic = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  if (isPublic) return NextResponse.next();
  if (!request.cookies.has("accessToken") && !request.cookies.has("refreshToken")) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!api).*)"] };
