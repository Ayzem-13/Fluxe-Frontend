import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotifications, markAsRead } from "@/domains/notifications/service";
import type { NotificationsState } from "@/domains/notifications/types";

const initialState: NotificationsState = {
  items: [],
  nextCursor: null,
  isLoading: false,
  error: null,
  hasFetched: false,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (cursor: string | undefined, { rejectWithValue }) => {
    try {
      return await getNotifications(cursor, 20);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await markAsRead(notificationId);
      return notificationId;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.notifications;
        state.nextCursor = action.payload.nextCursor;
        state.hasFetched = true;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n.id === action.payload);
        if (notification) {
          notification.read = true;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default notificationsSlice.reducer;
