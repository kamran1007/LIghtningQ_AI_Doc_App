import axios from "axios";
import { getSession } from "./session";
import { BACKEND_URL } from "./constants";

export const deleteMedicine = async (MedicineId: number) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/deleteMedicine/${MedicineId}`,
      {},
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

export const deleteChiefComplaintTag = async (ChiefComplaintTagId: number) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/deleteChiefComplaintTag/${ChiefComplaintTagId}`,
      {}, // empty body for soft delete
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

export const deleteinvestigation = async (InvestigationSubTypeId: number) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/deleteInvestigationsubType/${InvestigationSubTypeId}`,
      {}, // empty body for soft delete
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
    throw new Error(message);
  }
};

export const deletediagonasis = async (DiagnosisId: number) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/deleteDiagonasis/${DiagnosisId}`,
      {}, // empty body for soft delete
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
    throw new Error(message);
  }
};


export const deleteprocedure = async (ProcedureId : number) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/deleteprocedure/${ProcedureId}`,
      {}, // empty body for soft delete
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
    throw new Error(message);
  }
};

export const deleteMedicalHistory = async (MedicalHistoryId : number) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/patientcare/deleteMedicalHistory/${MedicalHistoryId}`,
      {}, // empty body for soft delete
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
    throw new Error(message);
  }
};

export const addupdatemedicalhistory = async (data: any) => {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  console.log("📤 Sending to backend:", data); // <- check this

  const res = await axios.patch(
    `${BACKEND_URL}/patientcare/addupdatemedicalhistory`,
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

export const getmedicalhistory = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getmedicalhistory`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};


export const getInvestigationType = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/patientcare/getInvestigationType`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};