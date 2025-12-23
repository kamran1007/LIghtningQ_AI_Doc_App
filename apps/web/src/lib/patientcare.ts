import axios from "axios";

import { BACKEND_URL } from "./constants";

import { getSession } from "./session";

//Allergies
export const fetchPatientAllergies = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/patientallergies`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

//Language spoken

export const fetchLanguagesSpoken = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/languages`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

//past medical history

export const fetchPastMedical = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/medical-history`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

// tagpatient

export const fetch = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/tagspatient`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

//register patient

export const AddUpdatePatient = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending patient  data:", payload);
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/upsertPatient`,
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

export interface PatientFilter {
  page?: number;
  limit?: number;
  organizationId?: number;
  hospitalId?: number;
  search?: string;
  city?: string;
  tagPatientId?: number;
  gender?: string;
  minAge?: number; // <-- add this
  maxAge?: number; // <-- add this
}

export const GetFilterSearchPatient = async (filters: PatientFilter = {}) => {
  const session = await getSession();

  const {
    page = 1,
    limit = 10,
    hospitalId,
    organizationId,
    search,
    city,
    tagPatientId,
    gender,
    minAge,
    maxAge,
  } = filters;

  try {
    const params = new URLSearchParams();

    params.append("page", String(page));
    params.append("limit", String(limit));

    if (organizationId) params.append("organizationId", String(organizationId));
    if (hospitalId) params.append("hospitalId", String(hospitalId));
    if (search) params.append("search", search);
    if (city) params.append("city", city);
    if (tagPatientId) params.append("tagPatientId", String(tagPatientId));
    if (gender) params.append("gender", gender);
    if (minAge) params.append("minAge", String(minAge));
    if (maxAge) params.append("maxAge", String(maxAge));

    const res = await axios.get(
      `${BACKEND_URL}/patientcare/getallpatientdetail?${params.toString()}`,
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

export const startConsultationApi = async (
  appointmentId: number,
  userId: number
) => {
  const session = await getSession();

  try {
    const res = await axios.post(
      `${BACKEND_URL}/patientcare/${appointmentId}/start`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("❌ Start Consultation Error:", message);
    throw new Error(message);
  }
};

export const completeConsultation = async (appointmentId:number, consultationId:number) => {
  const session = await getSession();

  return axios.post(
    `${BACKEND_URL}/patientcare/${appointmentId}/complete`,
    { consultationId }, // 👈 correct
    {
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    }
  );
};



export const markIncomplete = async (appointmentId: number, consultationId: number) => {
  const session = await getSession();

  return axios.post(
    `${BACKEND_URL}/patientcare/${appointmentId}/incomplete`,
    { consultationId },
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
};


export interface PatientFilter {
  page?: number;
  limit?: number;
  organizationId?: number;
  hospitalId?: number;
  search?: string;
  specializationId?: number;
  fromDate?: string; // <-- add this
  toDate?: string; // <-- add this
}

export const GetPatientFollowUp = async (filters: PatientFilter = {}) => {
  const session = await getSession();

  const {
    page = 1,
    limit = 10,
    hospitalId,
    organizationId,
    search,
    specializationId,
    fromDate,
    toDate,
  } = filters;

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (organizationId) params.append("organizationId", String(organizationId));
  if (hospitalId) params.append("hospitalId", String(hospitalId));
  if (search) params.append("search", search);
  if (specializationId)
    params.append("specializationId", String(specializationId));
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  const res = await axios.get(
    `${BACKEND_URL}/patientcare/followups?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};


//Auto Save
