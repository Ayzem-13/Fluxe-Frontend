import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/domains/auth/slice";
import tweetsReducer from "@/domains/tweets/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
