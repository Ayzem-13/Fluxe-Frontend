import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { authApi } from "@/domains/auth/api";
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
      const res = await authApi.register(data);
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error ?? "Erreur inscription");
      }
      return rejectWithValue("Erreur inscription");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem("accessToken", res.data.accessToken);
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error ?? "Erreur connexion");
      }
      return rejectWithValue("Erreur connexion");
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as { auth: AuthState }).auth.accessToken;
    if (!token) return rejectWithValue("No token");
    try {
      const res = await authApi.me(token);
      return (res.data.user ?? res.data) as AuthState["user"];
    } catch {
      return rejectWithValue("Session expirée");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authApi.logout();
  localStorage.removeItem("accessToken");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
