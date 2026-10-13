// app/admin/users/page.tsx
// Lists all users with role management.
// An admin cannot demote or disable their own account (prevents lockout).

import { usersDb } from '@/lib/users';
import { getSession } from '@/lib/session';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await getSession();
  const allUsers = await usersDb.getAllUsers();

  // Strip password hashes before sending to the client
  const safeUsers = allUsers.map(u => ({
    id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Users</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Users</h1>
      </header>
      <main className="px-6 py-6 lg:px-8">
        <AdminUsersClient users={safeUsers} currentAdminId={session?.id ?? ''} />
      </main>
    </div>
  );
}
