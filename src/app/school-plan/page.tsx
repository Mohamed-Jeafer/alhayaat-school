import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Container, PageHeader, Section } from '@/components/layout';
import { CTASection, ColoredBorderCard, FadeIn } from '@/components/ui';
import { Button } from '@/components/ui/button';
import content from '@/content/school-plan.json';

const paymentLogos = [
  { id: 'visa', src: '/images/visa.webp', alt: 'Visa credit card company logo.' },
  { id: 'mastercard', src: '/images/master-card.webp', alt: 'Mastercard logo.' },
  { id: 'paypal', src: '/images/paypal.webp', alt: 'PayPal logo.' },
  { id: 'apple-pay', src: '/images/apple-pay.webp', alt: 'Apple Pay logo.' },
  { id: 'google-pay', src: '/images/g-pay.webp', alt: 'Google Pay logo.' },
  { id: 'shop', src: '/images/shop.webp', alt: 'Shop Pay logo.' },
  { id: 'amex', src: '/images/am-ex.webp', alt: 'American Express logo.' },
];

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
      <Section background="gray" padding="sm">
        <Container>
          <PageHeader title={content.hero.title} breadcrumbs={content.hero.breadcrumbs} />
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-lg leading-relaxed text-brand-black/75">{content.intro.body}</p>
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
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

      <Section background="gray" padding="lg">
        <Container maxWidth="7xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center">
            <FadeIn>
              <div>
                <h2 className="text-brand-black">{content.mission.heading}</h2>
                <ul className="mt-6 space-y-4">
                  {content.mission.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                      <span className="text-base leading-relaxed text-brand-black/75">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button render={<Link href={content.mission.cta.href} />} variant="secondary">
                    {content.mission.cta.label}
                  </Button>
                </div>
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium text-brand-black/75">
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

      <CTASection
        heading={content.cta.heading}
        body={content.cta.body}
        primaryCta={content.cta.primaryCta}
      />
    </>
  );
}
