import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/about', label: '소개' },
  { href: '/programs', label: '주요 기능' },
  { href: '/gallery', label: '갤러리' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: '문의' },
];

const appLinks = [
  { href: '/classroom', label: '교실 입장' },
  { href: '/settings', label: '설정' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-p1 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="스스로 척척"
                width={160}
                height={48}
                className="h-12 w-auto mb-4"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              초등학교 1학년 기본 생활 습관 형성을 도와주는 스마트 교실 도우미입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-white">
              바로가기
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-white">
              교실
            </h4>
            <ul className="space-y-2">
              {appLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-4 text-white">
              연락처
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>서울특별시 교육청</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span>info@1grade.kr</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0" />
                <span>02-123-4567</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-white/50 text-sm">
          &copy; {new Date().getFullYear()} 스스로 척척! 생활 습관. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
