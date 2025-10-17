import { User } from "./user.types";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  message: string;
}

export interface SigninFormData {
  email: string;
  password: string;
}

export interface SigninResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface GoogleAuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
