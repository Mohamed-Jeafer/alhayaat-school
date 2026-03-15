import type { Metadata } from 'next';
import Link from 'next/link';
import { listDonations } from '@/lib/db/queries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DonationsSearchForm } from '@/components/admin/DonationsSearchForm';
import { DonationsPagination } from '@/components/admin/DonationsPagination';

export const metadata: Metadata = {
  title: 'Donations | Admin — Al-Hayaat School',
};

interface DonationsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function AdminDonationsPage({ searchParams }: DonationsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const search = params.search?.trim() || undefined;
  const perPage = 25;

  let result;
  let dbError = false;

  try {
    result = await listDonations({ page, perPage, search });
  } catch (err) {
    console.error('[admin/donations] DB query failed:', err);
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-gray-700">Admin</Link>
            <span>/</span>
            <span className="text-gray-900">Donations</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          {result && (
            <p className="mt-1 text-sm text-gray-500">
              {result.total} total donation{result.total !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <DonationsSearchForm defaultValue={search} />
        </div>

        {/* Error state */}
        {dbError && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-6" role="alert">
            <p className="text-sm text-red-700">
              Unable to load donations. Please try again or contact your administrator.
            </p>
          </div>
        )}

        {/* Table */}
        {!dbError && result && (
          <>
            {result.donations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
                <p className="text-sm text-gray-500">
                  {search
                    ? `No donations found matching "${search}".`
                    : 'No donations recorded yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead scope="col" className="font-semibold">Date</TableHead>
                      <TableHead scope="col" className="font-semibold">Donor</TableHead>
                      <TableHead scope="col" className="font-semibold">Email</TableHead>
                      <TableHead scope="col" className="font-semibold text-right">Amount</TableHead>
                      <TableHead scope="col" className="font-semibold">Status</TableHead>
                      <TableHead scope="col" className="font-semibold">Session ID</TableHead>
                      <TableHead scope="col" className="font-semibold">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.donations.map((donation) => (
                      <TableRow key={donation.id} className="hover:bg-gray-50">
                        <TableCell className="text-sm text-gray-700 whitespace-nowrap">
                          {formatDate(donation.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-900">
                          {donation.isAnonymous ? (
                            <span className="italic text-gray-500">Anonymous Donor</span>
                          ) : (
                            donation.donorName ?? '—'
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">
                          {donation.donorEmail}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-gray-900 text-right whitespace-nowrap">
                          {formatAmount(donation.amountCad)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={donation.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs capitalize"
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 font-mono max-w-[120px] truncate">
                          {donation.stripeSessionId}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/api/stripe/receipt?session_id=${donation.stripeSessionId}`}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            aria-label={`Download receipt for donation from ${donation.isAnonymous ? 'anonymous donor' : (donation.donorName ?? donation.donorEmail)}`}
                          >
                            Download
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="mt-6">
                <DonationsPagination
                  currentPage={result.page}
                  totalPages={result.totalPages}
                  search={search}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
