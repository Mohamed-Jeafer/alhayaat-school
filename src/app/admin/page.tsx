import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Al-Hayaat School',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <nav className="space-y-3">
          <div>
            <Link
              href="/admin/donations"
              className="text-blue-600 hover:underline font-medium"
            >
              → Donations
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
