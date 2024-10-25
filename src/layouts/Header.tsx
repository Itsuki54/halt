export function Header() {
  return (
    <div className='bg-gradient-to-r from-purple-500 to-indigo-500 p-6 shadow-lg flex justify-between items-center'>
      <h1 className='text-white text-2xl font-bold tracking-wide flex-grow text-left'>Header</h1>
      <div className='flex items-center space-x-6 justify-end'>
        <a className='text-white hover:text-gray-200 transition duration-300 ease-in-out transform hover:scale-105' href='/settings'>Settings</a>
      </div>
    </div>
  );
}
