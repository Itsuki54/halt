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
    async signIn({ user, account }) {
      // Googleのsubを取得
      const googleId = account?.providerAccountId;
      if (!googleId) return false;

      // googleIdでユーザーを検索、存在しない場合は作成
      await db.user.upsert({
        where: { googleId },
        update: {},
        create: { googleId },
      });

      return true;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.uid = token.uid;

      return session;
    },

    async jwt({ token, user }) {
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
