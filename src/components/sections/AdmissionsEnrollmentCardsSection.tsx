import { Container, Grid, Section } from '@/components/layout';
import { ColoredBorderCard, FadeIn } from '@/components/ui';

const ACCENT_COLORS = ['orange', 'yellow'] as const;

export interface EnrollmentCard {
  id: string;
  title: string;
  body: string;
}

export interface AdmissionsEnrollmentCardsSectionProps {
  id?: string;
  heading: string;
  cards: EnrollmentCard[];
  className?: string;
}

export function AdmissionsEnrollmentCardsSection({
  id,
  heading,
  cards,
  className,
}: Readonly<AdmissionsEnrollmentCardsSectionProps>) {
  return (
    <Section id={id} background="white" padding="lg" className={className}>
      <Container>
        <FadeIn>
          <div className="mb-8 w-full">
            <h2 className="text-brand-black">{heading}</h2>
          </div>
          <Grid columns={2} gap="lg">
            {cards.map((card, index) => (
              <ColoredBorderCard
                key={card.id}
                accent={ACCENT_COLORS[index] ?? 'yellow'}
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
  );
}
