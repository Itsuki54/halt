import { Header } from '@/layouts/Header';
import { Sidebar } from '@/layouts/Sidebar';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-1'>
        <Sidebar />
        <main className='flex-1 p-4'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
