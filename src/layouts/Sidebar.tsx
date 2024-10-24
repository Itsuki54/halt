export function Sidebar() {
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className='h-full w-full text-white'>
      <img src='/C2U_logo.png' alt='logo' style={{ width: '30%', marginBottom: '30px' }} />

      <div className='flex flex-col' style={{ gap: '20px' }}>
        <div className='flex items-center border bg-black' style={{ width: '50%', backgroundColor: 'rgba(0, 195, 202, 0.3)', borderColor: 'rgb(0, 195, 202)' }} onClick={() => handleRedirect('/')}>
          <div className='bg-blue-500 flex items-center justify-center p-1 h-full' style={{ width: '20%', backgroundColor: 'rgba(0, 195, 202, 1)' }}>
            <img src='/conversation.png' alt='text chat' className='w-full' />
          </div>

          <div className='text-2xl flex-1 text-center basis-3/4 h-full flex items-center justify-center font-bold'>
            Text Chat
          </div>
        </div>

        <div className='flex items-center border bg-black' style={{ width: '50%', backgroundColor: 'rgba(74, 218, 156, 0.3)', borderColor: 'rgb(74, 218, 156)' }} onClick={() => handleRedirect('/')}>
          <div className='bg-blue-500 flex items-center justify-center p-1 h-full' style={{ width: '20%', backgroundColor: 'rgba(74, 218, 156, 1)' }}>
            <img src='/setting.png' alt='setting' className='w-full' />
          </div>
          <div className='text-2xl flex-1 text-center basis-3/4 h-full flex items-center justify-center font-bold'>
            User Setting
          </div>
        </div>
      </div>
    </div>
  );
}
