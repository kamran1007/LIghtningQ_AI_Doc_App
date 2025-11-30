// src/lib/billing.ts
import { BACKEND_URL } from "./constants";
import { getSession } from "./session";

/**
 * Create or update a billing item charge
 */
export const createOrUpdateBillingItem = async (payload: any) => {
  try {
    // Get the user session for Bearer token
    const session = await getSession();

    const response = await fetch(
      `${BACKEND_URL}/billing/createUpdateBillingItemCharge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save billing item");
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Billing API Error:", error.message);
    throw error;
  }
};

export const GetBillingItem = async (params: Record<string, any> = {}) => {
  try {
    const session = await getSession();
    const query = new URLSearchParams(params).toString();

    const response = await fetch(
      `${BACKEND_URL}/billing/getBillItem?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch billing items");
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Billing API Error:", error.message);
    throw error;
  }
};

// 🗑️ DELETE Billing Item
export const deleteBillingItemCharge = async (id: number) => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${BACKEND_URL}/billing/deleteBillingItemCharge/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete billing item");
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Delete API Error:", error.message);
    throw error;
  }
};

//Create or Update Patient Bill
export const createUpdatePatientBill = async (payload: any) => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${BACKEND_URL}/billing/createUpdatePatientBill`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save billing item");
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Billing API Error:", error.message);
    throw error;
  }
};

// lib/billing.ts

export const getBillingByPatient = async (patientId: number) => {
  const session = await getSession();

  const res = await fetch(`${BACKEND_URL}/billing/getByPatient/${patientId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.accessToken || ""}`,
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch billing history");
  }

  return res.json();
};

export const CancelBill = async (
  billingTransactionId: number,
  reason: string
) => {
  const session = await getSession();

  const res = await fetch(
    `${BACKEND_URL}/billing/cancelBill/${billingTransactionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken || ""}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Cancel bill failed");
  }

  return res.json();
};

//Create or Update package usage
export const addupdatePatientPackageUsage = async (payload: any) => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${BACKEND_URL}/billing/addupdatePatientPackageUsage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save billing item");
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Billing API Error:", error.message);
    throw error;
  }
};


export const getPatientPackageUsage = async (
  PatientPackageUsageId: number,
  patientId: number,
  appointmentId?: number
) => {
  const session = await getSession();

  const url = `${BACKEND_URL}/billing/getPatientPackageUsage?PatientPackageUsageId=${PatientPackageUsageId}&patientId=${patientId}&AppointmentId=${appointmentId || ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.accessToken || ""}`,
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch billing history");
  }

  return res.json();
};


export const addupdatePatientsyncPatientPackageUsage = async (payload: any) => {
  try {
    const session = await getSession();

    const response = await fetch(
      `${BACKEND_URL}/billing/syncPatientPackageUsage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken || ""}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save billing item");
    }

    return await response.json();
  } catch (error: any) {
    console.error("❌ Billing API Error:", error.message);
    throw error;
  }
};
