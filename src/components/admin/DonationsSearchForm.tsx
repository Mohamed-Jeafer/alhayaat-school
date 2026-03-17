'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DonationsSearchFormProps {
  defaultValue?: string;
}

export function DonationsSearchForm({ defaultValue }: DonationsSearchFormProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  const router = useRouter();
  const pathname = usePathname();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set('search', value.trim());
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    setValue('');
    router.push(pathname);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <Input
        type="search"
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search donations by donor name or email"
        className="flex-1"
      />
      <Button type="submit" variant="default" size="sm">Search</Button>
      {defaultValue && (
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          Clear
        </Button>
      )}
    </form>
  );
}
