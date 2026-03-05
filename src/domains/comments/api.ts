import { axiosInstance } from "@/lib/axios";
import type { Comment, CreateCommentPayload, UpdateCommentPayload } from "./types";

export const commentsAPI = {
  getByTweetId: (tweetId: string, limit: number = 10, cursor?: string) =>
    axiosInstance.get<{ comments: Comment[]; nextCursor: string | null }>(
      `/comments/tweets/${tweetId}?limit=${limit}${cursor ? `&cursor=${cursor}` : ""}`
    ),

  create: (payload: CreateCommentPayload) =>
    axiosInstance.post<Comment>(`/comments/tweets/${payload.tweetId}`, {
      content: payload.content,
    }),

  update: (payload: UpdateCommentPayload) =>
    axiosInstance.patch<Comment>(`/comments/${payload.id}`, {
      content: payload.content,
    }),

  delete: (id: string) =>
    axiosInstance.delete(`/comments/${id}`),

  like: (id: string) =>
    axiosInstance.post<{ liked: boolean; likesCount: number }>(`/comments/${id}/like`),
};
