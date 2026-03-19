import Image from 'next/image';
import { Container, GreenHero, Section } from '@/components/layout';
import { AutoScrollCarousel, CTASection, FadeIn, TabsPanel, WhySection, homeWhyIcons } from '@/components/ui';
import type { WhySectionCard } from '@/components/ui';
import aboutContent from '@/content/about.json';
type MissionTab = { id: string; label: string; text: string };
type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: { src: string; alt: string };
};

const WHY_ICONS = homeWhyIcons;

export const metadata = {
  title: aboutContent.meta.title,
  description: aboutContent.meta.description,
};

export default function AboutPage() {
  const { hero, missionVision, team, why, office, cta } = aboutContent.sections;
  const missionTabs = (missionVision.tabs as MissionTab[]).map((tab) => ({
    id: tab.id,
    label: tab.label,
    content: <p>{tab.text}</p>,
  }));

  return (
    <>
      <GreenHero
        id="about-hero-section"
        title={hero.headline}
      />

      <Section id="about-intro-section" background="white" padding="none" className="py-[6rem]">
        <Container maxWidth="7xl">
          <FadeIn>
            <div id="about-intro-content">
              <h2 className="mb-[0.875rem] text-brand-black">{hero.intro_heading}</h2>
              <p className="mt-5 text-[1.25rem] leading-relaxed text-brand-black/75">{hero.subtext}</p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <section id="about-hero-carousel-section" className="overflow-hidden bg-brand-off-white-background">
        <Container maxWidth="7xl" className="py-[4.375rem]">
          <FadeIn>
            <div id="about-hero-carousel">
              <AutoScrollCarousel images={hero.carousel} fadeColor="from-[#fffcf9]" />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* background matches Webflow: var(--brand--off-white-background) = #fffcf9 */}
      <Section id="about-mission-vision-section" background="off-white-bg" padding="none">
        <Container maxWidth="7xl" className="py-16">
          <FadeIn>
            <div id="mission-vision-header-wrap" className="mb-[2.0625rem] md:pl-64">
              <h3 className="font-heading text-[1.5rem] font-semibold leading-[1.2] md:text-[3rem] lg:text-[2rem] text-brand-black">{missionVision.heading}</h3>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div id="mission-vision-tabs-component">
              <TabsPanel tabs={missionTabs} defaultTab={missionTabs[0]?.id} orientation="vertical" variant="webflow" />
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section id="about-team-section" background="white" padding="none">
        <Container maxWidth="7xl" className="py-20">
          <FadeIn>
            <div className="mb-16">
              <h2 className="font-heading text-[1.5rem] font-semibold leading-[1.2] md:text-[3rem] lg:text-[2rem] text-brand-black">{team.heading}</h2>
            </div>
          </FadeIn>
          <div id="about-team-container" className="mb-16 grid gap-12">
            {(team.members as TeamMember[]).map((member, index) => (
              <FadeIn key={member.id} delay={index * 100}>
                <article id={`team-member-${member.id}`} className="flex gap-11">
                  <div className="hidden h-[17.875rem] w-[17.875rem] shrink-0 overflow-hidden rounded-xl">
                    {member.image ? (
                      <Image
                        src={member.image.src}
                        alt={member.image.alt}
                        width={286}
                        height={286}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-[0.625rem]">
                      <h4 className="text-brand-black">{member.name}</h4>
                      <div className="text-[1rem]">{member.role}</div>
                    </div>
                    <p className="text-[1rem] leading-[1.5] text-brand-black/80">{member.bio}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
          {team.boardImage ? (
            <FadeIn delay={300}>
              <div id="team-board-image-container" className="mx-auto w-full max-w-[42.6875rem] text-center">
                <div className="mb-4">
                  <Image
                    src={team.boardImage.src}
                    alt={team.boardImage.alt}
                    width={684}
                    height={460}
                    className="h-auto w-full"
                  />
                </div>
                <p className="text-sm text-brand-black/80">{team.boardCaption}</p>
              </div>
            </FadeIn>
          ) : null}
        </Container>
      </Section>

      <WhySection
        id="about-why-section"
        heading={why.heading}
        intro={why.intro}
        cards={why.cards as WhySectionCard[]}
        icons={WHY_ICONS}
        cardsClassName="flex flex-col gap-[2.375rem] pb-20"
      />

      <Section background="white" padding="lg" className="hidden">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-brand-black">{office.heading}</h2>
              <p className="mt-4 text-lg font-medium text-brand-blue">{office.address}</p>
              <p className="mt-4 text-lg leading-relaxed text-brand-black/70">{office.description}</p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <CTASection
        id="about-cta-section"
        heading={cta.heading}
        body={cta.body}
        primaryCta={cta.cta}
        variant="green"
      />
    </>
  );
}
