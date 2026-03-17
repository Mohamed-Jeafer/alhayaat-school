import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface HeroSectionProps {
  headline: string;
  subtext?: string;
  cta?: { label: string; href: string };
  backgroundVariant?: 'primary' | 'glitter' | 'solid' | 'image';
  backgroundImage?: string;
  className?: string;
}

const backgroundVariantMap: Record<
  NonNullable<HeroSectionProps['backgroundVariant']>,
  string
> = {
  primary: 'bg-brand-blue',
  glitter: 'bg-brand-blue',
  solid: 'bg-brand-blue',
  image: 'bg-brand-blue',
};

export function HeroSection({
  headline,
  subtext,
  cta,
  backgroundVariant = 'primary',
  backgroundImage,
  className,
}: HeroSectionProps) {
  const showImage = backgroundImage != null;

  return (
    <section
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden',
        'min-h-[480px] md:min-h-[600px]',
        backgroundVariantMap[backgroundVariant],
        className,
      )}
    >
      {showImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="text-white">
            {headline}
          </h1>

        {subtext && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl">
            {subtext}
          </p>
        )}

        {cta && (
          <div className="mt-10">
            <Link href={cta.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-white text-brand-blue hover:bg-white/90 sm:w-auto"
              >
                {cta.label}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
