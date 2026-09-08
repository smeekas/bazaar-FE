import { routes } from '@/constants/routes';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server-only: importing this from a Client Component fails the build.
 */
export async function getServerAPI() {
  const cookieStore = await cookies();
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    timeout: 30 * 1000,
    headers: { Cookie: cookieStore.toString() },
  });
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      if (!err.response) {
        return redirect(routes.unavailable);
      }
      if (err.response?.status === 401) {
        // RSC was checked by proxy already.
        // if API call in RSC fails, means session was killed by something else.
        // let user login again so logout the user

        redirect('/api/logout');
      }
      return Promise.reject(err);
    },
  );
  return axiosInstance;
}
