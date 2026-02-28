import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-p5 text-white hover:bg-p1',
  secondary: 'bg-p2 text-white hover:bg-p3',
  outline: 'border-2 border-p5 text-header hover:bg-p5 hover:text-white',
};

export default function ThemeButton({
  href,
  children,
  variant = 'primary',
  arrow = false,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-7 py-3 font-heading font-semibold rounded-full transition-colors ${variantStyles[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowRight size={18} />}
    </Link>
  );
}
