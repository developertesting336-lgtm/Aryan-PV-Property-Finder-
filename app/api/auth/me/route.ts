// app/api/auth/me/route.ts
// Returns the current logged-in user from the session cookie.
// Never cached – always fresh data.

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { usersDb } from '@/lib/users';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { user: null, role: 'guest' },
      {
        status: 200, // 200 is intentional – not being logged in is a normal state
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  }

  // Look up the latest user data from the store (role might have changed since login)
  const user = await usersDb.findById(session.id);
  if (!user) {
    return NextResponse.json(
      { user: null, role: 'guest' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      role: user.role,
    },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
