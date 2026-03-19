import Image from 'next/image';
import { Container } from '@/components/layout';
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
      {/* ── Hero section ───────────────────────────────────────────── */}
      <section id="curriculum-hero-section" className="bg-white">
        <Container maxWidth="7xl" className="pt-[4.9375rem]">
          <FadeIn>
            {/* Centered H1 title */}
            <div className="mb-14 text-center">
              <h1 className="text-brand-black">{content.hero.title}</h1>
            </div>

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

            {/* Subtext below image */}
            <div className="mb-[5.875rem] block w-full max-w-[80%]">
              <p className="font-body text-[1.2rem] font-medium leading-[1.3] text-brand-black opacity-80">
                {content.intro.body}
              </p>
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

        {/* Auto-scroll image carousel — full-width, same component as about page */}
        <div className="overflow-hidden pb-[2.9375rem]">
          <FadeIn delay={120}>
            <AutoScrollCarousel images={content.carousel} />
          </FadeIn>
        </div>
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
              <div className="w-full lg:max-w-[42.5625rem]">
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
              <div className="relative w-full overflow-hidden rounded-tl-lg rounded-br-lg lg:absolute lg:bottom-0 lg:right-0 lg:top-0 lg:h-[35rem] lg:w-[30.25rem] lg:rounded-tl-lg lg:rounded-br-lg">
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
