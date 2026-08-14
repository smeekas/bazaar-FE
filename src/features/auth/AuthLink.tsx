import Link from 'next/link';
import type { ComponentProps } from 'react';

import styles from './Auth.module.css';

/**
 * Link between auth pages. Atlassian's `Link` cannot delegate to the Next.js router
 * without an `AppProvider`, so `next/link` is styled with link tokens instead.
 */
export function AuthLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} className={styles.link} />;
}
