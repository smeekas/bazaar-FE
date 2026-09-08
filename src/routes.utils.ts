// "server only"
import { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

const NULL_BODY_STATUS = new Set([204, 205, 304]);
function getData(req: AxiosResponse | AxiosError) {
  return isAxiosError(req) ? req.response?.data : req.data;
}

// these are the headers we want to skip from normal requests
const DENY_HEADERS = [
  'if-none-match',
  'host',
  'content-length',
  'cookie',
  'set-cookie',
  'content-type',
];

function pruneNormalRequestHeaders(headers: AxiosResponse['headers']) {
  const newHeaders: Record<string, string> = {};
  Object.keys(headers).forEach((headerItem) => {
    if (
      !DENY_HEADERS.includes(headerItem) &&
      typeof headers[headerItem] !== 'function'
    ) {
      newHeaders[headerItem] = headers[headerItem];
    }
  });
  return newHeaders;
}
export function getResponse(axiosResponse: AxiosResponse) {
  const currStatus = axiosResponse.status;
  if (currStatus && NULL_BODY_STATUS.has(currStatus)) {
    return new NextResponse(null, { status: currStatus });
  }
  return NextResponse.json(getData(axiosResponse), {
    headers: pruneNormalRequestHeaders(axiosResponse.headers),
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
  });
}

export function getResponseError(axiosResponse: AxiosError) {
  const currStatus = axiosResponse.status;
  if (!axiosResponse.response) {
    return NextResponse.json({ status: 'service unavailable' });
  }
  if (currStatus && NULL_BODY_STATUS.has(currStatus)) {
    return new NextResponse(null, { status: currStatus });
  }
  return NextResponse.json(getData(axiosResponse), {
    headers: axiosResponse.response
      ? pruneNormalRequestHeaders(axiosResponse.response?.headers)
      : undefined,
    status: axiosResponse.response?.status || 502,
    statusText: axiosResponse.response?.statusText || 'upstream unavailable',
  });
}
/**
 * Earlier we used FORWARD_REQUEST
 * but instead we can use DENY_REQUEST headers
 * this way if any custom headers are set, it will work flawlessly
 */
const FORWARD_REQUEST = [
  'cookie',
  'authorization',
  'accept',
  'content-type',
  'accept-language',
];
const DENY_REQUEST = ['if-none-match', 'host', 'content-length'];
export async function getRouteInfo(request: Request) {
  const headers: Record<string, string> = {};
  for (const name of request.headers.keys()) {
    if (!DENY_REQUEST.includes(name)) {
      const value = request.headers.get(name);
      if (value) headers[name] = value;
    }
  }

  let body: ArrayBuffer | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
  }
  return { headers, body };
}

export async function getSlug(params: Promise<{ slug: string[] }>) {
  const { slug } = await params;
  return slug.join('/');
}
function getCookieKeyVal(cookie: string) {
  return cookie.trim().split('=');
}

const booleanOptions = ['httponly', 'secure'];

function getCookieOptions(cookieOptions: string[]) {
  return cookieOptions
    .map((cookie) => {
      return getCookieKeyVal(cookie);
    })
    .reduce<Record<string, string | boolean>>((acc, curr) => {
      if (booleanOptions.includes(curr[0].toLowerCase())) {
        return { ...acc, [curr[0].toLowerCase()]: true };
      }
      return { ...acc, [curr[0].toLowerCase()]: curr[1] };
    }, {});
}
export function parseCookie(cookieStr: string[]) {
  return cookieStr
    .map((cookieItem) => {
      const cookie = cookieItem.split(';');
      const [key, val] = getCookieKeyVal(cookie[0]);
      return [key, val, getCookieOptions(cookie.slice(1))] as const;
    })
    .reduce<
      Record<
        string,
        { value: string; option: Record<string, string | boolean> }
      >
    >((acc, curr) => {
      return {
        ...acc,
        [curr[0]]: {
          value: curr[1],
          option: curr[2],
        },
      };
    }, {});
}
function isSameSite(option: unknown): option is 'none' | 'lax' | 'strict' {
  return (
    typeof option === 'string' &&
    ['none', 'lax', 'strict'].includes(option.toLowerCase())
  );
}
export function getCookieOption(
  cookieOptions: Record<string, string | boolean>,
): NonNullable<Parameters<ResponseCookies['set']>['2']> {
  return {
    expires:
      typeof cookieOptions.expires === 'string'
        ? new Date(cookieOptions.expires)
        : undefined,
    httpOnly: !!cookieOptions.httponly,
    path:
      typeof cookieOptions.path === 'string' ? cookieOptions.path : undefined,
    sameSite: isSameSite(cookieOptions.samesite)
      ? cookieOptions.samesite
      : 'lax',
    maxAge: +cookieOptions['max-age'] || undefined,
    secure: process.env.NODE_ENV === 'production',
  };
}

export function getHeaders(setCookieHeader: string[], request?: NextRequest) {
  const headerObj = new Headers(request?.headers);
  const parsedCookie = parseCookie(setCookieHeader);
  const jar = new Map(request?.cookies.getAll().map((c) => [c.name, c.value]));
  for (const [name, { value }] of Object.entries(parsedCookie)) {
    jar.set(name, value);
  }
  headerObj.set('cookie', [...jar].map(([k, v]) => `${k}=${v}`).join('; '));
  return headerObj;
}
