import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserProfileState } from "./types";
import { getUserProfile, getUserTweets, getUserRetweets, toggleUserFollow, updateUserProfile } from "./service";
import { likeTweet } from "@/domains/tweets/slice";

const initialState: UserProfileState = {
  profile: null,
  tweets: [],
  retweets: [],
  nextCursor: null,
  retweetsNextCursor: null,
  isLoading: false,
  isFollowLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await getUserProfile(userId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchUserTweets = createAsyncThunk(
  "userProfile/fetchTweets",
  async ({ userId, cursor }: { userId: string; cursor?: string }, { rejectWithValue }) => {
    try {
      return await getUserTweets(userId, cursor);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const toggleFollow = createAsyncThunk(
  "userProfile/toggleFollow",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await toggleUserFollow(userId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchUserRetweets = createAsyncThunk(
  "userProfile/fetchRetweets",
  async ({ userId, cursor }: { userId: string; cursor?: string }, { rejectWithValue }) => {
    try {
      return await getUserRetweets(userId, cursor);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (data: { username?: string; bio?: string; avatar?: string | null }, { rejectWithValue }) => {
    try {
      return await updateUserProfile(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUserTweets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        const { tweets, nextCursor } = action.payload;
        if (action.meta.arg.cursor) {
          state.tweets = [...state.tweets, ...tweets];
        } else {
          state.tweets = tweets;
        }
        state.nextCursor = nextCursor;
      })
      .addCase(fetchUserTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(toggleFollow.pending, (state) => {
        state.isFollowLoading = true;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.isFollowLoading = false;
        if (state.profile) {
          state.profile.isFollowing = action.payload.following;
          state.profile._count.followers = action.payload.followersCount;
        }
      })
      .addCase(toggleFollow.rejected, (state) => {
        state.isFollowLoading = false;
      })
      .addCase(likeTweet.fulfilled, (state, action) => {
        const { tweetId, liked, likesCount } = action.payload;
        const tweet = state.tweets.find((t) => t.id === tweetId);
        if (!tweet) return;
        tweet._count.likes = likesCount;
        const userId = action.payload.userId;
        if (liked) {
          tweet.likes.push({ userId });
        } else {
          tweet.likes = tweet.likes.filter((l) => l.userId !== userId);
        }
      })

      .addCase(fetchUserRetweets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserRetweets.fulfilled, (state, action) => {
        state.isLoading = false;
        const { tweets, nextCursor } = action.payload;
        if (action.meta.arg.cursor) {
          state.retweets = [...state.retweets, ...tweets];
        } else {
          state.retweets = tweets;
        }
        state.retweetsNextCursor = nextCursor;
      })
      .addCase(fetchUserRetweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.username = action.payload.username;
          state.profile.avatar = action.payload.avatar;
          state.profile.bio = action.payload.bio;
        }
      });
  },
});

export const { clearProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
