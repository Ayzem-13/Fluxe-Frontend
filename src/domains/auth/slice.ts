import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, fetchCurrentUser, logoutUser } from "@/domains/auth/service";
import type { AuthState, LoginPayload, RegisterPayload } from "@/domains/auth/types";

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      await registerUser(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      return await loginUser(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    const hasToken = !!(getState() as { auth: AuthState }).auth.accessToken;
    try {
      return await fetchCurrentUser(hasToken);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAccessToken: (state, action: { payload: string }) => {
      state.accessToken = action.payload || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload ?? null;
      })
      .addCase(fetchMe.rejected, (state) => {
        // Do not clear the token here — the axios interceptor handles refresh.
        // If refresh also fails, the interceptor clears the token via setAccessToken("").
        state.user = null;
      });
  },
});

export const { clearError, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
