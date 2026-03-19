'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/button';
import homeContent from '@/content/home.json';

type PaymentLogo = { id: string; src: string; alt: string };

export interface SupportMissionContent {
  heading?: string;
  points?: string[];
  cta?: { href: string; label: string };
  paymentLogos?: PaymentLogo[];
  image?: { src: string; alt: string };
  decor?: { main: string };
}

const { supportMission } = homeContent.sections;

/**
 * Shared support-mission-component — matches Webflow .support-mission-component exactly.
 * Used on: Home page, Careers page, School Plan page (and any future page that needs it).
 * Content defaults to home.json sections.supportMission; pass contentOverride to customise per page.
 */
export function SupportMissionSection({
  sectionId = 'support-mission-section',
  contentOverride,
}: Readonly<{
  sectionId?: string;
  contentOverride?: SupportMissionContent;
}>) {
  const heading = contentOverride?.heading ?? supportMission.heading;
  const points = contentOverride?.points ?? supportMission.points;
  const cta = contentOverride?.cta ?? supportMission.cta;
  const paymentLogos = (contentOverride?.paymentLogos ?? supportMission.paymentLogos) as PaymentLogo[];
  const image = contentOverride?.image ?? supportMission.image;
  const decor = contentOverride?.decor ?? supportMission.decor;

  return (
    <section id={sectionId} aria-labelledby={`${sectionId}-heading`} className="px-4 pb-24 pt-0 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-brand-blue px-10 py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <FadeIn>
            <div id={`${sectionId}-content`}>
              <h3
                id={`${sectionId}-heading`}
                className="font-display text-[2rem] font-normal leading-tight text-white"
              >
                {heading}
              </h3>
              <ul className="mt-6 space-y-4 pl-0 list-none">
                {points.map((point) => (
                  <li
                    key={point}
                    className="relative pl-[2.5rem] text-[1.125rem] leading-relaxed text-white/80"
                    style={{
                      backgroundImage: "url('/images/list-check.svg')",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: '5px 5px',
                      backgroundSize: 'auto',
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button render={<Link href={cta.href} />} variant="secondary">
                  {cta.label}
                </Button>
              </div>
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-white/75">
                  Guaranteed safe &amp; secure checkout:
                </p>
                <div id={`${sectionId}-payment-logos`} className="flex flex-wrap items-center gap-3">
                  {paymentLogos.map((logo) => (
                    <div key={logo.id} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={58}
                        height={30}
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div id={`${sectionId}-image-wrapper`} className="relative mx-auto w-full max-w-[32rem]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-white/10 p-3">
                <div className="relative aspect-[0.92] overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 520px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div
                id={`${sectionId}-decor-shapes`}
                className="absolute -right-4 top-6 hidden rounded-2xl bg-white p-3 shadow-lg md:block"
                aria-hidden="true"
              >
                <Image
                  src={decor.main}
                  alt=""
                  width={88}
                  height={88}
                />
              </div>
              <span
                className="absolute -left-2 bottom-10 h-4 w-4 rotate-45 bg-brand-yellow"
                aria-hidden="true"
              />
              <span
                className="absolute right-8 top-full mt-3 h-4 w-4 rotate-12 bg-brand-orange-light"
                aria-hidden="true"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
