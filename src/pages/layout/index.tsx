import { Sidebar } from '@/layouts/Sidebar';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className='h-screen w-screen bg-cover bg-center' style={{ backgroundImage: 'url(\'/inside.webp\')' }}>
      <div className='flex h-full px-8 py-4 relative'>

        {/* トグルボタン - 2xl以下で表示 */}
        <div className='2xl:hidden fixed top-4 left-4 z-50'>
          <button onClick={toggleSidebar} className='p-2 bg-gray-800 rounded-full text-white'>
            <FiMenu size={24} />
          </button>
        </div>

        {/* サイドバー - 2xl以上で表示、2xl以下でトグル */}
        <div className={`fixed 2xl:static top-0 left-0 h-full w-64 text-white transform ${isSidebarOpen ? 'translate-x-0 bg-gray-800 z-10' : '-translate-x-full'} transition-transform duration-300 ease-in-out 2xl:translate-x-0`}>
          <Sidebar logo_visible={!isSidebarOpen}/>
        </div>

        {/* オーバーレイ - サイドバー表示中のみ */}
        {/* {isSidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggleSidebar}></div>
        )} */}

        {/* メインコンテンツ */}
        <main className='basis-full 2xl:basis-10/12 ml-0 2xl:ml-20'>
          {children}
        </main>

        <SpeedInsights />
      </div>
    </div>
  );
};

export default Layout;
