import LoginRequired from '@/components/auth/LoginRequired';
import { db } from '@/lib/prisma';
import Layout from '@/pages/layout';
import {
  Bot,
  User,
} from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';

interface Props {
  user: User | null;
  bot: Bot | null;
}

export default function Home({ user, bot }: Props) {
  const [messages, setMessages] = useState<{ sender: string; text: string; }[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!bot) return;
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, prompt: bot.type }),
      });

      const data = await response.json();
      const { chatgptResponse } = data;

      setMessages([
        ...messages,
        { sender: 'user', text: input },
        { sender: 'bot', text: chatgptResponse },
      ]);

      await fetch('/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          botId: bot?.id,
          message: input,
          response: chatgptResponse,
        }),
      });

      setInput('');
    }
    catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return <LoginRequired />;
  }

  if (!bot) {
    return (
      <Layout>
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
          <h1 className='text-2xl font-bold mb-4'>Botがありません</h1>
          <p className='mb-6'>Botを作成するには下のボタンをクリックしてください。</p>
          <button
            className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150'
            onClick={() => window.location.href = `/bots/new?userId=${user.id}`}
          >
            Botを作成する
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-col h-full' style={{ backgroundColor: 'rgba(0, 195, 202, 0.3)' }}>
        <div className='basis-11/12 overflow-y-auto p-4'>
          <div className='flex flex-col space-y-2'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.sender === 'user'
                      ? 'bg-[rgb(0,109,113)] text-white'
                      : 'bg-white text-[rgb(0,109,113)]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='basis-1/12 flex items-center mb-2 mx-4' style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          <input
            className='px-4 flex-1 h-full placeholder-gray-700 outline-none'
            onChange={e => setInput(e.target.value)}
            placeholder='何か悩んでる？相談に乗るよ！'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
            type='text'
            value={input}
          />
          <div
            className='flex items-center justify-center p-2 m-4'
            onClick={handleSendMessage}
            style={{ width: '5%', backgroundColor: 'rgba(0, 195, 202, 1)' }}
          >
            <Image alt='send' width={30} height={30} className='w-full' src='/send.png' />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session || !session.user) {
    return {
      props: {
        user: null,
        bot: null,
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
      props: {
        user: null,
        bot: null,
      },
    };
  }

  const botData = await db.bot.findFirst({
    where: {
      userId: session.user.uid,
    },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(userData)),
      bot: botData ? JSON.parse(JSON.stringify(botData)) : null,
    },
  };
};
