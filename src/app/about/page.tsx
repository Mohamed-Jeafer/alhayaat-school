import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, GraduationCap, MapPin, Star, Users } from 'lucide-react';
import { Container, Grid, PageHeader, Section } from '@/components/layout';
import { AutoScrollCarousel, CTASection, FadeIn, TabsPanel, WhyCard } from '@/components/ui';
import { Button } from '@/components/ui/button';
import aboutContent from '@/content/about.json';

type WhyCardItem = { id: string; title: string; description: string };
type MissionTab = { id: string; label: string; text: string };
type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: { src: string; alt: string };
};

const WHY_ICONS = [
  <BookOpen key="faith" className="h-6 w-6 text-brand-blue" />,
  <GraduationCap key="curriculum" className="h-6 w-6 text-brand-blue" />,
  <Star key="excellence" className="h-6 w-6 text-brand-blue" />,
  <Users key="community" className="h-6 w-6 text-brand-blue" />,
];

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
      <section className="overflow-hidden bg-brand-off-white-background">
        <Container maxWidth="7xl" className="py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
            <FadeIn>
              <div className="relative max-w-xl">
                <h1 className="text-brand-black">{hero.headline}</h1>
                <p className="mt-5 text-lg leading-relaxed text-brand-black/75">{hero.subtext}</p>
                <div className="mt-8">
                  <Button render={<Link href={hero.cta.href} />}>{hero.cta.label}</Button>
                </div>

                <div className="pointer-events-none absolute -left-8 top-0 hidden lg:block">
                  <Image src={hero.decor.shapeOne} alt="" width={120} height={112} aria-hidden="true" />
                </div>
                <div className="pointer-events-none absolute -bottom-10 left-28 hidden lg:block">
                  <Image src={hero.decor.shapeTwo} alt="" width={96} height={74} aria-hidden="true" />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <AutoScrollCarousel images={hero.carousel} />
            </FadeIn>
          </div>
        </Container>
      </section>

      <Section background="white" padding="sm">
        <Container maxWidth="7xl">
          <PageHeader
            title=""
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'About Us' },
            ]}
          />
        </Container>
      </Section>

      <Section background="gray" padding="lg">
        <Container maxWidth="7xl">
          <FadeIn>
            <h3 className="mb-10 text-center text-brand-black">{missionVision.heading}</h3>
          </FadeIn>

          <FadeIn delay={80}>
            <TabsPanel
              tabs={missionTabs}
              defaultTab={missionTabs[0]?.id}
              orientation="vertical"
              variant="webflow"
              className="gap-8 md:flex-row"
            />
          </FadeIn>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container maxWidth="7xl">
          <FadeIn>
            <h2 className="mb-12 text-center text-brand-black">{team.heading}</h2>
          </FadeIn>

          <Grid columns={3} gap="lg">
            {(team.members as TeamMember[]).map((member, index) => (
              <FadeIn key={member.id} delay={index * 100}>
                <article className="overflow-hidden rounded-[1.25rem] border border-black/10 bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-brand-off-white">
                    {member.image ? (
                      <Image
                        src={member.image.src}
                        alt={member.image.alt}
                        fill
                        sizes="(max-width: 1024px) 50vw, 320px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <h4 className="text-[2rem] text-brand-black">{member.name}</h4>
                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-brand-blue">
                      {member.role}
                    </p>
                    <p className="text-sm leading-relaxed text-brand-black/70">{member.bio}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </Grid>

          {team.boardImage ? (
            <FadeIn delay={300}>
              <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-sm">
                <div className="relative aspect-[684/460] overflow-hidden rounded-xl">
                  <Image
                    src={team.boardImage.src}
                    alt={team.boardImage.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 684px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-sm text-brand-black/65">{team.boardCaption}</p>
              </div>
            </FadeIn>
          ) : null}
        </Container>
      </Section>

      <Section background="gray" padding="lg">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="text-brand-black">{why.heading}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-black/65">{why.intro}</p>
            </div>
          </FadeIn>

          <Grid columns={2} gap="lg">
            {(why.cards as WhyCardItem[]).map((card, index) => (
              <FadeIn key={card.id} delay={index * 100}>
                <WhyCard
                  icon={WHY_ICONS[index % WHY_ICONS.length]}
                  title={card.title}
                  description={card.description}
                  index={index}
                />
              </FadeIn>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-brand-black">{office.heading}</h2>
              <div className="mt-4 flex items-center justify-center gap-2 text-brand-blue">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span className="font-semibold">{office.address}</span>
              </div>
              <p className="mt-4 text-lg leading-relaxed text-brand-black/70">{office.description}</p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <CTASection
        heading={cta.heading}
        body={cta.body}
        primaryCta={cta.cta}
        variant="primary"
      />
    </>
  );
}
