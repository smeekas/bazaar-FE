import { BaseAPI } from '@/config/axios';
import { endPoints } from '@/constants/endpoints';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/global';

import { getCookieOption, getRouteInfo, parseCookie } from '@/routes.utils';
import { isAxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

/***
 for client component's refresh
 */
export async function GET(req: NextRequest) {
  try {
    const { headers } = await getRouteInfo(req);
    const axiosRes = await BaseAPI.get(
      `${process.env.NEXT_PUBLIC_API}${endPoints.auth.refresh}`,
      {
        headers,
      },
    );
    const cookies = axiosRes.headers['set-cookie'];
    if (!cookies) {
      return NextResponse.json(axiosRes.data, { status: axiosRes.status });
    }
    const res = NextResponse.json(axiosRes.data, { status: axiosRes.status });
    const parsedCookie = parseCookie(cookies);
    Object.keys(parsedCookie).forEach((cookieItem) => {
      const cookieOptions = parsedCookie[cookieItem].option;
      res.cookies.set(
        cookieItem,
        parsedCookie[cookieItem].value,
        getCookieOption(cookieOptions),
      );
    });
    return res;
  } catch (err) {
    if (isAxiosError(err)) {
      const response = NextResponse.json(err.response?.data, {
        status: err.response?.status,
      });
      if (err.response?.status === 401) {
        response.headers.append('Clear-Site-Data', '"cookies"');
        response.cookies.set(ACCESS_TOKEN, '', { maxAge: 0 });
        response.cookies.set(REFRESH_TOKEN, '', { maxAge: 0 });
        // response.headers.append('set-cookie', 'token=;path=/;');
        // response.headers.append('set-cookie', 'refresh_token=;');
      }
      return response;
    }
    return NextResponse.json({ error: 'unknown error' }, { status: 500 });
  }
}
