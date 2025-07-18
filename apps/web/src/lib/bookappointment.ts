import axios from "axios";

import { BACKEND_URL } from "./constants";

import { getSession } from "./session";

//All Specialization
export const FetchDoctorSpecialization = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getallSpecialization`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

//Get All DoctorRole

export const FetchDoctorRole = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getAlldoctoRole`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

export const BookAppointment = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending patient  data:", payload);
    const res = await axios.post(
      `${BACKEND_URL}/patientcare/quickbookappointment`,
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

//updateAppointment
export const UpdateAppointment = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending patient  data:", payload);
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/updateappointment`,
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

export const getAllPaymentMode = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getAllPaymentMode`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

export const getAllAppointmentType = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getAllVisitType`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

export const getAllTagPatientType = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getAllTagType`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};


//get apppointment 

export const GetFilterSearchappointment = async (
  filters: {
    search?: string;
    appointmentDate?: string;
    appointmentDateFrom?: string;
    appointmentDateTo?: string;
    gender?: string;
    page?: 1;
    limit?: 10;
  } = {}
) => {
  const session = await getSession();

  try {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) query.append(key, val.toString());
    });

    const res = await axios.get(
      `${BACKEND_URL}/patientcare/searchappointment?${query.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("❌ API Error:", message);
    throw new Error(message);
  }
};

