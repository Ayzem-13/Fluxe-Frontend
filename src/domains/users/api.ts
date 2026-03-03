import { axiosInstance } from "@/lib/axios";

export const usersApi = {
  getProfile: (id: string) =>
    axiosInstance.get(`/users/${id}`),

  getTweets: (id: string, cursor?: string, limit = 20) =>
    axiosInstance.get(`/users/${id}/tweets`, {
      params: { limit, ...(cursor ? { cursor } : {}) },
    }),

  updateMe: (data: { bio?: string; avatar?: string }) =>
    axiosInstance.put("/users/me", data),

  toggleFollow: (id: string) =>
    axiosInstance.post(`/users/${id}/follow`),
};
