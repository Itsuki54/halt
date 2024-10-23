import { typeList } from '@/data/prompt';
import { db } from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '../layout';

export default function NewBot() {
  const router = useRouter();
  const { userId } = router.query;
  const [type, setType] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const friend = typeList.find(f => f.name === type);
    if (!friend) {
      toast.error('Please select a friend');
      return;
    }

    const response = await fetch('/api/bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, userId }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      toast.success('AI friend created successfully');
      router.push('/');
    }
    else {
      toast.error('Failed to create AI friend');
    }
  };

  return (
    <Layout>
      <div className='flex justify-center items-center bg-gray-100'>
        <div className='bg-white shadow-lg rounded-lg p-8'>
          <h1 className='text-3xl font-semibold text-center text-gray-800 mb-6'>
            Create a New AI Friend
          </h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='text-lg font-medium text-gray-700 mb-2 block'>
                Select an AI Friend
              </label>
              <div className='grid grid-cols-2 gap-4'>
                {typeList.map(friend => (
                  <div
                    key={friend.name}
                    onClick={() => setType(friend.name)}
                    className={`cursor-pointer p-4 border rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg ${type === friend.name ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <p className='text-center font-semibold text-gray-700'>
                      {friend.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <button
              type='submit'
              className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1'
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }

  const userData = await db.user.findUnique({
    where: {
      id: session.user.uid,
    },
  });

  if (!userData) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      },
    };
  }
  const user = JSON.parse(JSON.stringify(userData));

  const botData = await db.bot.findUnique({
    where: {
      userId: session.user.uid,
    },
  });

  const bot = JSON.parse(JSON.stringify(botData));
  if (bot) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
