import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { usersDb } from '@/lib/users';
import { createSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Invalid input. Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const existingUser = await usersDb.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    
    // Default role is buyer
    const user = await usersDb.createUser({
      name,
      email,
      passwordHash,
      role: 'user',
    });

    await createSession({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
