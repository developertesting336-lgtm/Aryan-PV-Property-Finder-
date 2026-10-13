// app/api/admin/users/[id]/role/route.ts
// PATCH: change a user's role. Admin only.
// Cannot change your own role (prevent locking yourself out).

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { usersDb } from '@/lib/users';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check: must be logged in as admin
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  // Prevent admin from changing their own role
  if (id === session.id) {
    return NextResponse.json({ error: 'You cannot change your own role.' }, { status: 400 });
  }

  const body = await request.json();
  const newRole = body.role;

  // Only allow "user" or "admin" – never trust anything else from the browser
  if (newRole !== 'user' && newRole !== 'admin') {
    return NextResponse.json({ error: 'Invalid role. Must be "user" or "admin".' }, { status: 400 });
  }

  const updated = await usersDb.updateUserRole(id, newRole);
  if (!updated) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, id: updated.id, role: updated.role });
}
