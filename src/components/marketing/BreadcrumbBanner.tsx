import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function BreadcrumbBanner({
  title,
  current,
}: {
  title: string;
  current: string;
}) {
  return (
    <section className="bg-cmnbg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-header mb-4">
            {title}
          </h1>
          <ul className="flex items-center gap-3 text-text-body">
            <li>
              <Link href="/" className="hover:text-p5 transition-colors">
                홈
              </Link>
            </li>
            <li>
              <ChevronRight size={16} />
            </li>
            <li className="text-p5 font-medium">{current}</li>
          </ul>
        </div>
        <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
          <Image
            src="/images/abanner/bread-thumb.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
