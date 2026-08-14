import styles from './AuthLayout.module.css';

/** Centred shell shared by the login and signup pages. */
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className={styles.shell}>
      <span className={styles.wordmark}>bazaar</span>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
