import type { Metadata } from 'next';

import { AuthCard } from '@/features/auth/AuthCard';
import { AuthLink } from '@/features/auth/AuthLink';
import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title='Forgot your password?'
      description='Enter your email and we will send you a link to reset it.'
      footer={
        <>
          Remembered it? <AuthLink href='/login'>Log in</AuthLink>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
