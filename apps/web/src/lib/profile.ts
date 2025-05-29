// lib/profile.ts
import axios from '@/lib/axios';
import { getSession } from "./session";

export const updateProfile = async (formData: FormData) => {
  const session = await getSession();

  try {
    const response = await axios.patch('/auth/Updateprofile', formData, {
      withCredentials: true, 
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${session?.accessToken}`,

      },
    });

    return response.data; // ✅ Now TypeScript knows response is defined
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error; // Rethrow or handle gracefully
  }
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  const session = await getSession();
  console.log("Updaate password session",session)
  console.log("AccessToken:", session?.accessToken);

  try {
    const response = await axios.patch(
      '/auth/changepassword',
      { currentPassword, newPassword },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${session?.accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};