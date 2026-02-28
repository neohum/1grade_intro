import type { Metadata } from 'next';
import Image from 'next/image';
import BreadcrumbBanner from '@/components/marketing/BreadcrumbBanner';
import SectionTitle from '@/components/marketing/SectionTitle';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ThemeButton from '@/components/marketing/ThemeButton';

export const metadata: Metadata = {
  title: '주요 기능 - 스스로 척척! 생활 습관',
  description: '등교 루틴 관리, 습관 추적, 칭찬 시스템 등 핵심 기능 소개',
};

const services = [
  {
    icon: '/images/aicon/car-icons1.png',
    title: '등교 루틴 체크리스트',
    desc: '매일 아침 등교 후 해야 할 활동을 체크리스트로 관리합니다. 알림장, 숙제 확인, 준비물 정리 등을 한 곳에서 관리하세요.',
    color: 'bg-p5/10',
  },
  {
    icon: '/images/aicon/car-icons2.png',
    title: '학생별 진행률 추적',
    desc: '각 학생의 일일 습관 달성률을 실시간 프로그레스 바로 확인합니다. 누가 도움이 필요한지 한눈에 파악할 수 있습니다.',
    color: 'bg-p2/10',
  },
  {
    icon: '/images/aicon/car-icons3.png',
    title: '축하 애니메이션',
    desc: '모든 루틴을 완료하면 화려한 축하 애니메이션이 나타납니다! 아이들의 성취감과 동기부여를 자연스럽게 높여줍니다.',
    color: 'bg-p4/10',
  },
  {
    icon: '/images/aicon/car-icons4.png',
    title: '선생님 관리 도구',
    desc: '학생 명단 관리, 활동 항목 설정, 일일 기록 초기화 등 선생님이 필요한 모든 관리 기능을 제공합니다.',
    color: 'bg-p3/10',
  },
  {
    icon: '/images/aicon/icon1.png',
    title: '터치 최적화 UI',
    desc: '큰 버튼과 직관적인 인터페이스로 1학년 아이들도 쉽게 사용할 수 있습니다. 태블릿에 최적화되어 있습니다.',
    color: 'bg-p5/10',
  },
  {
    icon: '/images/aicon/icon2.png',
    title: '자동 일일 리셋',
    desc: '매일 새로운 시작! 어제의 기록은 보존하면서 오늘의 체크리스트는 깨끗하게 시작합니다.',
    color: 'bg-p2/10',
  },
];

export default function ProgramsPage() {
  return (
    <>
      <BreadcrumbBanner title="주요 기능" current="주요 기능" />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <SectionTitle
              subtitle="Our Features"
              title="체계적인 습관 관리를 위한 핵심 기능들"
              center
              subtitleColor="text-p5"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow h-full">
                  <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-5`}>
                    <Image src={item.icon} alt="" width={36} height={36} />
                  </div>
                  <h4 className="text-xl font-heading font-semibold text-header mb-3">
                    {item.title}
                  </h4>
                  <p className="text-text-body text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <ThemeButton href="/classroom" variant="primary" arrow>
                지금 바로 시작하기
              </ThemeButton>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
