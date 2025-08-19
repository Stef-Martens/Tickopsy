import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

const allowedPaths = [
  "/",
  "/dashboard",
  "/get-started",
  "/about",
  "/login",
  "/contact",
  "/api/(.*)",
  "/_next/(.*)",
  "/favicon.ico",
  "/.*\\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAllowed = allowedPaths.some((pattern) =>
    new RegExp(`^${pattern}$`).test(pathname)
  );

  if (!isAllowed) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return await updateSession(request);
}

export const config = {
  matcher: ["/:path*"],
};
