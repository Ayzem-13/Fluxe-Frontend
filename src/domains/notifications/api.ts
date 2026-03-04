import { axiosInstance } from "@/lib/axios";

export const notificationsApi = {
  getAll: (cursor?: string, limit = 20) =>
    axiosInstance.get("/notifications", {
      params: { limit, ...(cursor ? { cursor } : {}) },
    }),

  markAsRead: (id: string) =>
    axiosInstance.put(`/notifications/${id}/read`, {}),
};
