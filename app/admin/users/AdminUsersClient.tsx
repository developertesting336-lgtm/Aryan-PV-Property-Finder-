'use client';

// app/admin/users/AdminUsersClient.tsx
// Interactive user list with role change buttons.
// An admin cannot change THEIR OWN role (prevent self-lockout).

import { useState } from 'react';
import { ShieldCheck, User as UserIcon, Calendar } from 'lucide-react';

interface SafeUser { id: string; name: string; email: string; role: string; createdAt: string; }

export default function AdminUsersClient({ users: initial, currentAdminId }: { users: SafeUser[]; currentAdminId: string }) {
  const [users, setUsers] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  const changeRole = async (userId: string, newRole: 'user' | 'admin') => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-canvas shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-sand/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 hidden sm:table-cell">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {users.map((u) => {
            const isMe = u.id === currentAdminId;
            return (
              <tr key={u.id} className="hover:bg-sand/20 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-canvas text-[10px] font-bold text-ink">
                      {u.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{u.name} {isMe && <span className="text-[10px] text-clay">(you)</span>}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-sand text-ink'
                  }`}>
                    {u.role === 'admin' ? <ShieldCheck className="size-3" /> : <UserIcon className="size-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar className="size-3" />{new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  {isMe ? (
                    <span className="text-xs text-muted italic">Cannot modify yourself</span>
                  ) : (
                    <button
                      disabled={loading === u.id}
                      onClick={() => changeRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        u.role === 'admin'
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                      } disabled:opacity-50`}
                    >
                      {loading === u.id ? '…' : u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
