export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  /** Single-use token from the reset link in the email. */
  token: string;
  password: string;
};
