import type { ReactNode } from 'react';
import Image from 'next/image';
import { BookOpen, GraduationCap, Star, Users } from 'lucide-react';

/** Home page WHY section — decorative webp vector images */
export const homeWhyIcons: ReactNode[] = [
  <Image key="faith" src="/images/vector-1.webp" alt="" width={56} height={56} />,
  <Image key="curriculum" src="/images/vector-2.webp" alt="" width={56} height={56} />,
  <Image key="excellence" src="/images/vector-3.webp" alt="" width={56} height={56} />,
  <Image key="community" src="/images/vector-4.webp" alt="" width={56} height={56} />,
];

/** About page WHY section — Lucide icon elements */
export const aboutWhyIcons: ReactNode[] = [
  <BookOpen key="faith" className="h-6 w-6 text-brand-blue" />,
  <GraduationCap key="curriculum" className="h-6 w-6 text-brand-blue" />,
  <Star key="excellence" className="h-6 w-6 text-brand-blue" />,
  <Users key="community" className="h-6 w-6 text-brand-blue" />,
];
