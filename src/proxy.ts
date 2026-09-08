import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants/global';
import { isAxiosError } from 'axios';
import { endPoints } from './constants/endpoints';
import {
  getCookieOption,
  getHeaders,
  getRouteInfo,
  parseCookie,
} from './routes.utils';
import { routes } from './constants/routes';
import { BaseAPI } from './config/axios';

const protectedRoutes = ['/profile', '/dashboard'];
const publicRoutes = [
  '/unavailable',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export default async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const currPathSegment = currentPath.split('/').filter(Boolean);
  if (
    publicRoutes.findIndex((route) => {
      const filteredRoute = route.split('/').filter(Boolean);
      return filteredRoute[0] === currPathSegment[0];
    }) > -1
  ) {
    return NextResponse.next();
  }
  if (
    currentPath === '/' ||
    protectedRoutes.findIndex((route) => {
      const filteredRoute = route.split('/').filter(Boolean);
      return filteredRoute[0] === currPathSegment[0];
    }) > -1
  ) {
    const token = request.cookies.get(ACCESS_TOKEN);
    if (!token) {
      /* if we do not have access_token
          reason might be that it is auto expired
       */
      const refreshToken = request.cookies.get(REFRESH_TOKEN);
      if (!refreshToken)
        return NextResponse.redirect(new URL('login', request.nextUrl.origin));
      else {
        try {
          const { headers } = await getRouteInfo(request);
          // since we are passing request, it will have cookies header
          const { headers: newHeaders } = await BaseAPI.get(
            `${process.env.NEXT_PUBLIC_API}${endPoints.auth.refresh}`,
            {
              headers: { ...headers },
            },
          );
          const cookie = newHeaders['set-cookie'];
          if (!cookie || cookie.length === 0) {
            return NextResponse.redirect(
              new URL(routes.login, request.nextUrl.origin),
            );
          }

          const parsedCookie = parseCookie(cookie);
          const headerObj = getHeaders(cookie, request);
          const res = NextResponse.next({ request: { headers: headerObj } });
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
            if (!err.response) {
              return NextResponse.redirect(
                new URL(routes.unavailable, request.nextUrl.origin),
              );
            }
            const ress = NextResponse.redirect(
              new URL(routes.login, request.nextUrl.origin),
            );
            ress.cookies.set(ACCESS_TOKEN, '', { maxAge: 0 });
            ress.cookies.set(REFRESH_TOKEN, '', { maxAge: 0 });
            ress.headers.set('Clear-Site-Data', '"cookies"');

            return ress;
          }
          return NextResponse.redirect(
            new URL(routes.login, request.nextUrl.origin),
          );
        }
      }
    }
    if (token && token.value) {
      return NextResponse.next();
    }
  }
  return NextResponse.redirect(new URL('login', request.nextUrl.origin));
}

// 2. Route Matching (Optional)
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//   ],
// };

export const config = {
  matcher: ['/((?!api/|_next/|.*\\.[^/]+$).*)'],
};
