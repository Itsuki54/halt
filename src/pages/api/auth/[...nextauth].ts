import { db } from '@/lib/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const findUserByCredentials = async (
  credentials: Record<'email' | 'password', string> | undefined,
) => {
  if (credentials?.email && credentials.password) {
    try {
      const user = await db.user.findUnique({
        where: {
          email: credentials.email,
        },
      });
      if (user) {
        const pepper = process.env.PEPPER;
        // bcryptを使ってパスワードを検証する
        const isValidPassword = await bcrypt.compare(
          pepper + credentials.password + user.salt,
          user.password,
        );

        if (isValidPassword) {
          return user;
        } else {
          console.warn('パスワード検証に失敗しました:', credentials.email);
          return null;
        }
      } else {
        console.warn('ユーザーが見つかりませんでした:', credentials.email);
      }
    } catch (e) {
      console.error('ユーザー認証中にエラーが発生しました:', e);
      return null;
    }
  }
  return null;
};

// 環境変数の確認
if (!process.env.NEXTAUTH_SECRET || !process.env.PEPPER) {
  throw new Error('認証のための環境変数が不足しています。');
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Username or Email',
      credentials: {
        email: { label: 'Username or Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = await findUserByCredentials(credentials);
        if (user) {
          return user;
        }
        console.warn('認証に失敗しました:', credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.uid = token.uid;
      session.user.type = token.type;
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.uid = user.id;
        token.accessToken = user.access_token;
        token.type = user.type;
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

export default NextAuth(authOptions);
