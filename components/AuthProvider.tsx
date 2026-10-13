'use client';

// AuthProvider.tsx
// This is a "wrapper" component placed once in the root layout.
// It runs on the browser and keeps the auth store in sync with the real session.
// It checks the session:
//   1. When the page first loads
//   2. Every time the user switches to a different tab and comes back
//   3. Every time the URL changes (so logging in/out always feels instant)

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthProvider({
  // Optional: pass the server-rendered session so there is no flicker on first load
  initialUser,
}: {
  initialUser?: { id: string; name: string; email: string; role: string; avatar?: string } | null;
}) {
  const { refresh, status } = useAuthStore();
  const pathname = usePathname();
  const initialized = useRef(false);

  // On very first mount, seed the store with what the server already knows
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (initialUser) {
        // We already have the session from the server – set it directly to avoid a flicker
        useAuthStore.setState({
          status: 'authenticated',
          role: initialUser.role as any,
          user: initialUser as any,
        });
      } else {
        // No server session, but still check just in case
        refresh();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-check when navigating between pages (catches post-login/logout redirects)
  useEffect(() => {
    if (initialized.current) {
      refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Re-check when user switches back to this browser tab
  useEffect(() => {
    const handleFocus = () => refresh();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This component renders nothing – it just manages store state in the background
  return null;
}
