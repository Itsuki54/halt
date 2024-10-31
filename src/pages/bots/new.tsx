import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { promptList } from '@/data/prompt';
import Layout from '@/pages/layout';

export default function NewBot() {
  const router = useRouter();
  const { userId } = router.query;
  const [type, setType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ボタンの状態管理

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return; // 連続クリックを防ぐ

    setIsSubmitting(true); // ボタンを無効化
    const friend = promptList.find(f => f.name === type);
    if (!friend) {
      toast.error('Please select a friend');
      setIsSubmitting(false); // エラー時は無効化を解除
      return;
    }

    const response = await fetch('/api/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, userId }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      const { groupId } = data;
      toast.success('AI friend created successfully');
      router.push(`/?groupId=${groupId}`);
    } else {
      toast.error('Failed to create AI friend');
      setIsSubmitting(false);
    }

  };

  return (
    <Layout>
      <div className='flex justify-center items-center'>
        <div className='bg-white shadow-lg rounded-lg p-8'>
          <h1 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
            Create a New AI Friend
          </h1>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label className='text-lg font-medium text-gray-700 mb-2 block'>
                Select an AI Friend
              </label>
              <div className='grid grid-cols-2 gap-4'>
                {promptList.map(friend => (
                  <div
                    key={friend.name}
                    className={`cursor-pointer p-4 border rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg ${type === friend.name ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setType(friend.name)}
                  >
                    <p className='text-center font-semibold text-gray-700'>
                      {friend.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button
              className={`w-full py-3 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1'
                }`}
              type='submit'
              disabled={isSubmitting} // ボタン無効化
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
