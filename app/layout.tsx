import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { UserContextProvider } from '@/contexts/UserContext';

const cabinet = localFont({
  src: [
    {
      path: '../public/assets/fonts/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/CabinetGrotesk-Extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet-grotesk',
});

const aspekta = localFont({
  src: [
    {
      path: '../public/assets/fonts/Aspekta-350.woff2',
      weight: '350',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/Aspekta-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/assets/fonts/Aspekta-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-aspekta',
});

const arslan = localFont({
  src: '../public/assets/fonts/Arslan.ttf',
  variable: '--font-arslan',
});

const hacen = localFont({
  src: '../public/assets/fonts/hacen.ttf',
  variable: '--font-hacen',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${cabinet.variable} ${aspekta.variable} ${arslan.variable} ${hacen.variable}`}
      >
        <UserContextProvider>{children}</UserContextProvider>
      </body>
    </html>
  );
}
