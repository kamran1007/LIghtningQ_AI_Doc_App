"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import { FormState, LoginFormSchema } from "./types";
import { createSession } from "./session";
// import { createSession, updateTokens } from "./session";

// import { createSession } from "./session";

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(BACKEND_URL);
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validatedFields.data),
    credentials: "include", // 🔹 so cookie gets set
  });

  if (response.ok) {
    const result = await response.json();
    // TODO: Create The Session For Authenticated User.
    console.log("Login successful:", result);

    await createSession({
      user: {
        id: result.user.UserId,
        email: result.user.email,
        name: result.user.firstName + " " + result.user.lastName,
        RoleId: result.user.roleId,
        OrganizationId: result.user.organizationId,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken, // also fix refreshToken here
    });

    // redirect("/dashboard");
  } else {
    return {
      message:
        response.status === 401
          ? "Invalid Credentials!"
          : "An error occurred. Please try again.",
    };
  }
}

export const refreshToken = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      credentials: "include", // 🔹 send cookie automatically
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { accessToken } = await response.json();
    return { accessToken };
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};


// export const refreshToken = async (oldRefreshToken: string) => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${oldRefreshToken}`, // 🔑 send in header
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to refresh token" + response.statusText);
//     }

//     const { accessToken, refreshToken } = await response.json();
//     // update session with new tokens
//     const updateRes = await fetch("http://localhost:3000/api/auth/update", {
//       method: "POST",
//       body: JSON.stringify({
//         accessToken,
//         refreshToken,
//       }),
//     });
//     if (!updateRes.ok) throw new Error("Failed to update the tokens");
//     console.log("refresh token has relesed", accessToken);

//     return accessToken;
//   } catch (err) {
//     console.error("Refresh Token failed:", err);
//     return null;
//   }
// };