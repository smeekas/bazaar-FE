import '@atlaskit/css-reset';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AtlaskitThemeStyles, themeHtmlAttrs } from '@/components/AtlaskitTheme';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Bazaar',
    template: '%s · Bazaar',
  },
  description: 'Bazaar is the marketplace where anyone can buy and sell.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      {...themeHtmlAttrs}
    >
      <body>
        <AtlaskitThemeStyles />
        {children}
      </body>
    </html>
  );
}
