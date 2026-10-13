// middleware.ts
// This runs before every page request and is the FIRST security layer.
// It checks if the user should be allowed to visit the page.
// NOTE: Middleware is never enough on its own – API routes and page layouts
//       also check the session independently.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from './lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  const isDashboard = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Rule 1: logged-out visitor tries to open /admin/* or /dashboard/*
  // → redirect to login with a callbackUrl so they land where they wanted after logging in
  if (!session && (isDashboard || isAdminRoute)) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url));
  }

  // Rule 2: logged-in user (any role) opens /login or /signup
  // → they're already logged in, send them to their dashboard
  if (session && isAuthPage) {
    const dest = session.role === 'admin' ? '/admin' : '/';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Rule 3: logged-in user with role "user" tries to open /admin/*
  // → show a friendly 403 page (not a generic redirect to login)
  if (session && isAdminRoute && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // All good – let the request through
  const response = NextResponse.next();

  // Tell the browser not to cache protected pages
  // so pressing Back after logout doesn't show old content
  if (isDashboard || isAdminRoute) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
}

export const config = {
  // Run middleware on these paths; skip static assets automatically
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
