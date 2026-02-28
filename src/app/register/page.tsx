'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '회원가입에 실패했습니다.');
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch {
      setError('회원가입에 실패했습니다.');
      setLoading(false);
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
          <p className="text-text-body mt-2">선생님 회원가입</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-heading font-semibold text-header mb-1">
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-p5 focus:border-transparent"
              placeholder="홍길동"
            />
          </div>

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
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-p5 focus:border-transparent"
              placeholder="6자 이상"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-p5 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>

          <p className="text-center text-sm text-text-body">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-p5 font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
