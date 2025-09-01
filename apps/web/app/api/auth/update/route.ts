// import { updateTokens } from "@/lib/session";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { accessToken, refreshToken } = body;

//   if (!accessToken || !refreshToken)
//     return new Response("Provide Tokens", { status: 401 });

//   await updateTokens({ accessToken, refreshToken });

//   return new Response("OK", { status: 200 });
// }

// app/api/auth/update/route.ts
// app/api/auth/update/route.ts
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // ✅ In Route Handlers, cookies() must be awaited
    const cookieStore = await cookies();
    console.log("cookies data", cookieStore);

    const refreshToken = cookieStore.get("refresh_token")?.value;
    console.log("refresh token from cookie:", refreshToken);


    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token found" }, { status: 401 });
    }

    // Call backend /auth/refresh
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: `refresh_token=${refreshToken}`, // forward cookie
      },
      credentials: "include",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to refresh" }, { status: 401 });
    }

    const { accessToken } = await res.json();

    // Forward backend Set-Cookie header
    const response = NextResponse.json({ accessToken });
    const backendSetCookie = res.headers.get("set-cookie");
    if (backendSetCookie) {
      response.headers.set("set-cookie", backendSetCookie);
    }

    return response;
  } catch (err) {
    console.error("Error in /api/auth/update:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


