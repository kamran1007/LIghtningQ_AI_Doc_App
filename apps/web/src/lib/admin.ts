"use server";

import axios from "axios";
// import { authFetch } from "./authFetch";
// import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

import { getSession } from "./session";
import toast from "react-hot-toast";
// import { User } from "app/admin/hospitaluserlist";

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



export const getOrganizationByUser = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/admin/GetOrganization`, {
    
    headers: {
    'Content-Type': 'application/json',
    authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  if (!response.ok) throw new Error('Failed to fetch hospitals');
  return response.json(); // ✅ Parse and return JSON here
};



export const addhospitaldetail = async (data: any) => {
  const session = await getSession();

  try {
    console.log("Sending hospital data:", data);
    const response = await axios.post(`${BACKEND_URL}/admin/AddHospital`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session?.accessToken}`,
      },
    });

    return response.data;
  } catch (error:any) {
    const message = error.response?.data?.message || error.message;
    console.error('Error creating hospital:', message);
    toast.error(message); 
  }
};

export const updatehospitaldetail  = async (id: number, payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending hospital data:", payload);
    const response = await axios.patch(`${BACKEND_URL}/admin/UpdateHospital/${id}`, payload, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session?.accessToken}`,
      },
    });

    return response.data;
  } catch (error:any) {
    const message = error.response?.data?.message || error.message;
    console.error('Error creating hospital:', message);
    toast.error(message); 
  }
};

//hospital user
// export const getallusers = async () => {
//   const session = await getSession();
//   console.log("Session:", session); // Add this line

//   const response = await fetch(`${BACKEND_URL}/admin/AllUsers`, {
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${session?.accessToken}`,
//     },
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
//   }
//   const result = await response.json();
//   console.log("Fetched users:", result?.return); // ✅ Shows actual users

//   return result?.return; 
// };

// lib/admin.ts

export const getallusers = async (page: number = 1, limit: number = 10) => {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/admin/AllUsers?page=${page}&limit=${limit}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log("Fetched users:", result?.return); // ✅ Shows actual users

  return result?.return;

//   return result?.return;
};

// lib/admin.tsx
type User = {
  UserId: number;
  isActive: boolean;
};
export const toggleStatus = async (user: User): Promise<boolean> => {
  const session = await getSession();
  const newStatus = !user.isActive;
  const url = `${BACKEND_URL}/admin/${newStatus ? "activate" : "deactivate"}/${user.UserId}`;

  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    if (!res.ok) throw new Error("Status update failed");


    return true;
  } catch (err) {
    console.error("Toggle error", err);
    // toast.error("Could not update status");
    return false;
  }
};

