import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Lightbulb, Users, MapPin } from 'lucide-react';
import { Container, Section, Grid, PageHeader } from '@/components/layout';
import { FeatureCard, CTASection, FadeIn } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import careersContent from '@/content/careers.json';

export const metadata: Metadata = {
  title: careersContent.meta.title,
  description: careersContent.meta.description,
};

const whyJoinIcons = [
  <BookOpen key="faith" className="h-6 w-6 text-primary" />,
  <Lightbulb key="innovative" className="h-6 w-6 text-primary" />,
  <Users key="collaborative" className="h-6 w-6 text-primary" />,
  <MapPin key="community" className="h-6 w-6 text-primary" />,
];

export default function CareersPage() {
  const { hero, intro, why_join, openings, cta } = careersContent;

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <Section background="gray" padding="md">
        <Container>
          <PageHeader
            title={hero.headline}
            subtitle={hero.subtext}
            breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
          />
        </Container>
      </Section>

      {/* Intro */}
      <Section background="white" padding="lg">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                {intro.heading}
              </h2>
              {intro.body.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Why Join */}
      <Section background="gray" padding="lg">
        <Container>
          <FadeIn>
            <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
              {why_join.heading}
            </h2>
            <Grid columns={2} gap="lg">
              {why_join.reasons.map((reason, index) => (
                <FeatureCard
                  key={reason.id}
                  icon={whyJoinIcons[index]}
                  title={reason.title}
                  description={reason.description}
                />
              ))}
            </Grid>
          </FadeIn>
        </Container>
      </Section>

      {/* Job Openings */}
      <Section background="white" padding="lg">
        <Container>
          <FadeIn>
            <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
              {openings.heading}
            </h2>

            {openings.positions.length === 0 ? (
              <p className="text-gray-500">
                No positions are currently open. Please check back soon.
              </p>
            ) : (
              <div className="space-y-6">
                {openings.positions.map((position) => (
                  <Card
                    key={position.id}
                    className="transition-shadow duration-200 hover:shadow-lg"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {position.title}
                            </h3>
                            <Badge variant="secondary">{position.grades}</Badge>
                          </div>
                          <p className="leading-relaxed text-gray-600">{position.description}</p>

                          <div className="mt-4">
                            <h4 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Key Qualifications
                            </h4>
                            <ul className="space-y-1">
                              {position.qualifications.map((q, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                  {q}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                          <Button render={<Link href={`/careers/${position.slug}`} />}>
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            render={
                              <Link
                                href={`/careers/apply?position=${encodeURIComponent(position.title)}`}
                              />
                            }
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </FadeIn>
        </Container>
      </Section>

      {/* CTA */}
      <CTASection
        heading={cta.heading}
        body={cta.body}
        primaryCta={cta.primary_cta}
        secondaryCta={cta.secondary_cta}
      />
    </main>
  );
}
