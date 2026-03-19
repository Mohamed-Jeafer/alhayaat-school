import type { Metadata } from 'next';
import Link from 'next/link';
import { HandCoins, Landmark, Mail, ShieldCheck, Wallet } from 'lucide-react';
import { Container, Section } from '@/components/layout';
import { CTASection, ColoredBorderCard, FadeIn } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DonationForm } from '@/components/donate/DonationForm';
import donateContent from '@/content/donate.json';

export const metadata: Metadata = {
  title: donateContent.meta.title,
  description: donateContent.meta.description,
  openGraph: {
    title: donateContent.meta.og_title,
    description: donateContent.meta.og_description,
  },
};

const methodConfig = [
  { accent: 'yellow', icon: <HandCoins className="h-6 w-6 text-brand-black" /> },
  { accent: 'orange', icon: <Mail className="h-6 w-6 text-brand-black" /> },
  { accent: 'blue', icon: <Landmark className="h-6 w-6 text-white" /> },
  { accent: 'green', icon: <ShieldCheck className="h-6 w-6 text-brand-black" /> },
  { accent: 'red', icon: <Wallet className="h-6 w-6 text-white" /> },
] as const;

export default function DonatePage() {
  const { hero, info, payment_form, other_methods } = donateContent.sections;

  return (
    <main className="min-h-screen bg-white">
      <Section id="donate-hero-section" background="white" padding="lg">
        <Container maxWidth="7xl">
          <FadeIn>
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-brand-black">{hero.headline}</h1>
              <p className="mt-7 text-arabic text-[1.9rem] leading-[1.9] text-brand-black/85 sm:text-[2.35rem]">
                {hero.arabic_verse}
              </p>
              <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-brand-black/75">
                {hero.verse_translation}
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-[0.24em] text-brand-black/55">
                {hero.verse_reference}
              </p>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section id="donate-info-section" background="white" padding="lg">
        <Container maxWidth="7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <FadeIn>
              <div>
                <h2 className="text-brand-black">{info.subheadline}</h2>
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-brand-black/75">
                  <p>{info.body}</p>
                  <p>
                    <strong>Khums:</strong> Al-Hayaat School can collect khums to use a portion for
                    the school. Please reach out at{' '}
                    <a href={`mailto:${info.finance_email}`} className="font-medium text-brand-blue hover:underline">
                      {info.finance_email}
                    </a>{' '}
                    for further information.
                  </p>
                  <p>
                    {info.charity_note} {info.comments_note}
                  </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {other_methods.methods.map((method, index) => {
                    const config = methodConfig[index];
                    const isCreditCard = method.id === 'donate-method-credit-card';

                    return (
                      <ColoredBorderCard
                        key={method.id}
                        accent={config.accent}
                        className="h-full rounded-[1.5rem] border-0 bg-white"
                        icon={
                          <div
                            className={
                              config.accent === 'blue' || config.accent === 'red'
                                ? 'flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue'
                                : 'flex h-10 w-10 items-center justify-center rounded-full bg-brand-off-white'
                            }
                          >
                            {config.icon}
                          </div>
                        }
                      >
                        <h3 className="text-[2rem] text-brand-black">{method.title}</h3>
                        <p className="text-base leading-relaxed text-brand-black/75">
                          {method.body}
                        </p>
                        {method.email ? (
                          <a href={`mailto:${method.email}`} className="text-sm font-semibold text-brand-blue hover:underline">
                            {method.email}
                          </a>
                        ) : null}
                        {isCreditCard ? (
                          <div className="pt-2">
                            <Button render={<Link href="#donation-form" />} size="sm">
                              Donate
                            </Button>
                          </div>
                        ) : null}
                      </ColoredBorderCard>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div
                id="donation-form"
                className="rounded-[1.75rem] border border-black/10 bg-white p-7 shadow-xl"
              >
                <h2 className="mb-6 text-[2rem] text-brand-black">{payment_form.form_headline}</h2>
                <DonationForm
                  content={{
                    id: String(payment_form.id),
                    form_headline: String(payment_form.form_headline),
                    preset_amounts: payment_form.preset_amounts as number[],
                    custom_label: String(payment_form.custom_label),
                    name_label: String(payment_form.name_label),
                    email_label: String(payment_form.email_label),
                    address_label: String(payment_form.address_label),
                    anonymous_label: String(payment_form.anonymous_label),
                    submit_label: String(payment_form.submit_label),
                    processing_label: String(payment_form.processing_label),
                    stripe_note: String(payment_form.stripe_note),
                  }}
                />
              </div>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <CTASection
        heading="Join Our Community"
        body="Together, we're building a brighter future for our children and the community."
        primaryCta={{ label: 'Enroll now', href: '/admissions' }}
      />
    </main>
  );
}
