import type { Metadata } from 'next';
import Image from 'next/image';
import BreadcrumbBanner from '@/components/marketing/BreadcrumbBanner';
import SectionTitle from '@/components/marketing/SectionTitle';
import AnimatedSection from '@/components/ui/AnimatedSection';
import ThemeButton from '@/components/marketing/ThemeButton';

export const metadata: Metadata = {
  title: '소개 - 스스로 척척! 생활 습관',
  description: '초등학교 1학년 기본 생활 습관 도우미 소개',
};

const features = [
  {
    icon: '/images/aicon/icon1.png',
    title: '직관적인 학생 관리',
    desc: '학생 카드를 터치하면 바로 활동 체크가 가능합니다.',
  },
  {
    icon: '/images/aicon/icon2.png',
    title: '실시간 진행률 확인',
    desc: '각 학생의 루틴 달성률을 프로그레스 바로 즉시 확인합니다.',
  },
  {
    icon: '/images/aicon/icon3.png',
    title: '동기부여 칭찬 시스템',
    desc: '모든 활동 완료 시 축하 애니메이션으로 성취감을 높여줍니다.',
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbBanner title="소개" current="소개" />

      {/* About Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Image
                src="/images/about/about-1.png"
                alt="소개 이미지"
                width={600}
                height={500}
                className="rounded-2xl w-full h-auto"
              />
            </AnimatedSection>
            <div>
              <SectionTitle
                subtitle="About Us"
                title="스스로 척척! 은 아이들의 자립을 응원합니다"
                subtitleColor="text-p5"
              />
              <AnimatedSection delay={0.2}>
                <p className="mt-6 text-text-body leading-relaxed">
                  초등학교 1학년은 처음으로 학교라는 사회에 발을 내딛는 시기입니다.
                  매일 반복되는 기본 생활 습관 — 알림장 쓰기, 준비물 챙기기, 우유 마시기 — 을
                  스스로 체크하며 &quot;나도 할 수 있어!&quot; 라는 자신감을 키웁니다.
                </p>
                <p className="mt-4 text-text-body leading-relaxed">
                  선생님은 반 전체 학생의 진행 상황을 한눈에 파악하고,
                  개별 학생에게 맞춤 피드백을 줄 수 있습니다.
                  터치 한 번으로 간편하게 관리하세요.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <div className="mt-8">
                  <ThemeButton href="/classroom" variant="primary" arrow>
                    교실 입장하기
                  </ThemeButton>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-bg-grayblue">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <SectionTitle
              subtitle="특징"
              title="아이들과 선생님 모두를 위한 설계"
              center
              subtitleColor="text-p4"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-cmnbg rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Image src={item.icon} alt="" width={40} height={40} />
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
        </div>
      </section>
    </>
  );
}
