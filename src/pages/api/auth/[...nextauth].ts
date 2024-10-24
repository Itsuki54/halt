import { db } from '@/lib/prisma';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn(user: any) {
      const { email } = user.user;
      await db.user.upsert({
        where: { email },
        update: {},
        create: {
          email: user.user.email,
        },
      });

      return true;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;

      session.user.id = token.id;
      session.user.uid = token.uid;

      return session;
    },

    async jwt({ token, user }: any) {
      if (user) {
        const userExist = await db.user.findUnique({
          where: {
            email: user.email,
          },
        });
        token.uid = userExist?.id;
        token.accessToken = user.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '@/pages/signin',
  },
};

export default NextAuth(authOptions);
