"use server";

import axios from "axios";
// import { authFetch } from "./authFetch";
// import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

import { getSession } from "./session";
import toast from "react-hot-toast";

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

