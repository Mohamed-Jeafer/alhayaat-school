import Image from 'next/image';
import {
  BookMarked,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  GraduationCap,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Container, PageHeader, Section } from '@/components/layout';
import { CTASection, ColoredBorderCard, FadeIn } from '@/components/ui';
import content from '@/content/curriculum.json';

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  GraduationCap,
  Calculator,
  BookMarked,
  FlaskConical,
  Globe,
  Users,
};

export const metadata = {
  title: 'Academic and Curriculum Focus | Al-Hayaat School',
  description:
    'Comprehensive education integrating Ontario standards with teachings. Language arts, Quranic education, mathematics, science, Arabic & more.',
};

export default function CurriculumPage() {
  return (
    <>
      <Section background="gray" padding="sm">
        <Container>
          <PageHeader title={content.hero.title} breadcrumbs={content.hero.breadcrumbs} />
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container maxWidth="7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-center">
            <FadeIn>
              <div className="relative mx-auto w-full max-w-[34rem]">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white p-3 shadow-xl">
                  <div className="relative aspect-[1.08] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src="/images/MUN03200-1.png"
                      alt="Students sitting at desks in a classroom, with two raising their hands, and a teacher standing near a whiteboard."
                      fill
                      sizes="(max-width: 1024px) 90vw, 540px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -right-6 top-8 hidden rounded-2xl bg-white p-3 shadow-lg md:block">
                  <Image
                    src="/images/Frame-1362791621.webp"
                    alt=""
                    width={96}
                    height={96}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="max-w-2xl">
                <h2 className="text-brand-black">{content.hero.title}</h2>
                <p className="mt-6 text-lg leading-relaxed text-brand-black/75">
                  {content.intro.body}
                </p>
                <p className="mt-5 text-xl leading-relaxed text-brand-black/65">
                  {content.intro.subtext}
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.subjects.map((subject) => {
                const IconComponent = ICON_MAP[subject.icon];
                return (
                  <ColoredBorderCard
                    key={subject.id}
                    accent="blue"
                    className="h-full rounded-[1.35rem] bg-brand-off-white"
                    icon={
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                        {IconComponent ? (
                          <IconComponent className="h-5 w-5 text-brand-black" />
                        ) : null}
                      </div>
                    }
                  >
                    <p className="text-lg font-medium capitalize leading-snug text-brand-black/80">
                      {subject.label}
                    </p>
                  </ColoredBorderCard>
                );
              })}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section background="gray" padding="lg">
        <Container maxWidth="xl">
          <FadeIn>
            <div className="rounded-[1.75rem] border border-black/10 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-brand-black">{content.educators.heading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-brand-black/75">
                {content.educators.body}
              </p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <CTASection
        heading={content.cta.heading}
        body={content.cta.body}
        primaryCta={content.cta.primaryCta}
      />
    </>
  );
}
