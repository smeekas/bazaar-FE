'use client';

// `useSuspenseQuery` throws on failure (an expired token, API down), so the
// route needs an error boundary to catch it.
export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <p>Could not load your profile: {error.message}</p>
      <button type='button' onClick={reset}>
        Try again
      </button>
    </div>
  );
}
