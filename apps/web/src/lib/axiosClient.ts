import axios from "axios";
import { store } from "@/store";
import { setTokens, clearUser } from "@/store/authSlice";
import { BACKEND_URL } from "./constants";

export const axiosClient = axios.create({
  baseURL: BACKEND_URL ?? "http://localhost:8000",
  withCredentials: true, // send cookies (refresh token)
  headers: { "Content-Type": "application/json" },
});

// Attach access token from Redux
axiosClient.interceptors.request.use((config) => {
  const token = store.getState()?.auth?.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - auto-refresh access token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) return Promise.reject(error);
    if (error.response?.status !== 401) return Promise.reject(error);

    originalRequest._retry = true;

    try {
      // call refresh endpoint (cookie is sent automatically)
      const refreshRes = await axiosClient.post("/auth/refresh", {}, { withCredentials: true });
      const { accessToken, refreshToken } = refreshRes.data;

      if (!accessToken) throw new Error("Refresh failed: no accessToken");

      // Update Redux
      store.dispatch(setTokens({ accessToken, refreshToken }));

      // Update SSR session
      await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      // retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      store.dispatch(clearUser());
      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;
