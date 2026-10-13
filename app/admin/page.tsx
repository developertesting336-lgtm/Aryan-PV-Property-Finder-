// app/admin/page.tsx
// Admin dashboard overview.
// Shows key stats, recent leads, and quick-action buttons.
// All data comes from the server (no client fetching needed here).

import Link from 'next/link';
import { Building2, Users, MessageSquare, DollarSign, TrendingUp, Plus, Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { usersDb } from '@/lib/users';

export default async function AdminDashboardPage() {
  let properties = [];
  let leads = [];
  let offers = [];
  let totalUsers = 0;

  try {
    if (process.env.DATABASE_URL) {
      properties = await prisma.property.findMany();
      leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 4 });
      offers = await prisma.offer.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
      const users = await usersDb.getAllUsers();
      totalUsers = users.length;
    }
  } catch (err) {
    console.error('Failed to fetch from DB:', err);
  }

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p: any) => p.featured).length;

  const stats = [
    { label: 'Total Properties', value: totalProperties, icon: Building2, color: 'text-ink', bg: 'bg-canvas/10' },
    { label: 'Featured Listings', value: availableProperties, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Recent Leads', value: leads.length, icon: MessageSquare, color: 'text-clay', bg: 'bg-clay/10' },
    { label: 'Pending Offers', value: offers.filter((o: any) => o.status === 'pending').length, icon: DollarSign, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-sand text-ink',
    contacted: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
    viewing: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300',
    pending: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
    accepted: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    countered: 'bg-sand text-ink',
    rejected: 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300',
  };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin Panel</p>
            <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Dashboard</h1>
          </div>
          <Link href="/admin/properties/new" className="btn-primary text-xs px-4 py-2.5 gap-1.5">
            <Plus className="size-3.5" /> Add Property
          </Link>
        </div>
      </header>

      <main className="px-6 py-8 lg:px-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <div className={`mb-3 inline-flex rounded-xl p-2 ${stat.bg}`}>
                  <Icon className={`size-4 ${stat.color}`} />
                </div>
                <p className="font-display text-2xl font-bold text-ink">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Two-column grid: recent leads + recent offers */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Leads */}
          <div className="rounded-2xl border border-line bg-canvas shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-bold text-ink">Recent Leads</h2>
              <Link href="/admin/leads" className="flex items-center gap-1.5 text-xs font-bold text-clay hover:text-ink transition">
                View all <Eye className="size-3" />
              </Link>
            </div>
            <div className="divide-y divide-line">
              {leads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-ink">{lead.name}</p>
                    <p className="text-xs text-muted">{lead.propertyTitle}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusColors[lead.status] ?? 'bg-sand text-muted'}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Offers */}
          <div className="rounded-2xl border border-line bg-canvas shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-bold text-ink">Recent Offers</h2>
              <Link href="/admin/offers" className="flex items-center gap-1.5 text-xs font-bold text-clay hover:text-ink transition">
                View all <Eye className="size-3" />
              </Link>
            </div>
            <div className="divide-y divide-line">
              {offers.map((offer: any) => (
                <div key={offer.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-ink">{offer.buyerName}</p>
                    <p className="text-xs text-muted">{offer.propertyTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-clay">${offer.amount.toLocaleString()}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColors[offer.status] ?? 'bg-sand text-muted'}`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/properties/new" className="btn-primary text-xs px-4 py-2.5 gap-1.5">
            <Plus className="size-3.5" /> Add Property
          </Link>
          <Link href="/admin/properties" className="btn-outline border-line text-ink hover:bg-sand text-xs px-4 py-2.5">
            Manage Properties
          </Link>
          <Link href="/admin/leads" className="btn-outline border-line text-ink hover:bg-sand text-xs px-4 py-2.5">
            View All Leads
          </Link>
          <Link href="/admin/users" className="btn-outline border-line text-ink hover:bg-sand text-xs px-4 py-2.5">
            Manage Users
          </Link>
        </div>
      </main>
    </div>
  );
}
