import type { Metadata } from 'next';
import { CheckCircle } from 'lucide-react';
import { Container, Section, PageHeader } from '@/components/layout';
import { CTASection, FadeIn } from '@/components/ui';
import careersContent from '@/content/careers.json';

const position = careersContent.openings.positions[0];

export const metadata: Metadata = {
  title: `${position.title} | Al-Hayaat School Careers`,
  description: position.description,
};

export default function ElementaryTeacherPage() {
  const { cta } = careersContent;

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <Section background="gray" padding="md">
        <Container>
          <PageHeader
            title={position.title}
            subtitle={`${position.grades} — Al-Hayaat School`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Careers', href: '/careers' },
              { label: position.title },
            ]}
          />
        </Container>
      </Section>

      {/* Job Details */}
      <Section background="white" padding="lg">
        <Container maxWidth="lg">
          <FadeIn>
            <div className="space-y-10">
              {/* Job Description */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Job Description</h2>
                <p className="leading-relaxed text-gray-700">{position.description}</p>
              </section>

              {/* Key Responsibilities */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Key Responsibilities</h2>
                <ul className="space-y-3">
                  {position.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Qualifications */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Qualifications</h2>
                <ul className="space-y-3">
                  {position.qualifications.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Knowledge & Skills */}
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Knowledge and Skills</h2>
                <ul className="space-y-3">
                  {position.skills.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* How to Apply */}
              <section className="rounded-xl border border-primary/20 bg-primary/5 p-8">
                <h2 className="mb-3 text-xl font-bold text-gray-900">How to Apply</h2>
                <p className="mb-4 leading-relaxed text-gray-700">{position.application_note}</p>
                <p className="font-medium text-gray-900">{position.how_to_apply}</p>
                <a
                  href={`mailto:admin@alhayaat.ca?subject=Application: ${position.title}`}
                  className="mt-4 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90"
                >
                  Apply Now
                </a>
              </section>
            </div>
          </FadeIn>
        </Container>
      </Section>

      <CTASection
        heading={cta.heading}
        body={cta.body}
        primaryCta={{ label: 'Back to Careers', href: '/careers' }}
        secondaryCta={cta.secondary_cta}
      />
    </main>
  );
}
