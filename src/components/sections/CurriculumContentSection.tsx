import Image from 'next/image';
import { Container } from '@/components/layout';
import { cn } from '@/lib/utils';
import { AutoScrollCarousel } from '@/components/ui/AutoScrollCarousel';
import { CurriculumSubjectsGrid, FadeIn, type CurriculumSubjectItem } from '@/components/ui';

export type CurriculumSubject = CurriculumSubjectItem;

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
}

export interface CurriculumContentSectionProps {
  id?: string;
  subtext: string;
  subjects: CurriculumSubjectItem[];
  carousel: CarouselImage[];
  className?: string;
}

export function CurriculumContentSection({
  id,
  subtext,
  subjects,
  carousel,
  className,
}: Readonly<CurriculumContentSectionProps>) {
  return (
    <section id={id} className={cn('bg-white', className)}>
      <Container maxWidth="7xl" className="pt-[2rem]">
        <FadeIn>
          {/* Full-width hero image */}
          <div className="relative mb-10 overflow-hidden rounded-lg" style={{ aspectRatio: '2.39' }}>
            <Image
              src="/images/photos/about/hero-carousel/01.png"
              alt="Students sitting at desks in a classroom, with two raising their hands, and a teacher standing near a whiteboard."
              fill
              sizes="(max-width: 834px) 100vw, 834px"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-[-3rem] right-6 hidden md:block">
              <Image
                src="/images/overlays/Frame-1362791621.webp"
                alt="Abstract shapes including an orange square, yellow triangle pointing right, and a dark green circle."
                width={110}
                height={118}
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="mb-[6.25rem] flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-20">
            <div className="w-full lg:max-w-[39.375rem]">
              <p className="font-body text-[2rem] font-semibold leading-[1.4] text-brand-black">
                {subtext}
              </p>
            </div>
            <div className="w-full lg:max-w-[34.1875rem]">
              <CurriculumSubjectsGrid subjects={subjects} />
            </div>
          </div>
        </FadeIn>
      </Container>

      {carousel.length > 0 && (
        <section className="overflow-hidden bg-brand-off-white-background">
          <Container maxWidth="7xl" className="py-[4.375rem]">
            <FadeIn delay={120}>
              <AutoScrollCarousel images={carousel} fadeColor="from-[#fffcf9]" />
            </FadeIn>
          </Container>
        </section>
      )}
    </section>
  );
}
