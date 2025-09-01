// // utils/authFetch.ts

// import { refreshToken } from "./auth";

// import { getSession } from "./session";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export const authFetch = async (url: string, options: any = {}) => {
//   const session = await getSession();
//   const accessToken = session?.accessToken; // or however you store it

//   const response = await fetch(`${BACKEND_URL}${url}`, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   // If access token expired → try refresh
//   if (response.status === 401) {
//     console.warn(">>> Access token expired, calling refresh...");
//     const oldRefreshToken = session?.refreshToken; // or however you store it

//     if (oldRefreshToken) {
//       const newAccessToken = await refreshToken(oldRefreshToken);

//       if (newAccessToken) {
//         // retry original request with new access token
//         return fetch(`${BACKEND_URL}${url}`, {
//           ...options,
//           headers: {
//             ...options.headers,
//             Authorization: `Bearer ${newAccessToken}`,
//           },
//         });
//       }
//     }
//   }

//   return response;
// };

// utils/authFetch.ts

import { getSession } from "./session"; // 🔹 add updateTokens
import { clearSession } from "./session.client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const session = await getSession();
  let accessToken = session?.accessToken;

  let response = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers: { ...options.headers, Authorization: accessToken ? `Bearer ${accessToken}` : '' },
    credentials: 'include',
  });

  if (response.status === 401) {
    // 🔹 Token expired, try refresh
    const refreshRes = await fetch('http://localhost:3000/api/auth/update', { method: 'POST', credentials: 'include' });
    if (!refreshRes.ok) {
      await clearSession();
      throw new Error('Session expired');
    }

    const data = await refreshRes.json();
    accessToken = data.accessToken;

    // Retry original request with new token
    response = await fetch(`${BACKEND_URL}${url}`, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
    });
  }

  return response;
};


