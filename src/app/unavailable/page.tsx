import { routes } from '@/constants/routes';
import Button from '@atlaskit/button/new';
import Link from 'next/link';

export type UnavailableProps = {
  searchParams: Promise<{ returnUrl: string }>;
};
export default async function Unavailable({ searchParams }: UnavailableProps) {
  const { returnUrl } = await searchParams;
  // Safe check will added later.
  // Here we are just creating flow
  // below checks will be added
  // valid string, no evil domain/link
  return (
    <>
      <div>sorry your page is not available at the moment</div>
      <Link href={returnUrl || routes.profile}>try again</Link>
    </>
  );
}
