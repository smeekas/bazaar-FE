import { BaseAPI } from '@/config/axios';
import { endPoints } from '@/constants/endpoints';
import { getCookieOption, getHeaders, parseCookie } from '@/routes.utils';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // set browser cookie in next server's API request
    const body = await request.json();
    const { data, status, headers } = await BaseAPI.post(
      `${process.env.NEXT_PUBLIC_API}${endPoints.auth.login}`,
      body,
    );
    const setCookies = headers['set-cookie'];
    const headerObj = getHeaders(setCookies || []);
    const response = NextResponse.json(data, { status, headers: headerObj });
    if (setCookies) {
      const cookies = parseCookie(setCookies);
      Object.keys(cookies).forEach((cookieItem) => {
        const cookieOptions = cookies[cookieItem].option;
        response.cookies.set(
          cookieItem,
          cookies[cookieItem].value,
          getCookieOption(cookieOptions),
        );
      });
    }
    return response;
  } catch (err) {
    if (isAxiosError(err)) {
      return NextResponse.json(err.message, { status: err.response?.status });
    }
  }
}
