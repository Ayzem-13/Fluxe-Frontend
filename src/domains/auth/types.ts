import type { ReactNode, ChangeEvent } from "react";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  bio?: string | null;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  required?: boolean;
}

export interface AuthPageProps {
  mode: "login" | "register";
  fields: AuthField[];
  onSubmit: () => void;
  isLoading: boolean;
  linkTo: string;
  linkLabel: string;
  linkText: string;
}
