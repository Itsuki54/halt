import { db } from '@/lib/prisma';
import {
  Bot,
  User,
} from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useState } from 'react';
import {
  IoMan,
  IoWoman,
} from 'react-icons/io5';
import { authOptions } from './api/auth/[...nextauth]';
import Layout from './layout';

interface Props {
  user: User;
  bot: Bot;
}

export default function Home({ user, bot }: Props) {
  const [messages, setMessages] = useState<{ sender: string; text: string; }[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const chatgptResponse = data.chatgptResponse;
      setMessages([...messages, { sender: 'user', text: input }, {
        sender: 'bot',
        text: chatgptResponse,
      }]);
      setInput('');
    }
    catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <Layout>
      <div className='flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black p-6'>
        <h1 className='text-4xl font-fantasy text-white text-center mb-6 drop-shadow-lg'>Welcome to the Realm</h1>
      <div className='flex justify-center mb-6'>
        <div className='p-4 bg-white rounded-full shadow-lg'>
          <img src={bot.imageUrl ?? ''} alt='Bot' className='w-20 h-20 rounded-full' />
        </div>
      </div>
      <div className='flex flex-col items-center bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-lg shadow-inner max-h-80 overflow-y-auto'>
        {messages.map((msg, index) => (
          <div key={index} className={`w-full p-2 mb-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-200 text-blue-900' : 'bg-green-200 text-green-900'}`}>
            {msg.text}
          </div>
        ))}
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Type your message...'
          className='w-full p-2 mt-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button onClick={handleSendMessage} className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition'>
          Send
        </button>
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
        destination: '/signup',
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
      userId: user.id,
    },
  });
  const bot = JSON.parse(JSON.stringify(botData));
  if (!bot) {
    return {
      redirect: {
        destination: `/bot/new`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      user,
      bot,
    },
  };
};
