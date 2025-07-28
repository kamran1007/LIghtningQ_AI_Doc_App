import axios from "axios";

import { BACKEND_URL } from "./constants";

import { getSession } from "./session";


//vitals API integration

export const AddUpdateVitals = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending vitals  data:", payload);
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/addUpdatepatientvitals`,
      payload, // this is the actual body
      {
        headers: {
          // "Content-Type": 'multipart/form-data',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("❌ API Error:", message);
    throw new Error(message); // important: propagate to caller
  }
};


// Fetch vitals with history
export const getVitalsWithHistory = async (appointmentId: number) => {
  const session = await getSession();

  try {
    const res = await axios.get(
      `${BACKEND_URL}/patientcare/getvitals/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("❌ API Error:", message);
    throw new Error(message); // important: propagate to caller
  }
};

//consultation API integration
// Add or update chief complaint
// This function sends a PATCH request to update or add a chief complaint for a patient.  
export const AddUpdatechiefComplaint = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending vitals  data:", payload);
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/addupdatechiefcomplaint`,
      payload, // this is the actual body
      {
        headers: {
          // "Content-Type": 'multipart/form-data',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("❌ API Error:", message);
    throw new Error(message); // important: propagate to caller
  }
};

//GET chief complaint
export const FetchDoctorRole = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/Getchiefcomplaint`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};
