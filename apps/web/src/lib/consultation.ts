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
export const AddUpdatechiefComplaint = async (data: {
  ChiefComplainTagName: string;
  SpecializationId?: number;
  specializationId?: number;
  ChiefComplaintTagId?: number;
}) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.patch(
    `${BACKEND_URL}/patientcare/addupdatechiefcomplaint`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};

//GET chief complaint
export const FetchChiefComplaint = async () => {
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

// Add or update investigations
export const AddUpdateInvestigation = async (data: {
  InvestigationSubTypename: string;
  InvestigationTypeId: number;
  InvestigationSubTypeId?: number;
}) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.patch(
    `${BACKEND_URL}/patientcare/addupdateInvestigationSubType`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};
// GET investigations
export const FetchInvestigation = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(
    `${BACKEND_URL}/patientcare/GetInvestigationMasterData`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return res.data;
};

// Add or update diagnosis
export const AddUpdateDiagnosis = async (data: {
  DiagnosisName: string;
  specializationId: number;
  icdCode?: string;
  DiagnosisId?: string;
}) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.patch(
    `${BACKEND_URL}/patientcare/addupdatediagnosis`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};

// GET diagnosis

export const FetchDiagnosis = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getAllDiagnosis`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

// Add or update medication
export const addupdateMedicine = async (data: any) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.patch(
    `${BACKEND_URL}/patientcare/addupdateMedicine`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};

// Fetch all medications
export const FetchMedication = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getAllMedicine`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

// Add or update procedure
export const addupdateProcedure = async (data: any) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.patch(
    `${BACKEND_URL}/patientcare/addupdateprocedure`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};

// Fetch all procedure
export const FetchProcedure = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getprocedure`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

export const addupdateConsultation = async (data: any) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.post(
    `${BACKEND_URL}/patientcare/addupdateconsultation`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  return res.data;
};

// Fetch all medications
export const FetchPatientAppointment = async (patientId: number) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(
    `${BACKEND_URL}/patientcare/getPatientAppointment/${patientId}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return res.data;
};

export const Patientappointmentcasesheet = async (appointmentId: number) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(
    `${BACKEND_URL}/patientcare/Patientappointmentcasesheet/${appointmentId}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return res.data;
};


export const GetPatientMedications = async (patientId: number) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(
    `${BACKEND_URL}/patientcare/getPatientMedications/${patientId}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return res.data;
};
