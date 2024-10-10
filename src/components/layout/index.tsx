export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
        {children}
    </div>
  );
}
