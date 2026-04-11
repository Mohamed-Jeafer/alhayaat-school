import Image from 'next/image';
import { Container } from '@/components/layout';
import { AutoScrollCarousel } from '@/components/ui/AutoScrollCarousel';
import { FadeIn, subjectIcons } from '@/components/ui';
import type { SubjectId } from '@/components/ui';

export interface CurriculumSubject {
  id: string;
  label: string;
}

export interface CarouselImage {
  id: string;
  src: string;
  alt: string;
}

export interface CurriculumContentSectionProps {
  id?: string;
  subtext: string;
  subjects: CurriculumSubject[];
  carousel: CarouselImage[];
  className?: string;
}

export function CurriculumContentSection({
  id,
  subtext,
  subjects,
  carousel,
  className,
}: CurriculumContentSectionProps) {
  return (
    <section id={id} className={`bg-white${className ? ` ${className}` : ''}`}>
      <Container maxWidth="7xl" className="pt-[2rem]">
        <FadeIn>
          {/* Full-width hero image */}
          <div className="relative mb-10 overflow-hidden rounded-lg" style={{ aspectRatio: '2.39' }}>
            <Image
              src="/images/MUN03200-1.png"
              alt="Students sitting at desks in a classroom, with two raising their hands, and a teacher standing near a whiteboard."
              fill
              sizes="(max-width: 834px) 100vw, 834px"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-[-3rem] right-6 hidden md:block">
              <Image
                src="/images/Frame-1362791621.webp"
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
              <div className="grid grid-cols-2 gap-x-[1.375rem] gap-y-[1.375rem]">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center gap-6">
                    <div className="h-6 w-6 shrink-0 text-brand-black">
                      {subjectIcons[subject.id as SubjectId]}
                    </div>
                    <span className="font-body text-[1.2rem] font-medium leading-[1.3] text-brand-black opacity-80">
                      {subject.label}
                    </span>
                  </div>
                ))}
              </div>
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
