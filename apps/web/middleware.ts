import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./src/lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  console.log("middleware: session = ", session);

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  return NextResponse.next(); // ✅ MUST RETURN THIS
}

export const config = {
  matcher: ["/dashboard", "/profile"],
};
