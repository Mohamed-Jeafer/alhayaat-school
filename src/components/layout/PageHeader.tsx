import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn('py-8', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {isLast || !item.href ? (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className={isLast ? 'font-medium text-gray-900' : undefined}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href} className="hover:text-gray-700 hover:underline">
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
}
