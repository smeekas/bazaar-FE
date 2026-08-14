import { z } from 'zod';

const email = z.email('Enter a valid email address');

const commonAuthSchema = z.object({
  email,
  // Login only checks that something was typed — strength rules belong to signup.
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/i, 'Password must contain a letter')
    .regex(/\d/, 'Password must contain a number')
    .regex(/[!@#$%^&*]/i, 'Password must contain at-least one special character'),
});
export const loginSchema = commonAuthSchema;
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be 20 characters or fewer')
      .regex(/^[a-z0-9_]+$/i, 'Use only letters, numbers and underscores'),
  })
  .extend(commonAuthSchema.shape);

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;