import { axiosInstance } from "@/lib/axios";
import type { LoginPayload, RegisterPayload } from "./types";

export const authApi = {
  register: (data: RegisterPayload) =>
    axiosInstance.post("/auth/register", data),

  login: (data: LoginPayload) =>
    axiosInstance.post("/auth/login", data),

  logout: () =>
    axiosInstance.post("/auth/logout"),

  me: () =>
    axiosInstance.get("/auth/me"),

  refresh: () =>
    axiosInstance.post("/auth/refresh"),
};
