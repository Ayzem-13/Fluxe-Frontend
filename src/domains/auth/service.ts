import { authApi } from "./api";
import { extractErrorMessage } from "@/utils/errors";
import type { LoginPayload, RegisterPayload, User as AuthUser } from "./types";

export async function registerUser(data: RegisterPayload): Promise<void> {
  try {
    await authApi.register(data);
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Registration failed"));
  }
}

/**
 * Logs in the user and persists the access token to localStorage
 * so it survives page reloads.
 */
export async function loginUser(
  data: LoginPayload
): Promise<{ user: AuthUser; accessToken: string }> {
  try {
    const res = await authApi.login(data);
    const { user, accessToken } = res.data as {
      user: AuthUser;
      accessToken: string;
    };
    localStorage.setItem("accessToken", accessToken);
    return { user, accessToken };
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Invalid credentials"));
  }
}

/** Fetches the current user profile to rehydrate the session on app load. */
export async function fetchCurrentUser(
  hasToken: boolean
): Promise<AuthUser | null> {
  if (!hasToken) return null;
  try {
    const res = await authApi.me();
    // Backend may return { user: {...} } or the user object directly
    return (res.data.user ?? res.data) as AuthUser;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Session expired, please log in again"));
  }
}

/**
 * Logs out the user. Invalidates the refresh token server-side
 * and clears the local access token regardless of network errors.
 */
export async function logoutUser(): Promise<void> {
  try {
    await authApi.logout();
  } catch {
    // Network error: still clear the local session
  } finally {
    localStorage.removeItem("accessToken");
  }
}
