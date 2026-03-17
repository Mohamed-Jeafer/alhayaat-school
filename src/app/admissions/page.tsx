import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, CheckCircle2, GraduationCap, Heart } from 'lucide-react';
import { Container, Grid, PageHeader, Section } from '@/components/layout';
import { CTASection, ColoredBorderCard, FadeIn } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import admissionsContent from '@/content/admissions.json';

export const metadata: Metadata = {
  title: admissionsContent.meta.title,
  description: admissionsContent.meta.description,
};

const whyChooseIcons = [
  <GraduationCap key="academic" className="h-6 w-6 text-brand-blue" />,
  <BookOpen key="faith" className="h-6 w-6 text-brand-blue" />,
  <Heart key="holistic" className="h-6 w-6 text-brand-blue" />,
];

const enrollmentAccents = ['orange', 'yellow'] as const;

export default function AdmissionsPage() {
  const { hero, enrollment, why_choose, how_to_apply, requirements, fees, cta } =
    admissionsContent;

  return (
    <main className="min-h-screen bg-white">
      <Section background="gray" padding="md" className="overflow-hidden">
        <Container>
          <PageHeader
            title={hero.headline}
            subtitle={hero.subtext}
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admissions' }]}
            className="pb-4"
          />
          <div className="relative mt-4 overflow-hidden rounded-[1.5rem] border border-black/10 bg-white">
            <Image
              src="/images/banner.png"
              alt="Colorful admissions banner with abstract school-themed shapes."
              width={1422}
              height={210}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container>
          <FadeIn>
            <div className="mb-8 max-w-3xl">
              <h2 className="text-brand-black">{enrollment.heading}</h2>
            </div>
            <Grid columns={2} gap="lg">
              {enrollment.cards.map((card, index) => (
                <ColoredBorderCard
                  key={card.id}
                  accent={enrollmentAccents[index] ?? 'yellow'}
                  className="h-full rounded-[1.5rem] border-0 bg-brand-off-white shadow-none"
                >
                  <h3 className="text-[2rem] text-brand-black">{card.title}</h3>
                  <p className="text-base leading-relaxed text-brand-black/75">{card.body}</p>
                </ColoredBorderCard>
              ))}
            </Grid>
          </FadeIn>
        </Container>
      </Section>

      <Section background="gray" padding="lg">
        <Container>
          <FadeIn>
            <div className="mb-8 max-w-3xl">
              <h2 className="text-brand-black">{why_choose.heading}</h2>
            </div>
            <Grid columns={3} gap="lg">
              {why_choose.cards.map((card, index) => (
                <ColoredBorderCard
                  key={card.id}
                  accent="blue"
                  className="h-full rounded-[1.5rem] bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[1.75rem] text-brand-black">{card.title}</h3>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-off-white">
                      {whyChooseIcons[index]}
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-brand-black/70">
                    {card.description}
                  </p>
                  <div className="pt-2">
                    <Button render={<Link href="/admissions/apply" />} variant="ghost" className="px-0 text-brand-blue hover:bg-transparent hover:text-brand-blue/80">
                      Enroll now
                    </Button>
                  </div>
                </ColoredBorderCard>
              ))}
            </Grid>
          </FadeIn>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <FadeIn>
              <div className="max-w-xl">
                <h2 className="text-brand-black">{how_to_apply.heading}</h2>
                <p className="mt-4 text-lg leading-relaxed text-brand-black/70">
                  {how_to_apply.intro}
                </p>
                <div className="mt-8">
                  <Button size="lg" render={<Link href="/admissions/apply" />}>
                    Enroll now
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <ol className="space-y-5">
                {how_to_apply.steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-4 rounded-[1.25rem] border border-black/10 bg-brand-off-white p-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-base leading-relaxed text-brand-black/75">{step}</p>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
        </Container>
      </Section>

      <Section background="gray" padding="lg">
        <Container>
          <FadeIn>
            <div className="mb-8 max-w-3xl">
              <h2 className="text-brand-black">{requirements.heading}</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                {requirements.forms.map((form, index) => {
                  const isFirst = index === 0;
                  return (
                    <a
                      key={form.id}
                      href="#"
                      className="group flex min-h-40 flex-col justify-between rounded-[1.25rem] border border-black/10 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                    >
                      <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                      <p className="text-base font-medium leading-relaxed text-brand-black/80">
                        Download {form.label}
                      </p>
                      <div className="flex justify-end">
                        <Image
                          src={isFirst ? '/images/file.png' : '/images/pdf.png'}
                          alt=""
                          width={64}
                          height={64}
                          aria-hidden="true"
                          className="h-14 w-14 object-contain"
                        />
                      </div>
                    </a>
                  );
                })}
              </div>

              <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-[2rem] text-brand-black">Required Documents</h3>
                <ul className="mt-5 space-y-4">
                  {requirements.documents.map((doc) => (
                    <li key={doc} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                      <span className="text-base leading-relaxed text-brand-black/75">{doc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-brand-black/65">
                  Download, sign, and email completed forms to{' '}
                  <a href="mailto:admin@alhayaat.ca" className="font-medium text-brand-blue hover:underline">
                    admin@alhayaat.ca
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-brand-off-white p-6">
              <h4 className="text-[1.8rem] text-brand-black">{requirements.fees.heading}</h4>
              <ul className="mt-4 space-y-3">
                {requirements.fees.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
                    <span className="text-base leading-relaxed text-brand-black/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container>
          <FadeIn>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <h2 className="text-brand-black">{fees.heading}</h2>
              <Badge variant="secondary">Academic Year {fees.academic_year}</Badge>
            </div>
            <p className="mb-6 text-base text-brand-black/65">
              The following is the school fees schedule for the academic year {fees.academic_year}.
            </p>
            <div className="overflow-hidden rounded-[1.5rem] border border-black/10">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-brand-off-white">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-brand-black">Fee Type</th>
                    <th className="px-5 py-4 text-center font-semibold text-brand-black">
                      Amount
                    </th>
                    <th className="hidden px-5 py-4 text-center font-semibold text-brand-black sm:table-cell">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 bg-white">
                  {fees.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-4 text-brand-black">{item.type}</td>
                      <td className="px-5 py-4 text-center font-semibold text-brand-black">
                        {item.amount}
                      </td>
                      <td className="hidden px-5 py-4 text-center text-brand-black/65 sm:table-cell">
                        {item.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <CTASection heading={cta.heading} body={cta.body} primaryCta={cta.primary_cta} />
    </main>
  );
}
