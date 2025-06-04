"use server";

// import { authFetch } from "./authFetch";
// import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

import { getSession } from "./session";

export const getallhospitalByUser = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/admin/GetHospitals`, {
    
    headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  if (!response.ok) throw new Error('Failed to fetch hospitals');
  return response.json(); // ✅ Parse and return JSON here
};