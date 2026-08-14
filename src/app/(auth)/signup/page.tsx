import type { Metadata } from 'next';

import { AuthCard } from '@/features/auth/AuthCard';
import { AuthLink } from '@/features/auth/AuthLink';
import { SignupForm } from '@/features/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your Bazaar account"
      description="Buy at unbeatable prices!"
      footer={
        <>
          Already have an account? <AuthLink href="/login">Log in</AuthLink>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
