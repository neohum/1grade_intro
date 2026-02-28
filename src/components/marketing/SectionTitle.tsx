import AnimatedSection from '@/components/ui/AnimatedSection';

export default function SectionTitle({
  subtitle,
  title,
  center = false,
  subtitleColor = 'text-p5',
}: {
  subtitle: string;
  title: string;
  center?: boolean;
  subtitleColor?: string;
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      <AnimatedSection>
        <span className={`font-heading font-medium ${subtitleColor} text-sm uppercase tracking-wider`}>
          {subtitle}
        </span>
      </AnimatedSection>
      <AnimatedSection delay={0.15}>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-header mt-2 leading-snug">
          {title}
        </h3>
      </AnimatedSection>
    </div>
  );
}
