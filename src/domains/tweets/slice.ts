import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTweets, postTweet, editTweet, removeTweet } from "@/domains/tweets/service";
import type {
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
};

export const fetchTweets = createAsyncThunk(
  "tweets/fetchAll",
  async (cursor: string | undefined, { rejectWithValue }) => {
    try {
      return await getTweets(cursor);
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTweets.pending, (state) => {
        // Only show loading indicator on the initial fetch (no existing items)
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
        state.items = [action.payload, ...(state.items ?? [])];
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
      });
  },
});

export default tweetsSlice.reducer;
