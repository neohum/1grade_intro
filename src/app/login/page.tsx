'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-cmnbg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.svg"
            alt="스스로 척척"
            width={64}
            height={64}
            className="mb-4"
          />
          <h1 className="text-3xl font-heading font-bold text-header">
            <span className="font-accent text-p2">스스로 척척!</span>
          </h1>
          <p className="text-text-body mt-2">선생님 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-heading font-semibold text-header mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-p5 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-heading font-semibold text-header mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-p5 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-p5 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <p className="text-center text-sm text-text-body">
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-p5 font-semibold hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
