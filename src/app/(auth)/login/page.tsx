import type { Metadata } from 'next';

import { AuthCard } from '@/features/auth/AuthCard';
import { AuthLink } from '@/features/auth/AuthLink';
import { LoginForm } from '@/features/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Log in',
};

export default function LoginPage() {
  return (
    <AuthCard
      title='Log in to Bazaar'
      description='Pick up where you left off.'
      footer={
        <>
          New to Bazaar? <AuthLink href='/signup'>Create an account</AuthLink>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
