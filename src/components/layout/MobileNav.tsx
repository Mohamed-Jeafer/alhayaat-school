'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import sharedData from '@/content/_shared.json';

type NavLink = (typeof sharedData.nav.links)[number];

export function MobileNav() {
  const pathname = usePathname();
  const { links, cta, logo } = sharedData.nav;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative border-none bg-transparent text-white shadow-none hover:bg-white/10 md:hidden"
            aria-label="Open navigation menu"
          />
        }
      >
        <span className="flex h-5 w-5 flex-col justify-between">
          <span className="block h-0.5 rounded-full bg-current" />
          <span className="block h-0.5 rounded-full bg-current" />
          <span className="block h-0.5 rounded-full bg-current" />
        </span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-r-0 bg-black p-0 text-white">
        <SheetHeader className="border-b border-white/10 px-6 py-5">
          <SheetTitle className="text-left text-lg font-semibold tracking-wide text-white">
            {logo.text}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 px-4 py-6" aria-label="Mobile navigation">
          {links.map((link: NavLink) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  'rounded-xl px-4 py-3 text-base transition-colors',
                  isActive
                    ? 'bg-brand-yellow text-brand-black'
                    : 'text-white/80 hover:bg-white/10 hover:text-brand-blue'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            aria-label="Search"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-brand-blue"
          >
            <Search className="size-5" />
            Search
          </button>
          <div className="mt-4 px-4">
            <Button
              render={<Link href={cta.href} />}
              variant="secondary"
              className="w-full"
            >
              <Heart className="size-4" />
              {cta.label}
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
