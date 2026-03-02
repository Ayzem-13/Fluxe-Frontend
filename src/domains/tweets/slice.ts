import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTweets, postTweet, editTweet, removeTweet, toggleLike } from "@/domains/tweets/service";
import type { RootState } from "@/app/store";
import type {
  FeedSort,
  TweetsState,
  CreateTweetPayload,
  UpdateTweetPayload,
} from "@/domains/tweets/types";

const initialState: TweetsState = {
  items: [],
  nextCursor: null,
  isLoading: false,
  isCreating: false,
  error: null,
  hasFetched: false,
  sort: "recent",
};

export const fetchTweets = createAsyncThunk(
  "tweets/fetchAll",
  async (cursor: string | undefined, { rejectWithValue, getState }) => {
    try {
      const sort = (getState() as RootState).tweets.sort;
      return await getTweets(cursor, 20, sort);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const createTweet = createAsyncThunk(
  "tweets/create",
  async (data: CreateTweetPayload, { rejectWithValue }) => {
    try {
      return await postTweet(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateTweet = createAsyncThunk(
  "tweets/update",
  async (data: UpdateTweetPayload, { rejectWithValue }) => {
    try {
      return await editTweet(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const likeTweet = createAsyncThunk(
  "tweets/like",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const userId = (getState() as RootState).auth.user?.id;
      if (!userId) return rejectWithValue("Not authenticated");
      const result = await toggleLike(id);
      return { ...result, userId };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweets/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      return await removeTweet(id);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const tweetsSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    setSort: (state, action: { payload: FeedSort }) => {
      state.sort = action.payload;
      // Reset feed when switching tabs so the new sort fetches fresh data
      state.items = [];
      state.nextCursor = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTweets.pending, (state) => {
        // Only show loading indicator on the initial fetch
        if (state.items.length === 0) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasFetched = true;
        const incoming = action.payload.tweets ?? [];
        if (action.meta.arg) {
          // Cursor-based pagination: append to existing items
          state.items = [...(state.items ?? []), ...incoming];
        } else {
          // Initial fetch: only replace items if new data arrived
          if (incoming.length > 0 || state.items.length === 0) {
            state.items = incoming;
          }
        }
        state.nextCursor = action.payload.nextCursor ?? null;
      })
      .addCase(fetchTweets.rejected, (state, action) => {
        state.isLoading = false;
        // Suppress polling errors silently when items are already displayed
        if (state.items.length === 0) {
          state.error = action.payload as string;
        }
      })
      .addCase(createTweet.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isCreating = false;
        // Only prepend in recent mode — trending order would be wrong otherwise
        if (state.sort === "recent") {
          state.items = [action.payload, ...(state.items ?? [])];
        }
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(likeTweet.fulfilled, (state, action) => {
        const { tweetId, liked, likesCount } = action.payload;
        const tweet = state.items.find((t) => t.id === tweetId);
        if (!tweet) return;
        tweet._count.likes = likesCount;
        const userId = action.payload.userId;
        if (liked) {
          tweet.likes.push({ userId });
        } else {
          tweet.likes = tweet.likes.filter((l) => l.userId !== userId);
        }
      });
  },
});

export const { setSort } = tweetsSlice.actions;
export default tweetsSlice.reducer;
