import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Block .php, .asp, .jsp, etc.
  if (url.match(/\.(php|asp|jsp)$/i)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Proceed with your Supabase session update
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
