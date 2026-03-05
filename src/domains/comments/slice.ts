import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commentsAPI } from "./api";
import type { CommentsState, CreateCommentPayload, UpdateCommentPayload } from "./types";
import type { RootState } from "@/app/store";

const initialState: CommentsState = {
  byTweetId: {},
  isLoading: {},
  error: null,
};

export const fetchComments = createAsyncThunk(
  "comments/fetchByTweetId",
  async ({ tweetId, limit = 10, cursor }: { tweetId: string; limit?: number; cursor?: string }) => {
    const { data } = await commentsAPI.getByTweetId(tweetId, limit, cursor);
    return { tweetId, ...data };
  }
);

export const createComment = createAsyncThunk(
  "comments/create",
  async (payload: CreateCommentPayload) => {
    const { data } = await commentsAPI.create(payload);
    return { tweetId: payload.tweetId, comment: data };
  }
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async (payload: UpdateCommentPayload) => {
    const { data } = await commentsAPI.update(payload);
    return data;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async ({ id, tweetId }: { id: string; tweetId: string }) => {
    await commentsAPI.delete(id);
    return { id, tweetId };
  }
);

export const likeComment = createAsyncThunk(
  "comments/like",
  async ({ id, tweetId }: { id: string; tweetId: string }, { getState }) => {
    const userId = (getState() as RootState).auth.user?.id;
    const { data } = await commentsAPI.like(id);
    return { id, tweetId, userId, ...data };
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        state.isLoading[action.meta.arg.tweetId] = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { tweetId, comments } = action.payload;
        state.byTweetId[tweetId] = comments;
        state.isLoading[tweetId] = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading[action.meta.arg.tweetId] = false;
        state.error = action.error.message || "Erreur lors du chargement des commentaires";
      })

      .addCase(createComment.rejected, (state, action) => {
        state.error = action.error.message || "Erreur lors de la création du commentaire";
      })

      .addCase(createComment.fulfilled, (state, action) => {
        const { tweetId, comment } = action.payload;
        if (!state.byTweetId[tweetId]) {
          state.byTweetId[tweetId] = [];
        }
        state.byTweetId[tweetId].unshift(comment);
      })

      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.error.message || "Erreur lors de la modification du commentaire";
      })

      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        for (const comments of Object.values(state.byTweetId)) {
          const index = comments.findIndex((c) => c.id === updatedComment.id);
          if (index !== -1) {
            comments[index] = updatedComment;
            break;
          }
        }
      })

      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.error.message || "Erreur lors de la suppression du commentaire";
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        const { id, tweetId } = action.payload;
        if (state.byTweetId[tweetId]) {
          state.byTweetId[tweetId] = state.byTweetId[tweetId].filter((c) => c.id !== id);
        }
      })

      .addCase(likeComment.rejected, (state, action) => {
        state.error = action.error.message || "Erreur lors du like du commentaire";
      })

      .addCase(likeComment.fulfilled, (state, action) => {
        const { id, tweetId, liked, userId } = action.payload;
        const comment = state.byTweetId[tweetId]?.find((c) => c.id === id);
        if (comment && userId) {
          if (liked) {
            if (!comment.likes.some((l) => l.userId === userId)) {
              comment.likes.push({ userId });
            }
          } else {
            comment.likes = comment.likes.filter((l) => l.userId !== userId);
          }
          comment._count.likes = comment.likes.length;
        }
      });
  },
});

export default commentsSlice.reducer;
