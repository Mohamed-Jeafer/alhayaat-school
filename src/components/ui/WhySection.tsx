import React from 'react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/layout';
import { FadeIn } from './FadeIn';
import { WhyCard } from './WhyCard';

export interface WhySectionCard {
  id: string;
  title: string;
  description: string;
}

export interface WhySectionProps {
  id?: string;
  heading: string;
  intro: string;
  cards: WhySectionCard[];
  icons: React.ReactNode[];
  sectionPadding?: 'sm' | 'md' | 'lg' | 'none';
  sectionClassName?: string;
  /** Extra classes on the heading wrapper (controls margin-bottom, padding-top) */
  headingClassName?: string;
  /** Extra classes on the intro paragraph */
  introClassName?: string;
  /** Classes on the cards container */
  cardsClassName?: string;
  /** Optional decorative elements rendered inside the Section before the Container (e.g. bg circles) */
  decorations?: React.ReactNode;
}

export function WhySection({
  id,
  heading,
  intro,
  cards,
  icons,
  sectionPadding = 'none',
  sectionClassName,
  headingClassName = 'mb-6 pt-8',
  introClassName = 'mb-[5.5625rem] text-[1.2rem] font-medium leading-[1.3] text-brand-black/80',
  cardsClassName = 'mx-auto flex max-w-[67.375rem] flex-col gap-[2.375rem] pb-20',
  decorations,
}: Readonly<WhySectionProps>) {
  return (
    <Section id={id} background="white" padding={sectionPadding} className={sectionClassName}>
      {decorations}
      <Container maxWidth="7xl">
        <FadeIn>
          {/* Heading: always full-width so text-center is relative to the whole container */}
          <h2 className={cn('w-full text-center text-brand-black', headingClassName)}>{heading}</h2>
          {/* Intro: left-aligned, indented to match where WhyCard text begins (icon w-16 + gap) */}
          <p className={cn('sm:pl-24 lg:pl-32', introClassName)}>{intro}</p>
        </FadeIn>
        <div className={cn('why-cards', cardsClassName)}>
          {cards.map((card, index) => (
            <FadeIn key={card.id} delay={index * 100}>
              <WhyCard
                icon={icons[index % icons.length]}
                title={card.title}
                description={card.description}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
