import Image from 'next/image';
import { Container, GreenHero, Section } from '@/components/layout';
import { AutoScrollCarousel } from '@/components/ui/AutoScrollCarousel';
import { CTASection, FadeIn, subjectIcons } from '@/components/ui';
import content from '@/content/curriculum.json';

export const metadata = {
  title: 'Academic and Curriculum Focus | Al-Hayaat School',
  description:
    'Comprehensive education integrating Ontario standards with teachings. Language arts, Quranic education, mathematics, science, Arabic & more.',
};

export default function CurriculumPage() {
  return (
    <>
      <GreenHero
        id="curriculum-hero-section"
        title={content.hero.title}
      />

      <Section id="curriculum-intro-section" background="white" padding="none" className="py-[6rem]">
        <Container maxWidth="7xl">
          <FadeIn>
            <div id="curriculum-intro-content">
              <h2 className="mb-[0.875rem] text-brand-black">{content.intro.heading}</h2>
              <p className="mt-5 text-[1.25rem] leading-relaxed text-brand-black/75">{content.intro.body}</p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* ── Content below intro ─────────────────────────────────────── */}
      <section id="curriculum-content-section" className="bg-white">
        <Container maxWidth="7xl" className="pt-[2rem]">
          <FadeIn>

            {/* Full-width hero image — aspect-ratio 2.39, no white card */}
            <div className="relative mb-10 overflow-hidden rounded-lg" style={{ aspectRatio: '2.39' }}>
              <Image
                src="/images/MUN03200-1.png"
                alt="Students sitting at desks in a classroom, with two raising their hands, and a teacher standing near a whiteboard."
                fill
                sizes="(max-width: 834px) 100vw, 834px"
                className="object-cover"
                priority
              />
              {/* Decorative shapes — absolutely positioned at bottom-right, overlapping below image */}
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

          {/* Academic curriculum component — 2-col on desktop */}
          <FadeIn delay={80}>
            <div className="mb-[6.25rem] flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-20">
              {/* Left: Nunito 2rem heading text */}
              <div className="w-full lg:max-w-[39.375rem]">
                <p className="font-body text-[2rem] font-semibold leading-[1.4] text-brand-black">
                  {content.intro.subtext}
                </p>
              </div>

              {/* Right: 2-column subject icon grid */}
              <div className="w-full lg:max-w-[34.1875rem]">
                <div className="grid grid-cols-2 gap-x-[1.375rem] gap-y-[1.375rem]">
                  {content.subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center gap-6">
                      <div className="h-6 w-6 shrink-0 text-brand-black">
                        {subjectIcons[subject.id]}
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

        {/* Auto-scroll image carousel — matches about page wrapper */}
        <section className="overflow-hidden bg-brand-off-white-background">
          <Container maxWidth="7xl" className="py-[4.375rem]">
            <FadeIn delay={120}>
              <AutoScrollCarousel images={content.carousel} fadeColor="from-[#fffcf9]" />
            </FadeIn>
          </Container>
        </section>
      </section>

      {/* ── Academic growth / educators section ────────────────────── */}
      {/* id="curriculum-growth-section" for Playwright targeting (TASK-089) */}
      {/*
        Webflow: <div class="section-academic-growth"> (no section tag, no background)
        Contains our-growth-wrapper (height 42.75rem desktop, auto tablet)
        with absolutely-positioned educator image on the right at desktop.
      */}
      <div id="curriculum-growth-section" className="px-4 pb-[7.4375rem] pt-[3.3125rem] sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* our-growth-wrapper: relative container, fixed height on desktop */}
          <div className="relative lg:h-[42.75rem]">
            {/* our-growth-contatiner: blue card */}
            <div className="flex h-full flex-col justify-between gap-12 overflow-hidden rounded-xl border-b-[13px] border-brand-yellow bg-brand-blue p-10 sm:p-[2.8125rem] lg:flex-row lg:gap-20 lg:p-[2.8125rem_2.8125rem_5rem]">
              {/* Left text column */}
              <div className="w-full lg:max-w-[57%]">
                <div className="mb-4">
                  <h2 className="text-white">{content.educators.heading}</h2>
                </div>
                <p className="font-body text-[1.5rem] leading-[1.4] text-white opacity-80">
                  {content.educators.body1}
                  <br /><br />
                  {content.educators.body2}
                </p>
              </div>

              {/* Educator image — absolute on desktop, inline on tablet/mobile */}
              <div className="relative w-full overflow-hidden rounded-tl-lg rounded-br-lg lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:h-[85%] lg:w-[38%] lg:rounded-lg">
                <Image
                  src={content.educators.image.src}
                  alt={content.educators.image.alt}
                  fill
                  sizes="(max-width: 991px) 100vw, 484px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Decorative SVG shapes — visible only on desktop */}
            <div className="absolute right-[32%] top-[5%] hidden lg:block" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10.0892 0.847157L13.6368 10.0891L4.39484 13.6368L0.847179 4.39482L10.0892 0.847157Z" fill="#12B6B5" />
              </svg>
            </div>
            <div className="absolute bottom-[5%] right-[50%] hidden lg:block" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5098 0.348853L14.2523 14.9678L0.720662 9.16741L12.5098 0.348853Z" fill="#FBBB7D" />
              </svg>
            </div>
            <div className="absolute -bottom-[4.5rem] left-8 hidden lg:block" aria-hidden="true">
              <Image
                src="/images/Frame-1362791622.webp"
                alt="Three overlapping shapes: an orange semicircle, a light blue triangle, and a teal hexagon."
                width={80}
                height={80}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <CTASection
        heading={content.cta.heading}
        body={content.cta.body}
        primaryCta={content.cta.primaryCta}
      />
    </>
  );
}
