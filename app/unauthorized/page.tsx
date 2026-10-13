// app/unauthorized/page.tsx
// Shown when a logged-in user (not admin) tries to open /admin

import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <ShieldX className="size-16 text-clay mb-6" />
      <h1 className="font-display text-4xl font-bold text-ink">Access Restricted</h1>
      <p className="mt-3 max-w-sm text-sm text-muted leading-relaxed">
        You are logged in, but your account does not have admin privileges to view this page.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary text-xs px-5 py-2.5">Go Home</Link>
        <Link href="/login" className="btn-outline border-line text-muted hover:text-ink text-xs px-5 py-2.5">
          Log in as a different user
        </Link>
      </div>
    </main>
  );
}
