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
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
      <div className='flex flex-col h-full' style={{ backgroundColor: 'rgba(0, 195, 202, 0.3)' }}>
        {/* メッセージリスト */}
        <div className='basis-11/12 overflow-y-auto p-4'>
          <div className='flex flex-col space-y-2'>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'user' && (
                  <img
                    src={bot.imageUrl ?? ''}
                    alt='Bot'
                    className='w-8 h-8 rounded-full mr-2'
                  />
                )}
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

        {/* Input Section */}
        <div className='basis-1/12 flex items-center mb-2 mx-4' style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          <input
            type='text'
            placeholder='何か悩んでる？相談に乗るよ！'
            value={input}
            onChange={e => setInput(e.target.value)}
            className='px-4 flex-1 h-full placeholder-gray-700 outline-none'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
          />
          <div onClick={handleSendMessage} className='flex items-center justify-center p-2 m-4' style={{ width: '5%', backgroundColor: 'rgba(0, 195, 202, 1)' }}>
            <img src='/send.png' alt='send' className='w-full' />
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
