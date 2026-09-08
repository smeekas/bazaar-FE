import type { Metadata } from 'next';

import { AuthCard } from '@/features/auth/AuthCard';
import { AuthLink } from '@/features/auth/AuthLink';
import { ResetPasswordForm } from '@/features/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password',
};

interface ResetPasswordProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPassword({ searchParams }: ResetPasswordProps) {
  const { token } = await searchParams;

  return (
    <AuthCard
      title='Choose a new password'
      description='Pick something you have not used before.'
      footer={
        <>
          Remembered it? <AuthLink href='/login'>Log in</AuthLink>
        </>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
