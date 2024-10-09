import { db } from '@/lib/prisma';
import { User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]';

interface Props {
  user: User;
}

export default function Home({ user }: Props) {
  return (
    <div className='flex flex-col min-h-screen'>
      <h1>Home</h1>
    </div>
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

  const botData = await db.bot.findMany({
    where: {
      userId: session.user.uid,
    },
  });
  const bots = JSON.parse(JSON.stringify(botData));
  if (bots.length === 0) {
    return {
      redirect: {
        destination: `/bots/new?userId=${user.id}`,
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
