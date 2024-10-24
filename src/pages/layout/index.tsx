import { SpeedInsights } from '@vercel/speed-insights/next';

import { Header } from '@/layouts/Header';
import { Sidebar } from '@/layouts/Sidebar';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className='h-screen bg-cover bg-center' style={{ backgroundImage: 'url(\'/inside.webp\')' }}>
      <div className='flex h-screen px-8 py-4'>
        <div className='basis-1/4'>
          <Sidebar />
        </div>
        <main className='basis-1/2'>
          {children}
        </main>
        <div className='basis-1/4'></div>
        <SpeedInsights />
      </div>
    </div>
  );
};

export default Layout;
