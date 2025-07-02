// import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "./src/lib/session";

// export default async function middleware(req: NextRequest) {
//   const session = await getSession();
//   console.log("middleware: session = ", session);

//   if (!session || !session.user) {
//     return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
//   }

//   return NextResponse.next(); // ✅ MUST RETURN THIS
// }

// export const config = {
//   matcher: ["/dashboard", "/profile"],
// };

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Must match SESSION_SECRET_KEY in .env
const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    // ✅ Token is valid → allow request to proceed
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid token in middleware:", err);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/profile","/admin","/appointment", "/displays", "/flow", "/settings"],
};
