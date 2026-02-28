import type { Metadata } from 'next';
import Image from 'next/image';
import BreadcrumbBanner from '@/components/marketing/BreadcrumbBanner';
import SectionTitle from '@/components/marketing/SectionTitle';
import AnimatedSection from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: '갤러리 - 스스로 척척! 생활 습관',
  description: '교실 활동 사진 갤러리',
};

const galleryImages = [
  { src: '/images/aprotfolio/gl1.png', title: '즐거운 등교 시간', category: '교실 풍경' },
  { src: '/images/aprotfolio/gl2.png', title: '함께하는 루틴 체크', category: '활동 모습' },
  { src: '/images/aprotfolio/gl3.png', title: '작은 성취, 큰 성장', category: '교실 풍경' },
  { src: '/images/aprotfolio/gl4.png', title: '스스로 척척 활동', category: '활동 모습' },
  { src: '/images/aprotfolio/gl5.png', title: '우리 반 이야기', category: '교실 풍경' },
  { src: '/images/aprotfolio/gl1.png', title: '매일 성장하는 아이들', category: '활동 모습' },
];

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbBanner title="갤러리" current="갤러리" />

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <SectionTitle
              subtitle="Gallery"
              title="우리 반의 즐거운 일상을 만나보세요"
              center
              subtitleColor="text-p5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group relative rounded-2xl overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <h4 className="text-white font-heading font-semibold text-lg">
                        {item.title}
                      </h4>
                      <p className="text-white/70 text-sm">{item.category}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
