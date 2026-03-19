import Image from 'next/image';
import { Container, Section } from '@/components/layout';

export interface AdmissionsBannerSectionProps {
  id?: string;
  image: { src: string; alt: string };
  className?: string;
}

export function AdmissionsBannerSection({ id, image, className }: AdmissionsBannerSectionProps) {
  return (
    <Section id={id} background="white" padding="none" className={`pb-[3rem] pt-[2rem] ${className ?? ''}`}>
      <Container>
        <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white">
          <Image
            src={image.src}
            alt={image.alt}
            width={1422}
            height={210}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      </Container>
    </Section>
  );
}
