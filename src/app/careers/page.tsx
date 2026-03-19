import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, GreenHero, Section } from '@/components/layout';
import { FadeIn } from '@/components/ui';
import { SupportMissionSection } from '@/components/sections';
import { Button } from '@/components/ui/button';
import careersContent from '@/content/careers.json';

export const metadata: Metadata = {
  title: careersContent.meta.title,
  description: careersContent.meta.description,
};

export default function CareersPage() {
  const { hero, intro, why_join, openings } = careersContent;

  return (
    <main className="min-h-screen bg-white">

      <GreenHero
        id="careers-hero-section"
        title={hero.join_heading}
        subtitle={hero.headline}
      />

      {/* ── Intro + Why Join + Job Openings ── all inside one donate-content-wrapper inside container-large */}
      <Section id="careers-content-section" background="white" padding="none">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="py-[6rem]">

              {/* Welcome / Intro */}
              <div id="careers-intro-section" className="mb-[2.0625rem]">
                <h2 className="mb-[0.875rem] text-brand-black">{intro.heading}</h2>
                {intro.body.split('\n\n').map((paragraph) => (
                  <p key={paragraph} className="mt-5 text-[1.25rem] leading-relaxed text-brand-black/75">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Why Join */}
              <div id="careers-why-join-section" className="mb-[2.0625rem]">
                <h2 className="mb-[0.875rem] text-brand-black">{why_join.heading}</h2>
                <ul className="space-y-4 pl-0 list-none">
                  {why_join.reasons.map((reason) => (
                    <li
                      key={reason.id}
                      className="relative pl-[2.5rem] text-[1.125rem] leading-relaxed text-brand-black/75"
                      style={{
                        backgroundImage: "url('/images/bullet.png')",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '5px 5px',
                        backgroundSize: 'auto',
                        marginBottom: '1rem',
                      }}
                    >
                      <strong>{reason.title}:</strong> {reason.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Job Openings — only renders when positions exist */}
              {openings.positions.length > 0 && (
                <div id="careers-openings-section" className="mb-[2.0625rem]">
                  <h2 className="mb-[2.0625rem] text-brand-black">{openings.heading}</h2>
                  <div className="flex max-w-[45.25rem] flex-col gap-[1.5rem]">
                    {openings.positions.map((position) => (
                      <div
                        key={position.id}
                        className="rounded-[1.25rem] border border-[#d9d9d9] border-b-[0.625rem] border-b-brand-green p-[1.75rem]"
                      >
                        <h4 className="mb-3 text-[1.5rem] font-semibold text-brand-black">
                          <Link
                            href={`/careers/${position.slug}`}
                            className="hover:underline"
                          >
                            {position.title}
                          </Link>
                        </h4>
                        <p className="mb-4 text-[1.125rem] leading-relaxed text-brand-black/75">
                          {position.description}
                        </p>
                        <Button
                          render={
                            <Link
                              href={`/careers/apply?position=${encodeURIComponent(position.title)}`}
                            />
                          }
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* ── Support Mission ── shared component (same as home page), matches Webflow .support-mission-component */}
      <SupportMissionSection sectionId="careers-support-mission-section" />

    </main>
  );
}
