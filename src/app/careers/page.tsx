import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BriefcaseBusiness, CheckCircle2, Lightbulb, MapPin, Users } from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { ColoredBorderCard, FadeIn } from '@/components/ui';
import { Button } from '@/components/ui/button';
import careersContent from '@/content/careers.json';

export const metadata: Metadata = {
  title: careersContent.meta.title,
  description: careersContent.meta.description,
};

const reasonIcons = [
  <BriefcaseBusiness key="faith" className="h-5 w-5 text-brand-black" />,
  <Lightbulb key="innovative" className="h-5 w-5 text-brand-black" />,
  <Users key="growth" className="h-5 w-5 text-brand-black" />,
  <MapPin key="impact" className="h-5 w-5 text-brand-black" />,
];

const paymentLogos = [
  { id: 'visa', src: '/images/visa.webp', alt: 'Visa credit card company logo.' },
  { id: 'mastercard', src: '/images/master-card.webp', alt: 'Mastercard logo.' },
  { id: 'paypal', src: '/images/paypal.webp', alt: 'PayPal logo.' },
  { id: 'apple-pay', src: '/images/apple-pay.webp', alt: 'Apple Pay logo.' },
  { id: 'google-pay', src: '/images/g-pay.webp', alt: 'Google Pay logo.' },
  { id: 'shop', src: '/images/shop.webp', alt: 'Shop Pay logo.' },
  { id: 'amex', src: '/images/am-ex.webp', alt: 'American Express logo.' },
];

export default function CareersPage() {
  const { hero, intro, why_join, openings, cta } = careersContent;

  return (
    <main className="min-h-screen bg-white">
      <section id="careers-hero-section" className="relative overflow-hidden bg-brand-green py-12 text-white">
        <Image
          src="/images/cta-bg.webp"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
          priority
        />
        <div className="relative z-10">
          <Container>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/80">
              {hero.join_heading}
            </h2>
            <div className="py-8">
              <nav aria-label="Breadcrumb" className="mb-4">
                <ol className="flex items-center gap-2 text-sm text-white/60">
                  <li className="flex items-center gap-2">
                    <Link href="/" className="hover:text-white hover:underline">Home</Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span aria-hidden="true">/</span>
                    <span aria-current="page" className="font-medium text-white">Careers</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-white">{hero.headline}</h1>
              {hero.subtext && <p className="mt-2 text-lg text-white/80">{hero.subtext}</p>}
            </div>
          </Container>
        </div>
      </section>

      <Section id="careers-intro-section" background="white" padding="lg">
        <Container maxWidth="xl">
          <FadeIn>
            <div className="mx-auto">
              <h2 className="text-brand-black">{intro.heading}</h2>
              {intro.body.split('\n\n').map((paragraph) => (
                <p key={paragraph} className="mt-5 text-lg leading-relaxed text-brand-black/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section id="careers-why-join-section" background="white" padding="lg">
        <Container maxWidth="xl">
          <FadeIn>
            <div className="mb-8">
              <h2 className="text-brand-black">{why_join.heading}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {why_join.reasons.map((reason, index) => (
                <ColoredBorderCard
                  key={reason.id}
                  accent="blue"
                  className="h-full rounded-[1.5rem] bg-white"
                  icon={
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-off-white">
                      {reasonIcons[index]}
                    </div>
                  }
                >
                  <h3 className="text-[1.9rem] text-brand-black">{reason.title}</h3>
                  <p className="text-base leading-relaxed text-brand-black/75">
                    {reason.description}
                  </p>
                </ColoredBorderCard>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section id="careers-openings-section" background="white" padding="lg">
        <Container maxWidth="xl">
          <FadeIn>
            <div className="mb-8">
              <h2 className="text-brand-black">{openings.heading}</h2>
            </div>

            <div className="space-y-6">
              {openings.positions.map((position) => (
                <ColoredBorderCard
                  key={position.id}
                  accent="green"
                  className="rounded-[1.5rem] bg-brand-off-white"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-[2rem] text-brand-black">{position.title}</h3>
                      <p className="mt-4 text-base leading-relaxed text-brand-black/75">
                        {position.description}
                      </p>

                      <div className="mt-5">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-black/55">
                          Key Qualifications
                        </h4>
                        <ul className="mt-3 space-y-3">
                          {position.qualifications.map((qualification) => (
                            <li key={qualification} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                              <span className="text-base leading-relaxed text-brand-black/75">
                                {qualification}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 lg:min-w-44">
                      <Button render={<Link href={`/careers/${position.slug}`} />}>
                        View Details
                      </Button>
                      <Button
                        variant="secondary"
                        render={
                          <Link href={`/careers/apply?position=${encodeURIComponent(position.title)}`} />
                        }
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </ColoredBorderCard>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section id="careers-cta-section" background="primary" padding="lg">
        <Container maxWidth="7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center">
            <FadeIn>
              <div>
                <h2 className="text-white">{cta.heading}</h2>
                <p className="mt-5 text-lg leading-relaxed text-white/80">{cta.body}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button render={<Link href={cta.primaryCta.href} />}>{cta.primaryCta.label}</Button>
                  <Button variant="secondary" render={<Link href={cta.secondaryCta.href} />}>
                    {cta.secondaryCta.label}
                  </Button>
                </div>
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium text-white/80">
                    Guaranteed safe &amp; secure checkout:
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {paymentLogos.map((logo) => (
                      <div key={logo.id} className="rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
                        <Image src={logo.src} alt={logo.alt} width={58} height={30} className="h-6 w-auto object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="relative mx-auto w-full max-w-[32rem]">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white p-3 shadow-xl">
                  <div className="relative aspect-[0.92] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src="/images/MUN03216-1.png"
                      alt="Child in an orange hoodie drawing smiley faces on a whiteboard in a classroom."
                      fill
                      sizes="(max-width: 1024px) 90vw, 520px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -right-4 top-6 hidden rounded-2xl bg-white p-3 shadow-lg md:block">
                  <Image src="/images/support-mission.webp" alt="" width={88} height={88} aria-hidden="true" />
                </div>
                <span className="absolute -left-2 bottom-10 h-4 w-4 rotate-45 bg-brand-yellow" aria-hidden="true" />
                <span className="absolute right-8 top-full mt-3 h-4 w-4 rotate-12 bg-brand-orange-light" aria-hidden="true" />
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>
    </main>
  );
}
