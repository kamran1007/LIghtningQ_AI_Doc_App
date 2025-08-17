import axios from "axios";
import { getSession } from "./session";
import { BACKEND_URL } from "./constants";

export const FetchDashboardsummary = async (
  startDate?: string,
  endDate?: string,
  doctorId?: number,
  hospitalId?: number,
  specializationId?: number
) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const queryParams = new URLSearchParams();

  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (doctorId !== undefined)
    queryParams.append("doctorId", doctorId.toString());
  if (hospitalId !== undefined)
    queryParams.append("hospitalId", hospitalId.toString());
  if (specializationId !== undefined)
    queryParams.append("specializationId", specializationId.toString());

  const res = await axios.get(
    `${BACKEND_URL}/dashboard/Dashboardsummary?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  return res.data;
};

export const FetchPatientDemographics = async (
  startDate?: string,
  endDate?: string,
  doctorId?: number,
  hospitalId?: number,
  specializationId?: number
) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const queryParams = new URLSearchParams();

  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (doctorId !== undefined)
    queryParams.append("doctorId", doctorId.toString());
  if (hospitalId !== undefined)
    queryParams.append("hospitalId", hospitalId.toString());
  if (specializationId !== undefined)
    queryParams.append("specializationId", specializationId.toString());

  const res = await axios.get(
    `${BACKEND_URL}/dashboard/PatientDemographics?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  return res.data;
};

export const FetchHospital = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(`${BACKEND_URL}/dashboard/getAllHospital`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

export const FetchAdvancedReport = async (
  startDate?: string,
  endDate?: string,
  doctorId?: number,
  hospitalId?: number,
  specializationId?: number
) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const queryParams = new URLSearchParams();

  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (doctorId !== undefined)
    queryParams.append("doctorId", doctorId.toString());
  if (hospitalId !== undefined)
    queryParams.append("hospitalId", hospitalId.toString());
  if (specializationId !== undefined)
    queryParams.append("specializationId", specializationId.toString());

  const res = await axios.get(
    `${BACKEND_URL}/dashboard/AdvancedReport?${queryParams.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  return res.data;
};

export const AddReportSchedular = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending Report Array data:", payload);
    const res = await axios.post(
      `${BACKEND_URL}/dashboard/ReportSchedular`,
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

export const getReportsSchedularByUser = async (
  adminId: number,
  hospitalId: number
) => {
  const session = await getSession();

  try {
    const res = await axios.get(
      `${BACKEND_URL}/dashboard/getReportsSchedular?adminId=${adminId}&hospitalId=${hospitalId}`,
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

export const UpdateReportSchedular = async (
  ScheduledReportId: number,
  dto: { frequency?: string; reportTypes?: string[]; nextRunAt?: string }
) => {
  const session = await getSession();

  try {
    const res = await axios.patch(
      `${BACKEND_URL}/dashboard/UpdateReportSchedular/${ScheduledReportId}`, // ✅ fixed URL
      dto, // ✅ send body (UpdateScheduledReportDto)
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
