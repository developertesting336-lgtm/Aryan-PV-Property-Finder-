import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function NotAuthorizedPage() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 mb-6">
        <ShieldAlert className="h-10 w-10" />
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight text-ink mb-4">
        Access Restricted
      </h1>
      <p className="text-muted max-w-md mb-8">
        You do not have the required permissions to view this page. If you believe this is an error, please contact support.
      </p>
      <Link href="/" className="btn-primary py-3 px-6 text-sm tracking-wider flex items-center gap-2">
        Return Home
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
