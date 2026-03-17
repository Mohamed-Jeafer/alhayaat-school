import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { FooterNewsletter } from './FooterNewsletter';
import sharedData from '@/content/_shared.json';

const SOCIAL_ICONS = {
  Facebook: Facebook,
  Instagram: Instagram,
  Youtube: Youtube,
  Twitter: Twitter,
} as const;

type SocialPlatform = keyof typeof SOCIAL_ICONS;

export function Footer() {
  const { tagline, address, phone, email, social, quick_links, copyright, legal_links } =
    sharedData.footer;
  const { logo } = sharedData.nav;

  return (
    <footer className="bg-brand-off-white-background text-brand-black" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-lg font-semibold">{logo.text}</span>
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-brand-black/75">{tagline}</p>

            <div className="flex items-center gap-3">
              {social.map((item) => {
                const Icon = SOCIAL_ICONS[item.platform as SocialPlatform];
                if (!Icon) return null;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full bg-brand-green text-white transition-colors duration-300 hover:bg-brand-blue"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Menu
            </h3>
            <ul className="space-y-2">
              {quick_links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-black/80 transition-all duration-300 hover:text-brand-blue hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-brand-black/80">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-black/50" />
                <a
                  href={`mailto:${email}`}
                  className="break-all transition-colors duration-300 hover:text-brand-blue"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-brand-black/80">
                <Phone className="h-4 w-4 shrink-0 text-brand-black/50" />
                <a href={`tel:${phone}`} className="transition-colors duration-300 hover:text-brand-blue">
                  {phone}
                </a>
              </li>
              <li className="text-sm leading-relaxed text-brand-black/80">{address}</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Newsletter
            </h3>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-brand-black/55">{copyright}</p>
          <div className="flex items-center gap-4">
            {legal_links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm text-brand-black/55 transition-colors duration-300 hover:text-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
