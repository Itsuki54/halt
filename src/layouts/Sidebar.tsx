import Image from 'next/image';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/router';

export function Sidebar() {
  const router = useRouter();
  return (
    <div className='h-full w-full text-white'>
      <Image alt='logo' height={100} src='/C2U_logo.png' width={100} />
      <div className='flex flex-col' style={{ gap: '20px' }}>
        <div className='flex items-center border bg-black' onClick={() => router.push('/#')} style={{ width: '100%', backgroundColor: 'rgba(0, 195, 202, 0.3)', borderColor: 'rgb(0, 195, 202)' }}>
          <div className='bg-blue-500 flex items-center justify-center p-1 h-full' style={{ width: '20%', backgroundColor: 'rgba(0, 195, 202, 1)' }}>
            <FiMessageSquare size={30} color="white" />
          </div>
          <div className='text-2xl flex-1 text-center basis-3/4 h-full flex items-center justify-center font-bold'>
            Text Chat
          </div>
        </div>
        <div className='flex items-center border bg-black' onClick={() => router.push('/#')} style={{ width: '100%', backgroundColor: 'rgba(74, 218, 156, 0.3)', borderColor: 'rgb(74, 218, 156)' }}>
          <div className='bg-blue-500 flex items-center justify-center p-1 h-full' style={{ width: '20%', backgroundColor: 'rgba(74, 218, 156, 1)' }}>
            <FiSettings size={30} color="white" />
          </div>
          <div className='text-2xl flex-1 text-center basis-3/4 h-full flex items-center justify-center font-bold'>
            User Setting
          </div>
        </div>
      </div>
    </div>
  );
}
