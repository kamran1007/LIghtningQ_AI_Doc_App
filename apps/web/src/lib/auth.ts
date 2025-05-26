"use server";

import { redirect } from "next/navigation";
import { BACKEND_URL } from "./constants";
import {
  FormState,
  LoginFormSchema
} from "./types";
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

  const response = await fetch(
    `${BACKEND_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    }
  );

  

  if (response.ok) {
    const result = await response.json();
    // TODO: Create The Session For Authenticated User.

    await createSession({
      user: {
        id: result.id,
        email: result.Email,
        name: result.Name,
        RoleId: result.roleId, // Default to 2 if roleId is not provided
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    redirect("/dashboard");
  } else {
    return {
      message:
        response.status === 401
          ? "Invalid Credentials!"
          : "An error occurred. Please try again.",
    };
  }
}

export const refreshToken = async (
  oldRefreshToken: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: oldRefreshToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to refresh token" + response.statusText
      );
    }

    const { accessToken, refreshToken } =
      await response.json();
    // update session with new tokens
    const updateRes = await fetch(
      "http://localhost:3000/api/auth/update",
      {
        method: "POST",
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      }
    );
    if (!updateRes.ok)
      throw new Error("Failed to update the tokens");

    return accessToken;
  } catch (err) {
    console.error("Refresh Token failed:", err);
    return null;
  }
};

