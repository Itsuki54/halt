import { SpeedInsights } from '@vercel/speed-insights/next';

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
      <div className='bg-white shadow-xl rounded-lg p-8 max-w-lg w-full space-y-6'>
        {children}
        <SpeedInsights />
      </div>
    </div>
  );
}
