'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BreadcrumbBanner from '@/components/marketing/BreadcrumbBanner';
import SectionTitle from '@/components/marketing/SectionTitle';
import AnimatedSection from '@/components/ui/AnimatedSection';

const faqs = [
  {
    q: '스스로 척척! 은 어떤 서비스인가요?',
    a: '초등학교 1학년 학생들의 기본 생활 습관 형성을 돕는 교실 관리 도구입니다. 선생님이 등교 루틴 항목을 설정하면, 학생들이 매일 자신의 활동을 터치로 체크할 수 있습니다.',
  },
  {
    q: '어떤 기기에서 사용할 수 있나요?',
    a: '웹 브라우저가 있는 모든 기기에서 사용 가능합니다. 특히 교실의 태블릿이나 터치스크린 모니터에 최적화되어 있습니다.',
  },
  {
    q: '학생 데이터는 안전하게 보관되나요?',
    a: '네, 모든 데이터는 안전한 클라우드 서버에 암호화되어 저장됩니다. 학생 이름 외에 개인정보는 수집하지 않습니다.',
  },
  {
    q: '선생님이 직접 활동 항목을 수정할 수 있나요?',
    a: '네, 설정 페이지에서 생활 습관 항목을 자유롭게 추가, 삭제할 수 있습니다. 우리 반에 맞는 맞춤 루틴을 만들어보세요.',
  },
  {
    q: '매일 기록은 어떻게 초기화되나요?',
    a: '선생님이 설정 페이지에서 "오늘 기록 초기화" 버튼을 눌러 수동으로 초기화할 수 있습니다. 이전 기록은 서버에 날짜별로 보관됩니다.',
  },
  {
    q: '여러 반에서 동시에 사용할 수 있나요?',
    a: '현재는 단일 교실 단위로 설계되어 있습니다. 각 반마다 별도의 인스턴스를 설정하여 사용할 수 있습니다.',
  },
];

function AccordionItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-heading font-semibold text-header text-lg pr-4">
          {faq.q}
        </span>
        <ChevronDown
          size={20}
          className={`text-p5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 text-text-body leading-relaxed">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <BreadcrumbBanner title="자주 묻는 질문" current="FAQ" />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <Image
                src="/images/about/faq.png"
                alt="FAQ 이미지"
                width={600}
                height={500}
                className="rounded-2xl w-full h-auto sticky top-28"
              />
            </AnimatedSection>
            <div>
              <SectionTitle
                subtitle="FAQ"
                title="궁금한 점을 확인해보세요"
                subtitleColor="text-p5"
              />
              <div className="mt-8 space-y-4">
                {faqs.map((faq, i) => (
                  <AnimatedSection key={i} delay={i * 0.1}>
                    <AccordionItem faq={faq} index={i} />
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
