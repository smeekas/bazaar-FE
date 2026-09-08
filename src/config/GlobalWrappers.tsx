'use client';

// Registers the Atlaskit feature flag resolver for the browser runtime.
import './atlaskitFeatureFlags';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { ReactNode } from 'react';
import { ProfileProvider } from '@/context/ProfileContext';

type GlobalWrappersProps = {
  children: ReactNode;
};
function GlobalWrappers({ children }: GlobalWrappersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>{children}</ProfileProvider>
    </QueryClientProvider>
  );
}

export default GlobalWrappers;
