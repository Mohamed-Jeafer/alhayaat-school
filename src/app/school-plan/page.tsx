import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Container, GreenHero, Section } from '@/components/layout';
import { ColoredBorderCard, FadeIn, SupportMissionSection } from '@/components/ui';
import { CTASection } from '@/components/sections';
import { Button } from '@/components/ui/button';
import content from '@/content/school-plan.json';

export const metadata = {
  title: 'School Plans | Al-Hayaat School',
  description:
    'Al-Hayaat School is set to open its doors in September 2026, offering a faith-based, high-quality education for the Kitchener-Waterloo community.',
};

export default function SchoolPlanPage() {
  const openingItems = [
    ...content.openingPlan.phases.map((phase) => `${phase.trigger}: ${phase.content}`),
    content.openingPlan.note,
  ];

  return (
    <>
      <GreenHero
        id="school-plan-hero-section"
        title={content.hero.title}
      />

      <Section id="school-plan-intro-section" background="white" padding="none" className="py-[6rem]">
        <Container maxWidth="7xl">
          <FadeIn>
            <div id="school-plan-intro-content">
              <h2 className="mb-[0.875rem] text-brand-black">{content.intro.heading}</h2>
              <p className="mt-5 text-[1.25rem] leading-relaxed text-brand-black/75">{content.intro.body}</p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Section matches Webflow section_school-plans: bg #fffcf9 */}
      <Section id="school-plans-cards-section" background="off-white-bg" padding="none" className="pt-[3.9375rem] pb-[3.125rem]">
        <Container maxWidth="7xl">
          <div id="school-plans-card-container" className="grid gap-[3.125rem] lg:grid-cols-2">
            <FadeIn>
              <ColoredBorderCard
                accent="yellow"
                className="h-full rounded-[1.5rem] border-0 bg-brand-off-white"
              >
                <h3 className="text-[2rem] text-brand-black">{content.openingPlan.heading}</h3>
                <ul className="space-y-4">
                  {openingItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                      <span className="text-base leading-relaxed text-brand-black/75">{item}</span>
                    </li>
                  ))}
                </ul>
              </ColoredBorderCard>
            </FadeIn>

            <FadeIn delay={120}>
              <ColoredBorderCard
                accent="blue"
                className="h-full rounded-[1.5rem] border-0 bg-white shadow-sm"
              >
                <h3 className="text-[2rem] text-brand-black">{content.community.heading}</h3>
                <p className="text-base leading-relaxed text-brand-black/75">
                  {content.community.body}
                </p>
                <div className="pt-2">
                  <Button render={<Link href={content.community.cta.href} />}>
                    {content.community.cta.label}
                  </Button>
                </div>
              </ColoredBorderCard>
            </FadeIn>
          </div>
        </Container>
      </Section>

      {/* Support Our Mission — uses shared component with blue background matching Webflow .support-mission-component */}
      <SupportMissionSection
        sectionId="school-plan-support-mission-section"
        contentOverride={{
          heading: content.mission.heading,
          points: content.mission.points,
          cta: content.mission.cta,
        }}
      />

      <CTASection
        id="school-plan-cta-section"
        heading={content.cta.heading}
        body={content.cta.body}
        primaryCta={content.cta.primaryCta}
      />
    </>
  );
}
