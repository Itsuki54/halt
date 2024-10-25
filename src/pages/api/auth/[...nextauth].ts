import { db } from '@/lib/prisma';
import NextAuth from 'next-auth';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;

      session.user.id = token.id;
      session.user.uid = token.uid;

      return session;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    signIn: '/signin',
  },
};

export default NextAuth(authOptions);
