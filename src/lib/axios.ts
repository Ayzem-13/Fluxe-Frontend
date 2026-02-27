import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("[axios] VITE_API_URL is not defined. Check your .env file.");
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor — reads token from localStorage to avoid circular dependency with the store
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — silent token refresh on 401
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown = null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(undefined)));
  pendingQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Queue concurrent requests while a refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: () => resolve(axiosInstance(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newToken: string = res.data.accessToken;

      localStorage.setItem("accessToken", newToken);

      // Dynamic import to avoid circular dependency: axios → store → slice → api → axios
      const { store } = await import("@/app/store");
      const { setAccessToken } = await import("@/domains/auth/slice");
      store.dispatch(setAccessToken(newToken));

      flushQueue();
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      localStorage.removeItem("accessToken");

      try {
        const { store } = await import("@/app/store");
        const { setAccessToken } = await import("@/domains/auth/slice");
        store.dispatch(setAccessToken(""));
      } catch {
        // If the dynamic import fails, the empty localStorage will redirect on next render
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);