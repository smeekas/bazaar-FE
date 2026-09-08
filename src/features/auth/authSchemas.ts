import { z } from 'zod';

const email = z.email('Enter a valid email address');

// Strength rules for passwords being set — signup and reset password.
// Login only checks that something was typed.
const strongPassword = z
  .string()
  .min(5, 'Password must be at least 5 characters')
  .max(10, 'Password cannot have more than 10 characters')
  .regex(/[a-z]/i, 'Password must contain a letter')
  .regex(/\d/, 'Password must contain a number')
  .regex(/[!@#$%^&*]/i, 'Password must contain at-least one special character');

const commonAuthSchema = z.object({
  email,
  password: strongPassword,
});
export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(10, 'Password cannot have more than 10 characters'),
});
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be 20 characters or fewer')
      .regex(/^[a-z0-9_]+$/i, 'Use only letters, numbers and underscores'),
  })
  .extend(commonAuthSchema.shape);

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
