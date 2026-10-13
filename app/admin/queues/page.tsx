// app/admin/queues/page.tsx
// Shows BullMQ queue stats (waiting, active, completed, failed).
// Calls a server-side API endpoint for queue data.

import { Activity, CheckCircle2, AlertTriangle, Clock, Loader2 } from 'lucide-react';

// Demo queue data – replace with real BullMQ API call later
const QUEUES = [
  {
    name: 'lead-notifications',
    description: 'Sends WhatsApp / email alerts when a new lead comes in',
    waiting: 2, active: 0, completed: 148, failed: 3,
  },
  {
    name: 'valuation-reports',
    description: 'Generates PDF valuation reports for property owners',
    waiting: 0, active: 1, completed: 42, failed: 1,
  },
];

export default function AdminQueuesPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Queues</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Background Queues</h1>
      </header>
      <main className="px-6 py-6 lg:px-8 space-y-5">
        {QUEUES.map((q) => (
          <div key={q.name} className="rounded-2xl border border-line bg-canvas p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <Activity className="size-5 text-ink" />
              <div>
                <p className="font-semibold text-ink font-mono text-sm">{q.name}</p>
                <p className="text-xs text-muted">{q.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Waiting', value: q.waiting, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                { label: 'Active', value: q.active, icon: Loader2, color: 'text-blue-600 bg-blue-50' },
                { label: 'Completed', value: q.completed, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Failed', value: q.failed, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className={`rounded-xl p-3 ${color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  </div>
                  <p className="font-display text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
