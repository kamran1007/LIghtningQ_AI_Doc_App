import axios from "axios";

import { BACKEND_URL } from "./constants";

import { getSession } from "./session";


export const AddUpdateVitals = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending vitals  data:", payload);
    const res = await axios.post(
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
