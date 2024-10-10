import { db } from '@/lib/prisma';
import {
  Bot,
  User,
} from '@prisma/client';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import Layout from './layout';

interface Props {
  user: User;
  bot: Bot;
}

export default function Home({ user, bot }: Props) {
  return (
    <Layout>
      <div>
        <h1>Home</h1>
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
