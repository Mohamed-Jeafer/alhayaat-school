import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DonationsPaginationProps {
  currentPage: number;
  totalPages: number;
  search?: string;
}

function buildUrl(page: number, search?: string): string {
  const params = new URLSearchParams();
  params.set('page', String(page));
  if (search) params.set('search', search);
  return `/admin/donations?${params.toString()}`;
}

export function DonationsPagination({ currentPage, totalPages, search }: DonationsPaginationProps) {
  return (
    <nav
      className="flex items-center justify-between"
      aria-label="Donations pagination"
    >
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1, search)}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Previous
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>Previous</Button>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1, search)}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Next
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>Next</Button>
        )}
      </div>
    </nav>
  );
}
