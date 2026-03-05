import { axiosInstance } from "@/lib/axios";

export const usersApi = {
  getProfile: (id: string) =>
    axiosInstance.get(`/users/${id}`),

  getTweets: (id: string, cursor?: string, limit = 20) =>
    axiosInstance.get(`/users/${id}/tweets`, {
      params: { limit, ...(cursor ? { cursor } : {}) },
    }),

  getRetweets: (id: string, cursor?: string, limit = 20) =>
    axiosInstance.get(`/users/${id}/retweets`, {
      params: { limit, ...(cursor ? { cursor } : {}) },
    }),

  updateMe: (data: { username?: string; bio?: string; avatar?: string | null }) =>
    axiosInstance.put("/users/me", data),

  toggleFollow: (id: string) =>
    axiosInstance.post(`/users/${id}/follow`),
};
