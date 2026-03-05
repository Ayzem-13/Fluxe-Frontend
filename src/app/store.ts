import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/domains/auth/slice";
import tweetsReducer from "@/domains/tweets/slice";
import userProfileReducer from "@/domains/users/slice";
import notificationsReducer from "@/domains/notifications/slice";
import commentsReducer from "@/domains/comments/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetsReducer,
    userProfile: userProfileReducer,
    notifications: notificationsReducer,
    comments: commentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
