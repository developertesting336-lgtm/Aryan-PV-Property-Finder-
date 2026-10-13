// app/admin/leads/page.tsx
// Table of all leads. Admin-only (enforced by layout.tsx on server).

import { MessageSquare, Clock, Phone, Mail } from 'lucide-react';

// Demo data – replace with real DB query later
const DEMO_LEADS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 604 555 0123', propertyTitle: 'Oceanfront Penthouse', message: 'Interested in a weekend viewing', status: 'new', source: 'inquiry', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Carlos Méndez', email: 'carlos@mx.com', phone: '+52 322 100 0001', propertyTitle: 'Marina View Condo', message: 'Looking for 3-bed with sea view', status: 'contacted', source: 'quiz', createdAt: '2024-01-14T14:00:00Z' },
  { id: '3', name: 'Emily Chen', email: 'emily@ca.com', phone: '+1 416 555 0199', propertyTitle: 'Villa Amapas', message: 'Budget up to $600k USD', status: 'viewing', source: 'valuation', createdAt: '2024-01-13T09:00:00Z' },
  { id: '4', name: 'James Wilson', email: 'james@uk.com', phone: '+44 20 7946 0001', propertyTitle: 'Beachfront Studio', message: 'Relocating from London', status: 'new', source: 'inquiry', createdAt: '2024-01-12T16:45:00Z' },
  { id: '5', name: 'Mia Santos', email: 'mia@br.com', phone: '+55 11 9999 0000', propertyTitle: 'Luxury Penthouse', message: 'Ready to make an offer this month', status: 'offer_pending', source: 'inquiry', createdAt: '2024-01-11T11:00:00Z' },
];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  new:           { label: 'New',           className: 'bg-blue-100 text-blue-700' },
  contacted:     { label: 'Contacted',     className: 'bg-amber-100 text-amber-700' },
  viewing:       { label: 'Viewing',       className: 'bg-purple-100 text-purple-700' },
  offer_pending: { label: 'Offer Pending', className: 'bg-orange-100 text-orange-700' },
  closed:        { label: 'Closed',        className: 'bg-emerald-100 text-emerald-700' },
};

export default function AdminLeadsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Leads</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Leads</h1>
      </header>

      <main className="px-6 py-6 lg:px-8">
        <div className="overflow-x-auto rounded-2xl border border-line bg-canvas shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-sand/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 hidden md:table-cell">Property</th>
                <th className="px-4 py-3 hidden lg:table-cell">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {DEMO_LEADS.map((lead) => {
                const status = STATUS_LABELS[lead.status] ?? { label: lead.status, className: 'bg-sand text-muted' };
                return (
                  <tr key={lead.id} className="hover:bg-sand/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-ink">{lead.name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        <Mail className="size-3" /> {lead.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Phone className="size-3" /> {lead.phone}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-ink">{lead.propertyTitle}</span>
                      <p className="text-xs text-muted capitalize">{lead.source}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell max-w-xs">
                      <p className="line-clamp-2 text-xs text-muted">{lead.message}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${status.className}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock className="size-3" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
