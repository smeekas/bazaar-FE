'use client';

import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives';
import type { ReactNode } from 'react';

import styles from './Auth.module.css';

type AuthCardProps = {
  title: string;
  description: string;
  /** The form for this page. */
  children: ReactNode;
  /** Pointer to the other auth page, e.g. "New to Bazaar? Create an account". */
  footer: ReactNode;
};

/** Shared shell for the login and signup pages. */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <section className={styles.card}>
      <Stack space="space.300">
        <Stack space="space.100">
          <Heading as="h1" size="large">
            {title}
          </Heading>
          <Text color="color.text.subtlest">{description}</Text>
        </Stack>

        {children}

        <Text align="center" size="small" color="color.text.subtlest">
          {footer}
        </Text>
      </Stack>
    </section>
  );
}
