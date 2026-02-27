import axios from "axios";
import type { LoginPayload, RegisterPayload } from "./types";

const API_URL = "http://localhost:3000";

export const authApi = {
  register: (data: RegisterPayload) =>
    axios.post(`${API_URL}/auth/register`, data),

  login: (data: LoginPayload) =>
    axios.post(`${API_URL}/auth/login`, data, { withCredentials: true }),

  logout: () =>
    axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }),

  me: (token: string) =>
    axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
