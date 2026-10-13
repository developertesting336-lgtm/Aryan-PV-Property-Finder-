'use client';

// useAuthStore.ts
// This file keeps track of who is logged in.
// It reads the real session from /api/auth/me and never stores role in localStorage.
// Status values:
//   "loading"         – we don't know yet (page just opened)
//   "authenticated"   – user is logged in
//   "unauthenticated" – no session, user is a guest

import { create } from 'zustand';

export type UserRole = 'guest' | 'user' | 'admin';
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  status: AuthStatus;
  role: UserRole;
  user: UserProfile | null;
  // Call this to (re)load the session from the server
  refresh: () => Promise<void>;
  // Call this to log out: clears cookie on server + resets state
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  role: 'guest',
  user: null,

  refresh: async () => {
    // Ask the server "who is logged in right now?"
    try {
      const res = await fetch('/api/auth/me', {
        // Never use a cached response – always get fresh data
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({
            status: 'authenticated',
            role: data.user.role as UserRole,
            user: data.user,
          });
        } else {
          set({ status: 'unauthenticated', role: 'guest', user: null });
        }
      } else {
        set({ status: 'unauthenticated', role: 'guest', user: null });
      }
    } catch {
      set({ status: 'unauthenticated', role: 'guest', user: null });
    }
  },

  logout: async () => {
    // Tell the server to delete the cookie
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Even if the request fails, clear the store
    }
    set({ status: 'unauthenticated', role: 'guest', user: null });
  },
}));
