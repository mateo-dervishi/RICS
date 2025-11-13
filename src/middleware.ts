import { NextResponse } from "next/server";

export async function middleware() {
  // Simplified middleware - no authentication checks
  // All routes are accessible without authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
