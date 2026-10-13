'use client';

// AuthForm.tsx
// Login and signup form.
// After login: admin goes to /admin, user goes to /dashboard (or the callbackUrl).
// callbackUrl is validated: must be a relative path starting with "/" and NOT "//" (blocks open redirects).
// Never trusts a role from the browser; always reads from the server response.

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';

// Only allow relative URLs like /dashboard or /properties/abc
// Block anything like // or https://evil.com
function getSafeCallbackUrl(raw: string | null, role: string): string {
  if (!raw) return role === 'admin' ? '/admin' : '/dashboard';
  // Must start with / but NOT with //
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    // Admins should not be forcibly sent to /admin via callbackUrl if they're a regular user
    // and regular users should never be sent to /admin
    if (raw.startsWith('/admin') && role !== 'admin') {
      return '/dashboard';
    }
    return raw;
  }
  return role === 'admin' ? '/admin' : '/dashboard';
}

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get('callbackUrl');

  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const { refresh } = useAuthStore();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((event.nativeEvent as SubmitEvent & { isComposing?: boolean }).isComposing) return;
    setPending(true);
    setError('');

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Only send what the form needs; never send role
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setError(result.error || "We couldn't complete that request. Check your details and try again.");
      } else {
        // Refresh the store so navbar updates instantly
        await refresh();
        // Redirect based on the REAL server-confirmed role, not anything from the browser
        const serverRole: string = result.role ?? 'user';
        const destination = getSafeCallbackUrl(rawCallback, serverRole);
        router.push(destination);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-line bg-canvas p-8 sm:p-10 shadow-lg">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <p className="eyebrow">Client & Member Access</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink">
            {mode === 'login' ? 'Welcome back.' : 'Join PV Property Finder.'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            {mode === 'login'
              ? 'Access your saved properties, active offers, and valuation reports.'
              : 'Create an account to save favorite homes and receive private MLS alerts.'}
          </p>
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Full Name</label>
            <input name="name" required placeholder="e.g. Maria Gonzalez"
              className="w-full rounded-xl border border-line bg-canvas p-3.5 text-xs text-ink placeholder:text-muted outline-none focus:border-clay focus:bg-canvas transition"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Email Address</label>
          <input name="email" type="email" required placeholder="maria@example.com"
            className="w-full rounded-xl border border-line bg-canvas p-3.5 text-xs text-ink placeholder:text-muted outline-none focus:border-clay focus:bg-canvas transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Password</label>
          <input name="password" type="password" minLength={8} required placeholder="••••••••"
            className="w-full rounded-xl border border-line bg-canvas p-3.5 text-xs text-ink placeholder:text-muted outline-none focus:border-clay focus:bg-canvas transition"
          />
        </div>

        {error && <p className="text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-3 rounded-xl">{error}</p>}

        <button disabled={pending} className="btn-primary py-3 text-xs tracking-wider">
          {pending ? 'Please wait…' : mode === 'login' ? 'Sign in to Account' : 'Create Member Account'}
        </button>

        <p className="text-center text-xs text-muted">
          {mode === 'login' ? "Don't have an account yet? " : 'Already registered? '}
          <Link className="font-bold text-clay underline underline-offset-4 hover:text-ink transition"
            href={mode === 'login' ? '/signup' : '/login'}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </Link>
        </p>
      </form>
    </div>
  );
}
