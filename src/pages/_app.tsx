import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: any) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </SessionProvider>
  );
}
