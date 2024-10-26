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
    async signIn({ account }: { account: any; }) {
      const googleId = account?.providerAccountId;
      if (!googleId) return false;

      await db.user.upsert({
        where: { googleId },
        update: {},
        create: { googleId },
      });

      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any; }) {
      session.user.id = token.id;
      session.user.uid = token.uid;

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any; }) {
      if (user) {
        const userExist = await db.user.findUnique({
          where: { googleId: user.id },
        });
        token.uid = userExist?.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

export default NextAuth(authOptions);
