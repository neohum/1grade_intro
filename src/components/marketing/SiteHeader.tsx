'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

const navLinks = [
  { href: '/', label: '홈' },
  { href: '/about', label: '소개' },
  { href: '/programs', label: '주요 기능' },
  { href: '/gallery', label: '갤러리' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: '문의' },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-p1 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <ul className="flex items-center gap-6">
            <li className="flex items-center gap-2">
              <Phone size={14} />
              <span>02-123-4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} />
              <span>info@1grade.kr</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} />
              <span>서울특별시 교육청</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="스스로 척척"
              width={160}
              height={48}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-header font-heading font-medium hover:text-p5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/classroom"
              className="hidden sm:inline-flex px-6 py-2.5 bg-p5 text-white font-heading font-semibold rounded-full hover:bg-p1 transition-colors"
            >
              교실 입장
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="xl:hidden p-2 text-header"
              aria-label="메뉴 열기"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <Image
                src="/logo.svg"
                alt="로고"
                width={120}
                height={36}
                className="h-9 w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X size={24} className="text-header" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-header font-heading font-medium text-lg py-2 border-b border-gray-100 hover:text-p5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 space-y-3">
              <Link
                href="/classroom"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-6 py-3 bg-p5 text-white font-heading font-semibold rounded-full hover:bg-p1 transition-colors"
              >
                교실 입장
              </Link>
              <div className="text-sm text-text-body space-y-1">
                <p className="flex items-center gap-2"><Phone size={14} /> 02-123-4567</p>
                <p className="flex items-center gap-2"><Mail size={14} /> info@1grade.kr</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
