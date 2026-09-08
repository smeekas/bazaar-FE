import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/global';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('login', req.nextUrl.origin));
  response.cookies.set(ACCESS_TOKEN, '', { maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN, '', { maxAge: 0 });
  response.headers.set('Clear-Site-Data', '"cookies"');
  //TODO
  // not part of core auth flow.
  // if required, and needed, we can add Backend endpoint for logout easily here
  return response;
}
