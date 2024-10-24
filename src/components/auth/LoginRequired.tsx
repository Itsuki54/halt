import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function LoginRequired() {
    const [error, setError] = useState('');
  const router = useRouter();
  const query = router.query;

  const handleGoogleSignIn = async () => {
    try {
      const response = await signIn('google', { redirect: false });
      if (!response || response.error) {
        setError(response?.error || 'Googleログインに失敗しました');
      }
      else {
        toast.success('Googleでログインしました！');
        router.push('/');
      }
    }
    catch (error) {
      setError('Googleログインに失敗しました');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Connect2U</h1>
        <p className="text-lg text-gray-600 mb-6">
          Connect2U では、あなたのパーソナルアシスタントとチャットを通じて、質問や悩みを相談できます。
          まだログインしていないようです。下のボタンを押してログインして、パーソナルアシスタントとの会話を始めましょう！
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150"
        >
          ログイン
        </button>
      </div>
    </div>
  );
}
