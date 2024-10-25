import { SpeedInsights } from '@vercel/speed-insights/next';

import { Sidebar } from '@/layouts/Sidebar';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className='h-screen bg-cover bg-center' style={{ backgroundImage: 'url(\'/inside.webp\')' }}>
    <div className='flex h-screen px-8 py-4'>
      <div className='basis-1/4'>
        <Sidebar />
      </div>
      <main className='basis-1/2'>
        {children}
      </main>
      <div className='basis-1/4' />
      <SpeedInsights />
    </div>
  </div>
);

export default Layout;
