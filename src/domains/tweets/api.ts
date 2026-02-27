import { axiosInstance } from "@/lib/axios";
import type { CreateTweetPayload, UpdateTweetPayload } from "./types";

export const tweetsApi = {
  getAll: (cursor?: string, limit = 20) =>
    axiosInstance.get("/tweets", {
      params: { limit, ...(cursor ? { cursor } : {}) },
    }),

  create: (data: CreateTweetPayload) =>
    axiosInstance.post("/tweets", data),

  update: ({ id, content }: UpdateTweetPayload) =>
    axiosInstance.put(`/tweets/${id}`, { content }),

  remove: (id: string) =>
    axiosInstance.delete(`/tweets/${id}`),
};
