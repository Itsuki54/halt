export function Sidebar() {
  return (
    <div className='h-full w-64 bg-gradient-to-b from-gray-900 to-gray-700 text-white shadow-lg'>
      <h1 className='text-2xl font-extrabold p-6 border-b border-gray-600'>Sidebar</h1>
      <ul className='space-y-2 mt-4'>
        <li>
          <a href='/chat' className='block p-4 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105'>
            チャット
          </a>
        </li>
        <li>
          <a href='/voice-chat' className='block p-4 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105'>
            音声会話
          </a>
        </li>
        <li>
          <a href='/bot' className='block p-4 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105'>
            ボットの設定
          </a>
        </li>
      </ul>
    </div>
  );
}
