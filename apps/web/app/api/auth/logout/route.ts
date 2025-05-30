// import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
// import { redirect, RedirectType } from "next/navigation";

import { NextRequest, NextResponse } from "next/server";
console.log("🚀 ~ file: route.ts:12 ~ BACKEND_URL:", BACKEND_URL);
// export async function GET(req: NextRequest) {
//   const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
//     method: "POST",
//     credentials: "include",
//   });
//   if (!response.ok) {
//   await deleteSession();
//   }

//   revalidatePath("/");
//   return NextResponse.redirect(new URL("/", req.nextUrl))
// }

export async function GET(req: NextRequest) {
  // Hit backend logout if needed
  await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch((err) => console.error("Backend logout error:", err));


  // Create a response that clears the cookie and redirects
  const response = NextResponse.redirect(new URL("/auth/login", req.url));

  // This actually clears the cookie from the browser
  response.cookies.set("session", "", {
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;

}