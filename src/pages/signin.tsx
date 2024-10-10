import Layout from '@/pages/layout';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const query = router.query;

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!response || response.error) {
        setError(response?.error || 'An error occurred');
      }
      else {
        toast.success('ログインしました！');
        router.push('/');
      }
    }
    catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError('An error occurred');
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleSignIn}
        className='max-w-xl mx-auto bg-white p-6 my-8'
      >
        <h1 className='text-2xl font-bold mb-8'>ログイン</h1>
        {query.redirected && <p className='my-2 text-green-500'>アカウントを作成しました。</p>}
        {error && <p className='my-2 text-red-500'>{error}</p>}
        <div className='mb-4'>
          <label className='text-lg font-bold' htmlFor='email'>
            メールアドレス
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full rounded-lg focus:ring-primary focus:border-primary'
          />
        </div>
        <div className='mb-4'>
          <label className='text-lg font-bold' htmlFor='password'>
            パスワード
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full rounded-lg focus:ring-primary focus:border-primary'
          />
        </div>
        <button
          type='submit'
          className='bg-blue-500 text-white w-full rounded-lg duration-150 hover:opacity-80 text-center py-2.5'
        >
          ログイン
        </button>
        <p className='mt-4 text-center'>
          <Link href='/signup' className='text-primary'>
            新規登録はこちら
          </Link>
        </p>
      </form>
    </Layout>
  );
}
