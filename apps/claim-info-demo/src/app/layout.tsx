import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './global.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { MUThemeProvider } from '@claim-info-demo/core';

config.autoAddCss = false;

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Claim Info Demo - General Claim Information',
  description: 'Demo application for General Claim Information component',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <MUThemeProvider>{children}</MUThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}