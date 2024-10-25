import { SpeedInsights } from '@vercel/speed-insights/next';

import { Sidebar } from '@/layouts/Sidebar';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => (
  <div className='h-screen bg-cover bg-center' style={{ backgroundImage: 'url(\'/inside.webp\')' }}>
    <div className='flex h-screen px-8 py-4'>
      <div className='basis-2/12 mr-20'>
        <Sidebar />
      </div>
      <main className='basis-10/12'>
        {children}
      </main>
      <SpeedInsights />
    </div>
  </div>
);

export default Layout;
