// app/admin/offers/page.tsx
// Table of all purchase offers. Admin-only.

import { DollarSign, Clock } from 'lucide-react';

const DEMO_OFFERS = [
  { id: '1', buyerName: 'Robert Park', buyerEmail: 'robert@example.com', propertyTitle: 'Oceanfront Penthouse', amount: 485000, financing: 'Cash', status: 'pending', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', buyerName: 'Ana García', buyerEmail: 'ana@mx.com', propertyTitle: 'Marina View Condo', amount: 285000, financing: 'Mortgage', status: 'accepted', createdAt: '2024-01-14T15:00:00Z' },
  { id: '3', buyerName: 'Tom Harris', buyerEmail: 'tom@uk.com', propertyTitle: 'Cliffside Villa', amount: 620000, financing: 'Cash', status: 'countered', createdAt: '2024-01-13T09:30:00Z' },
  { id: '4', buyerName: 'Lisa Wang', buyerEmail: 'lisa@us.com', propertyTitle: 'Beachfront Studio', amount: 180000, financing: 'Mortgage', status: 'rejected', createdAt: '2024-01-12T13:00:00Z' },
];

const STATUS = {
  pending:   'bg-amber-100 text-amber-700',
  accepted:  'bg-emerald-100 text-emerald-700',
  countered: 'bg-blue-100 text-blue-700',
  rejected:  'bg-rose-100 text-rose-700',
};

export default function AdminOffersPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Offers</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Purchase Offers</h1>
      </header>
      <main className="px-6 py-6 lg:px-8">
        <div className="overflow-x-auto rounded-2xl border border-line bg-canvas shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-sand/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3 hidden md:table-cell">Property</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 hidden sm:table-cell">Financing</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {DEMO_OFFERS.map((offer) => (
                <tr key={offer.id} className="hover:bg-sand/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-ink">{offer.buyerName}</p>
                    <p className="text-xs text-muted">{offer.buyerEmail}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-sm text-ink">{offer.propertyTitle}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 font-bold text-clay">
                      <DollarSign className="size-3.5" />{offer.amount.toLocaleString()} USD
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-muted">{offer.financing}</td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${STATUS[offer.status as keyof typeof STATUS] ?? 'bg-sand text-muted'}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="size-3" />{new Date(offer.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
