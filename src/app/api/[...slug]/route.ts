import { BaseAPI } from '@/config/axios';
import {
  getResponse,
  getResponseError,
  getRouteInfo,
  getSlug,
} from '@/routes.utils';
import { isAxiosError } from 'axios';
import { NextResponse } from 'next/server';

const methodSet: Set<string> = new Set([
  'get',
  'post',
  'delete',
  'patch',
  'put',
  'head',
]);
export async function handler(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
): Promise<Response> {
  try {
    const { headers, body } = await getRouteInfo(request);
    const search = new URL(request.url).search;
    const method = request.method.toLowerCase();

    if (!methodSet.has(method)) {
      return NextResponse.json(
        { error: 'method not allowed' },
        { status: 405 },
      );
    }

    const response = await BaseAPI(
      `${process.env.NEXT_PUBLIC_API}${await getSlug(params)}${search}`,
      {
        method,
        headers,
        data: body,
      },
    );
    return getResponse(response);
  } catch (err) {
    if (isAxiosError(err)) {
      return getResponseError(err);
    }
    return NextResponse.json({ error: 'unknown error' }, { status: 500 });
  }
}
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as HEAD,
};
/**
 * frontend and backend are hosted on different domain.
 * 
 next route handler way will set cookie in next-server from Backend

 easier to access in proxy and server component
 but now it is not accessible in client component as cookie is not for our backend server


 if we skip route handler way and backend directly sets cookie.

 then it is easier in the client component.
 but we do not get cookie in the proxy and server component.

 we will use server component only for public pages.
 so how we handle protected routes?
 */
