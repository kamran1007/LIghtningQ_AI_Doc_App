"use server";

import { cookies } from "next/headers";
import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

import { getSession } from "./session";
import { setSession } from "./session.client";

// export const getProfile = async () => {
//   const session = await getSession();
//   const response = await authFetch(`${BACKEND_URL}/auth/protected`, {
//     // const response = await fetch(`${BACKEND_URL}/auth/protected`, {

//     headers: {
//       authorization: `Bearer ${session?.accessToken}`,
//     },
//   });

//   // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

//   const result = await response.json();
//   console.log("Get User Profile", result);
//   return result;
// };
export const getProfile = async () => {
  const response = await authFetch("/auth/protected");
  const result = await response.json();
  console.log("Get User Profile from auth1111", result);
  // const cookieStore = cookies();
  const session = await getSession();
  console.log("Refresh token :", session?.refreshToken); 
   return result;
};
