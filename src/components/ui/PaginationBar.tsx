'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PaginationBarProps {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function PaginationBar({
  total,
  page,
  perPage,
  onPageChange,
  className,
}: PaginationBarProps) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Previous
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </Button>
    </nav>
  );
}
