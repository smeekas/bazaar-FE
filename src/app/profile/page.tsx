import { getServerAPI } from '@/config/serverApi';
import { endPoints } from '@/constants/endpoints';
import { routes } from '@/constants/routes';
import Link from 'next/link';

export default async function ProfilePage() {
  const API = await getServerAPI();
  const { data } = await API.get(endPoints.profile);
  //TODO common error component will be created.
  // if any error occur apart from success, we wil show appropriate error
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Link href={routes.dashboard}>to dashboard</Link>
    </>
  );
}
