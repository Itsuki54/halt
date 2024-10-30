import LoginRequired from '@/components/auth/LoginRequired';
import { ChatHistoryBar } from '@/layouts/ChatHistoryBar';
import { db } from '@/lib/prisma';
import Layout from '@/pages/layout';
import {
  Bot,
  Group as PrismaGroup,
  Log,
  User,
} from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useRouter } from 'next/router';
import {
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { FiSend } from 'react-icons/fi';
import { authOptions } from './api/auth/[...nextauth]';

interface Group extends PrismaGroup {
  logs: Log[];
}

interface Props {
  user: User | null;
  bot: Bot | null;
  currentGroup: Group | null;
  groups: Group[];
}

export default function Home({ user, bot, currentGroup, groups }: Props) {
  const [messages, setMessages] = useState<{ sender: string; text: string; }[]>([]);
  const [input, setInput] = useState('');
  const router = useRouter();

  const onClickedNewBot = () => {
    if (user) {
      router.push(`/bots/new?userId=${user.id}`);
    }
  };

  useEffect(() => {
    if (currentGroup) {
      const formattedMessages: SetStateAction<{ sender: string; text: string; }[]> = [];

      currentGroup.logs.forEach(log => {
        // まずユーザーのメッセージを追加
        formattedMessages.push({
          sender: 'user',
          text: log.message,
        });

        // 次にBotの応答があれば追加
        if (log.response) {
          formattedMessages.push({
            sender: 'bot',
            text: log.response,
          });
        }
      });

      setMessages(formattedMessages);
    }
  }, [currentGroup]);

  const handleSendMessage = async () => {
    if (!currentGroup) return;
    if (!bot) return;
    if (!currentGroup) return;
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
          message: input,
          response: chatgptResponse,
          groupId: currentGroup.id,
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

  if (!bot || !currentGroup) {
    return (
      <Layout>
        <div className='chat flex w-full h-full relative'>
          <div className='flex flex-col items-center justify-center h-screenlg:w-3/4'>
            <p className='mb-6'>Botを作成するには下のボタンをクリックしてください。</p>
            <button
              className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150'
              onClick={() => {
                router.push(`/bots/new?userId=${user.id}`);
              }}
            >
              Botを作成する
            </button>
          </div>
          <div className={`h-full lg:w-1/4`}>
            <ChatHistoryBar groups={groups} onClickedNewBot={onClickedNewBot} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='chat flex w-full h-full relative'>
        <div className='flex flex-col h-full w-full lg:w-3/4' style={{ backgroundColor: 'rgba(0, 195, 202, 0.3)' }}>
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
              <FiSend size={30} className='w-full' color='white' />
            </div>
          </div>
        </div>
        <div className={`h-full lg:w-1/4`}>
          <ChatHistoryBar groups={groups} onClickedNewBot={onClickedNewBot} />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const { groupId } = ctx.query;

  if (!session || !session.user) {
    return {
      props: {
        user: null,
        bot: null,
        currentGroup: null,
        groups: [],
      },
    };
  }

  // ユーザー情報の取得
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
        currentGroup: null,
        groups: [],
      },
    };
  }

  const groups = await db.group.findMany({
    where: {
      userId: session.user.uid,
    },
  });

  // groupIdが指定されている場合、それに基づいてcurrentGroupを取得
  const currentGroup = groupId ? await db.group.findUnique({ where: { id: groupId as string }, include: { logs: true } }) : null;

  const botData = currentGroup?.botId ? await db.bot.findUnique({ where: { id: currentGroup.botId } }) : null;

  return {
    props: {
      user: JSON.parse(JSON.stringify(userData)),
      bot: botData ? JSON.parse(JSON.stringify(botData)) : null,
      currentGroup: currentGroup ? JSON.parse(JSON.stringify(currentGroup)) : null,
      groups: JSON.parse(JSON.stringify(groups)),
    },
  };
};
