"use server";

import axios from "axios";
// import { authFetch } from "./authFetch";
// import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

import { getSession } from "./session";
// import toast from "react-hot-toast";
// import { User } from "app/admin/hospitaluserlist";

export const getallhospitalByUser = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/admin/GetHospitals`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  if (!response.ok) throw new Error("Failed to fetch hospitals");
  return response.json(); // ✅ Parse and return JSON here
};

export const getOrganizationByUser = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/admin/GetOrganization`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  if (!response.ok) throw new Error("Failed to fetch hospitals");
  return response.json(); // ✅ Parse and return JSON here
};

export const addhospitaldetail = async (data: any) => {
  const session = await getSession();

  try {
    console.log("Sending hospital data:", data);
    const response = await axios.post(
      `${BACKEND_URL}/admin/AddHospital`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Error creating hospital:", message);
  }
};

export const updatehospitaldetail = async (id: number, payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending hospital data:", payload);
    const response = await axios.patch(
      `${BACKEND_URL}/admin/UpdateHospital/${id}`,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Error creating hospital:", message);
    // toast.error(message);
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

export const getallusers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  hospitalId?: number | "all",
  roleId?: number | "all",
  organizationId?: number
) => {
  const session = await getSession();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    organizationId: String(organizationId ?? ""),
  });

  if (search) params.append("search", search);
  if (hospitalId && hospitalId !== "all")
    params.append("hospitalId", String(hospitalId));
  if (roleId && roleId !== "all") params.append("roleId", String(roleId));

  const response = await fetch(
    `${BACKEND_URL}/admin/AllUsers?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result?.return;
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

export const getUserRole = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/admin/getUserRole`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  if (!response.ok) throw new Error("Failed to fetch User Role");
  return response.json(); // ✅ Parse and return JSON here
};

export const getUserSpecialization = async () => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/admin/getUserSpecialization`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });

  // const response = await authFetch(`${BACKEND_URL}/auth/protected`);

  if (!response.ok) throw new Error("Failed to fetch User Specialization");
  return response.json(); // ✅ Parse and return JSON here
};
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const addhuserdetail = async (
  formData: FormData
): Promise<ApiResponse> => {
  try {
    const session = await getSession();

    if (!session?.accessToken) {
      throw new Error("Unauthorized: Access token not found.");
    }

    // Debug: Print each field (without serializing large files)
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File] ${value.name}`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const response = await axios.post(
      `${BACKEND_URL}/admin/AddUser`,
      formData,
      {
        withCredentials: true,
        headers: {
          // DO NOT set 'Content-Type' here; Axios will set it automatically
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return {
      success: true,
      message: "User created successfully",
      data: response.data,
    };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error("Error creating user:", message);

    return {
      success: false,
      message,
    };
  }
};

export const Updateuserinfo = async (id: number, payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending user data:", payload);
    const response = await axios.patch(
      `${BACKEND_URL}/admin/UpdateUser/${id}`,
      payload,
      {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Error updating  user:", message);
  }
};

//Timeslot
//addupdate timeslot
export const AddUpdateDoctorTimeSlot = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending doctor TimeSlot data:", payload);
    const res = await axios.post(
      `${BACKEND_URL}/admin/AddUpdateTimeSlot`,
      payload, // this is the actual body
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Error updating doctor TimeSlot:", message);
  }
};

export const CreateTimeSlot = async (data: any) => {
  const session = await getSession();

  try {
    console.log("Sending hospital data:", data);
    const response = await axios.post(
      `${BACKEND_URL}/admin/createtimeslot`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message;
    console.error("Error creating timeslot:", message);
    // toast.error(message);
  }
};

//fetch all timeslots for a user
export const fetchDoctorSlots = async (
  userId: number,
  hospitalId?: number,
  day?: string
) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }
  const params: any = { userId };
  if (hospitalId) params.hospitalId = hospitalId;
  if (day) params.day = day;

  const res = await axios.get(`${BACKEND_URL}/admin/getslots`, {
    params,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return res.data;
};

// Update timeslot
export const UpdateTimeslot = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending timeslot data:", payload);
    const res = await axios.patch(
      `${BACKEND_URL}/admin/update-timeslots`,
      payload, // this is the actual body
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
    console.error("Error updating timeslot:", message);
  }
};

//ADD UPDATE DOCTOR COSTING
export const AddUpdateDoctorCosting = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending doctor costing data:", payload);
    const res = await axios.post(
      `${BACKEND_URL}/admin/AddOrUpdateDoctorCosting`,
      payload, // this is the actual body
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
    console.error("Error updating doctor costing:", message);
  }
};

// Fetch doctor costing
export const fetchDoctorCosting = async (doctorId: number) => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(
    `${BACKEND_URL}/admin/GetDoctorCosting/${doctorId}`,
    {
      params: { doctorId },
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return res.data;
};

//access rights
export const getRolePermissions = async (
  roleId?: number,
  userId?: number,
  hospitalId?: number,
  organizationId?: number
) => {
  if (
    roleId === undefined ||
    userId === undefined ||
    hospitalId === undefined ||
    organizationId === undefined
  ) {
    throw new Error("Missing required parameters for getRolePermissions");
  }

  const session = await getSession();

  const url = new URL(`${BACKEND_URL}/admin/getRolePermissions`);
  url.searchParams.append("roleId", roleId.toString());
  url.searchParams.append("userId", userId.toString());
  url.searchParams.append("hospitalId", hospitalId.toString());
  url.searchParams.append("organizationId", organizationId.toString());

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${session?.accessToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch access rights");
  return response.json();
};

export const addUpdateAccessRight = async (payload: any) => {
  const session = await getSession();

  try {
    console.log("Sending access rights data:", payload);
    const res = await axios.post(
      `${BACKEND_URL}/admin/AddUpdateAccessRight`,
      payload, // this is the actual body
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
    console.error("Error updating access rights:", message);
  }
};

export const fetchAllAccessRightModulesSubmodules = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new Error("Unauthorized: Access token not found.");
  }

  const res = await axios.get(
    `${BACKEND_URL}/admin/getAllAccessRightModulesSubModules`,
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${session?.accessToken}`,
      },
    }
  );
  return res.data;
};
