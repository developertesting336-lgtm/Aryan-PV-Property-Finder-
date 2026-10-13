// app/admin/layout.tsx
// Admin area layout with sidebar + topbar.
// Checks on the SERVER that the logged-in user is an admin.
// The public Navbar and Footer do NOT appear here.

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import AdminSidebar from './AdminSidebar';

export const metadata = { title: 'Admin Panel · PV Property Finder' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check — middleware already redirects, but this is the second layer
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }
  if (session.role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex min-h-screen bg-sand/20">
      {/* Sidebar – passes admin name to show at the bottom */}
      <AdminSidebar adminName={session.name} adminEmail={session.email} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {children}
      </div>
    </div>
  );
}
