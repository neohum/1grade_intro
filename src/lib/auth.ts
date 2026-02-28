import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const teacher = await prisma.teacher.findUnique({
          where: { email: credentials.email },
        });

        if (!teacher) return null;

        const isValid = await bcrypt.compare(credentials.password, teacher.password);
        if (!isValid) return null;

        return {
          id: String(teacher.id),
          email: teacher.email,
          name: teacher.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.teacherId = Number(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).teacherId = token.teacherId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
};

export async function getTeacherId(): Promise<number | null> {
  // Dynamic import to avoid issues with server components
  const { getServerSession } = await import('next-auth');
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.teacherId ?? null;
}
