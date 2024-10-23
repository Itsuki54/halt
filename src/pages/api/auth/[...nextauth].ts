import { db } from '@/lib/prisma';
import { User } from '@prisma/client';
import argon2 from 'argon2';
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
        if (
          await argon2.verify(
            user.password,
            pepper + credentials?.password + user.salt,
          )
        ) {
          return user;
        }
        else {
          return null;
        }
      }
    }
    catch (e) {
      console.log(e);
      return null;
    }
  }
  return null;
};

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
        const user = (await findUserByCredentials(credentials)) as User;
        if (user) {
          return user;
        }
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
