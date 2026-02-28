'use client';

import { MapPin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import BreadcrumbBanner from '@/components/marketing/BreadcrumbBanner';
import SectionTitle from '@/components/marketing/SectionTitle';
import AnimatedSection from '@/components/ui/AnimatedSection';

const contactInfo = [
  {
    icon: MapPin,
    title: '위치',
    detail: '서울특별시 종로구 교육청로 1',
    color: 'text-p5',
    bg: 'bg-p5/10',
  },
  {
    icon: Mail,
    title: '이메일',
    detail: 'info@1grade.kr',
    color: 'text-p2',
    bg: 'bg-p2/10',
  },
  {
    icon: Phone,
    title: '전화',
    detail: '02-123-4567',
    color: 'text-p4',
    bg: 'bg-p4/10',
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbBanner title="문의하기" current="문의" />

      {/* Contact Cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <item.icon size={28} className={item.color} />
                  </div>
                  <h5 className="text-lg font-heading font-semibold text-header mb-2">
                    {item.title}
                  </h5>
                  <p className="text-text-body text-sm">{item.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <Image
                  src="/images/contact/contact-b1.png"
                  alt="문의 이미지"
                  width={600}
                  height={500}
                  className="rounded-2xl w-full h-auto"
                />
              </div>
            </AnimatedSection>
            <div>
              <SectionTitle
                subtitle="Contact"
                title="궁금한 점이 있으시면 문의해주세요"
                subtitleColor="text-p5"
              />
              <AnimatedSection delay={0.2}>
                <form className="mt-8 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="이름"
                      className="w-full px-5 py-3 bg-bg-grayblue rounded-xl border-none focus:ring-2 focus:ring-p5 outline-none font-body"
                    />
                    <input
                      type="email"
                      placeholder="이메일"
                      className="w-full px-5 py-3 bg-bg-grayblue rounded-xl border-none focus:ring-2 focus:ring-p5 outline-none font-body"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="학교명"
                    className="w-full px-5 py-3 bg-bg-grayblue rounded-xl border-none focus:ring-2 focus:ring-p5 outline-none font-body"
                  />
                  <textarea
                    rows={5}
                    placeholder="문의 내용을 입력해주세요"
                    className="w-full px-5 py-3 bg-bg-grayblue rounded-xl border-none focus:ring-2 focus:ring-p5 outline-none resize-none font-body"
                  />
                  <button
                    type="submit"
                    className="w-full px-8 py-3.5 bg-p2 text-white font-heading font-semibold rounded-full hover:bg-p3 transition-colors"
                  >
                    보내기
                  </button>
                </form>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
