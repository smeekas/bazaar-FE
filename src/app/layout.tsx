import '@atlaskit/css-reset';
import type { Metadata } from 'next';

import {
  AtlaskitThemeStyles,
  themeHtmlAttrs,
} from '@/components/AtlaskitTheme';

import './globals.css';

import GlobalWrappers from '@/config/GlobalWrappers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Bazaar',
    template: '%s · Bazaar',
  },
  description: 'Bazaar is the marketplace where anyone can buy and sell.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' {...themeHtmlAttrs}>
      <body>
        <GlobalWrappers>
          <AtlaskitThemeStyles />
          {children}
          <Toaster />
        </GlobalWrappers>
      </body>
    </html>
  );
}

/**
 * access_token expires
 *  get new from refresh_token
 *
 * refresh_token expires
 *  go to login page
 *
 *
 * access_token expires in client side
 *  interceptor handles it. BE sets new cookie
 *
 * access_token expires in server side
 *   we get new cookie via route handler
 *
 *
 * access_token auto expires in proxy
 *  go to route handler with refresh token cookie to get new cookie
 */
