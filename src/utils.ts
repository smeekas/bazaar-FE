// "client only"
import { routes } from './constants/routes';

export function getSafeUrl(url: string) {
  const SENTINEL = 'http://x.invalid';
  if (!url) return routes.home;
  try {
    // if (url.startsWith('//') || url.includes('//')) return routes.home;
    const parsed = new URL(url, SENTINEL);
    if (parsed.origin !== SENTINEL) return routes.home;
  } catch {
    return routes.home;
  }
  return url;
}

export function getRoutePath(str: string) {
  str = str.startsWith('/') ? str.substring(1) : str;
  if (str.startsWith('/')) return `api/${str}`;
  return `/api/${str}`;
}
