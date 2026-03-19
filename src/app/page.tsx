import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { FadeIn, AnimatedCounter, homeWhyIcons, subjectIconList, SupportMissionSection } from '@/components/ui';
import { CTASection } from '@/components/sections';
import { WhySection } from '@/components/sections';
import type { WhySectionCard } from '@/components/sections';
import { Button } from '@/components/ui/button';
import homeContent from '@/content/home.json';
type Stat = { value: number; suffix: string; label: string };
type Collaborator = {
  id: string;
  title: string;
  description?: string;
  accent: 'cyan-light' | 'yellow' | 'green-2';
  logo: { src: string; alt: string };
};
type NewsArticle = { id: string; title: string; excerpt: string; date: string; href: string };

const WHY_ICONS = homeWhyIcons;

const SUBJECT_ICONS = subjectIconList;

const collaboratorAccentMap = {
  'cyan-light': 'bg-brand-cyan-light',
  yellow: 'bg-brand-yellow',
  'green-2': 'bg-brand-green-2',
} as const;

export const metadata = {
  title: homeContent.meta.title,
  description: homeContent.meta.description,
};

export default function HomePage() {
  const { hero, feature, why, curriculum, growthPlan, collaborators, finalCta } =
    homeContent.sections;

  return (
    <>
      <section id="home-hero-section" className="relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <Image
            src={hero.background.glitter}
            alt=""
            fill
            priority
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 sm:h-64">
          <Image
            src={hero.background.dashlines}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-20"
            aria-hidden="true"
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-0 z-10 hidden lg:block">
          <Image src={hero.background.dots} alt="" width={253} height={130} className="opacity-30" aria-hidden="true" />
        </div>

        <Container maxWidth="7xl" className="relative z-20 pt-[10rem] pb-[16rem]">
          <FadeIn>
            <div id="home-hero-content" className="mx-auto max-w-4xl text-center">
              <h1 className="text-brand-black">{hero.headline}</h1>
              <p className="mt-5 text-xl font-medium text-brand-black/75 sm:text-2xl">{hero.subtext}</p>
              <div className="mt-8 flex justify-center">
                <Button render={<Link href={hero.cta.href} />} size="lg">
                  {hero.cta.label}
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Welcome to Al-Hayaat School — hidden to match Webflow (section_home-feature is set to invisible in the designer) */}
      <Section id="home-feature-section" background="primary" padding="lg" className="hidden">
        <Container maxWidth="7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
            <FadeIn>
              <div id="home-feature-content" className="relative">
                <h2 className="text-white">{feature.heading}</h2>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                  {feature.eyebrow}
                </p>
                <div className="my-6">
                  <Image src={feature.writtenImage} alt="Arabic calligraphy spelling Islam." width={170} height={46} />
                </div>
                <div className="space-y-5 text-lg leading-relaxed text-white/85">
                  {feature.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div id="home-feature-image-container" className="relative mx-auto w-full max-w-[34rem]">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 p-3 shadow-2xl">
                  <div className="relative aspect-[1.05] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={feature.featureImage.src}
                      alt={feature.featureImage.alt}
                      fill
                      sizes="(max-width: 1024px) 90vw, 540px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="absolute -left-4 top-8 h-7 w-7 rounded-full bg-brand-cyan-light" aria-hidden="true" />
                <span className="absolute right-8 top-4 h-10 w-10 rounded-full bg-brand-yellow" aria-hidden="true" />
                <span className="absolute -bottom-2 left-8 h-8 w-8 rounded-full bg-brand-green-2" aria-hidden="true" />
                <span className="absolute bottom-14 right-0 h-6 w-6 rounded-full bg-white" aria-hidden="true" />
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <WhySection
        id="home-why-section"
        heading={why.heading}
        intro={why.intro}
        cards={why.cards as WhySectionCard[]}
        icons={WHY_ICONS}
        sectionPadding="lg"
        sectionClassName="relative overflow-hidden"
        headingClassName="mb-6"
        introClassName="mb-12 text-lg text-brand-black/65"
        cardsClassName="flex flex-col gap-10"
        decorations={
          <>
            <div
              className="pointer-events-none absolute -right-52 hidden xl:block"
              style={{ top: '-16rem' }}
              aria-hidden="true"
            >
              <Image src="/images/circle-light-green.webp" alt="" width={467} height={467} />
            </div>
            <div
              className="pointer-events-none absolute -left-52 hidden xl:block"
              style={{ bottom: '-7rem', zIndex: -1 }}
              aria-hidden="true"
            >
              <Image src="/images/circle-light-orange.webp" alt="" width={467} height={467} />
            </div>
          </>
        }
      />

      <Section id="home-curriculum-section" background="white" padding="none" className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute -bottom-[6.375rem] -right-[5.375rem]" aria-hidden="true">
          <Image src="/images/dotted.png" alt="" width={270} height={254} />
        </div>
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
              <div id="home-curriculum-header" className="lg:max-w-[32rem] lg:shrink-0">
                <h2 className="text-brand-black">{curriculum.heading}</h2>
                <p className="mt-4 text-lg text-brand-black/65">{curriculum.intro}</p>
              </div>
              <div id="home-curriculum-subjects" className="w-full">
                <ul className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {curriculum.subjects.map((subject, subjectIdx) => (
                    <li key={subject} className="flex items-center gap-6 text-base font-medium text-brand-black">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-brand-black/70">
                        {SUBJECT_ICONS[subjectIdx]}
                      </span>
                      {subject}
                    </li>
                  ))}
                </ul>
                <Button render={<Link href={curriculum.cta.href} />} size="sm">
                  {curriculum.cta.label}
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Growth Plan — hidden to match Webflow (display: none in .padding-section-our-growth-plan) */}
      <Section id="home-growth-plan-section" background="gray" padding="lg" className="hidden">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="text-brand-black">{growthPlan.heading}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-black/70">{growthPlan.intro}</p>
            </div>
          </FadeIn>

          <div className="mb-16 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {(growthPlan.stats as Stat[]).map((stat, index) => (
              <FadeIn key={`${stat.label}-${index}`} delay={index * 120}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl font-bold text-brand-blue">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-base text-brand-black/70">{stat.label}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="rounded-2xl bg-white p-8 text-center">
              <h2 className="mb-6 text-brand-black">{growthPlan.educators.heading}</h2>
              <div className="mx-auto max-w-3xl space-y-4">
                {growthPlan.educators.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-brand-black/70">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Collaborators — hidden to match Webflow (display: none in .padding-section-collaborator) */}
      <Section id="home-collaborators-section" background="white" padding="lg" className="hidden">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="text-brand-black">{collaborators.heading}</h2>
            </div>
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-3">
            {(collaborators.items as Collaborator[]).map((item, index) => (
              <FadeIn key={item.id} delay={index * 120}>
                <article id={`collaborator-${item.id}`} className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                  <div className="flex min-h-36 items-center justify-center bg-white px-8 py-6">
                    <Image
                      src={item.logo.src}
                      alt={item.logo.alt}
                      width={220}
                      height={92}
                      className="max-h-20 w-auto object-contain"
                    />
                  </div>
                  <div className={`min-h-44 px-6 py-6 ${collaboratorAccentMap[item.accent]}`}>
                    {item.description ? (
                      <p className="mb-5 text-sm leading-relaxed text-brand-black/75">{item.description}</p>
                    ) : null}
                    <h3 className="text-[2rem] text-brand-black">{item.title}</h3>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <SupportMissionSection sectionId="home-support-mission-section" />

      {/* News & Announcements — hidden to match Webflow (.section_home-news-announcement has class "hide") */}
      <Section id="home-news-section" background="gray" padding="lg" className="hidden">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mb-12 text-center">
              <h2 className="text-brand-black">{homeContent.sections.news.heading}</h2>
            </div>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {(homeContent.sections.news.articles as NewsArticle[]).map((article, index) => (
              <FadeIn key={article.id} delay={index * 120}>
                <article id={`news-article-${article.id}`} className="flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-3 text-xs font-medium uppercase tracking-widest text-brand-blue">
                      {new Date(article.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="mb-3 text-[1.5rem] leading-snug text-brand-black">{article.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-brand-black/65">{article.excerpt}</p>
                    <div className="mt-5">
                      <Link
                        href={article.href}
                        className="text-sm font-semibold text-brand-blue hover:underline"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        id="home-final-cta-section"
        heading={finalCta.heading}
        body={finalCta.body}
        primaryCta={finalCta.cta}
        variant="green"
      />
    </>
  );
}
