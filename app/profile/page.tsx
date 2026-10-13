'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Heart,
  TrendingUp,
  ShieldCheck,
  Phone,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useToastStore } from '@/stores/useToastStore';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyTitle?: string;
  message?: string;
  source: string;
  status: 'new' | 'contacted' | 'viewing' | 'offer_pending' | 'closed';
  agentAssignedName?: string;
  createdAt: string;
  activities: Array<{ action: string; timestamp: string; details?: string }>;
}

interface ValuationRequest {
  id: string;
  ownerName: string;
  email: string;
  estimatedValueMidUsd: number;
  estimatedValueLowUsd: number;
  estimatedValueHighUsd: number;
  pricePerSqftUsd: number;
  createdAt: string;
}

interface Offer {
  id: string;
  buyerName: string;
  email: string;
  phone: string;
  propertyTitle: string;
  offerAmountUsd: number;
  financingType: string;
  status: 'pending' | 'accepted' | 'countered' | 'rejected';
  notes?: string;
  counterNotes?: string;
}

export default function DashboardPage() {
  const { user, role, status } = useAuthStore();
  const { favorites } = useFavoritesStore();

  const [activeTab, setActiveTab] = useState<'leads' | 'contacts' | 'offers' | 'valuations' | 'infrastructure'>('leads');
  const [loading, setLoading] = useState(true);

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [valuations, setValuations] = useState<ValuationRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // Bloom filter interactive testing state
  const [bloomEmailInput, setBloomEmailInput] = useState('jparker@vancouver.ca');
  const [bloomUsernameInput, setBloomUsernameInput] = useState('alejandro');
  const [bloomPhoneInput, setBloomPhoneInput] = useState('+1 604 555 0192');
  const [bloomCheckResult, setBloomCheckResult] = useState<any>(null);
  const [bloomLoading, setBloomLoading] = useState(false);

  // Cache penetration simulation state
  const [penetrationTestResult, setPenetrationTestResult] = useState<any>(null);

  // BullMQ Worker queue simulator
  const [queueStats, setQueueStats] = useState<any>(null);
  const [triggerJobLoading, setTriggerJobLoading] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [leadsRes, valRes, offRes, contRes] = await Promise.all([
          api.getLeads(),
          api.getValuations(),
          api.getOffers(),
          api.getContacts(),
        ]);

        if (leadsRes.data) setLeads(leadsRes.data);
        if (valRes.data) setValuations(valRes.data);
        if (offRes.data) setOffers(offRes.data);
        if (contRes.data) setContacts(contRes.data);
      } catch (err) {
        console.warn('Dashboard using current state:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handleUpdateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const { data, error } = await api.updateLeadStatus(leadId, newStatus, 'Status updated via Agent CRM dashboard.');
      if (data && !error) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? data : l)));
        useToastStore.getState().addToast({
          type: 'success',
          title: 'Lead Updated',
          message: `Lead pipeline advanced to ${newStatus.replace('_', ' ').toUpperCase()}`,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOfferStatus = async (offerId: string, status: Offer['status']) => {
    try {
      const { data, error } = await api.updateOfferStatus(offerId, status);
      if (data && !error) {
        setOffers((prev) => prev.map((o) => (o.id === offerId ? data : o)));
        useToastStore.getState().addToast({
          type: 'success',
          title: 'Offer Updated',
          message: `Offer status transitioned to ${status.toUpperCase()}`,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-10 sm:py-14 text-ink">
      <div className="container-wide">
        {/* Top Header */}
        <div className="mb-8 rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="size-16 rounded-2xl object-cover ring-2 ring-clay/40" />
              ) : (
                <span className="flex size-16 items-center justify-center rounded-2xl bg-canvas border border-line text-2xl font-bold text-ink">
                  {user?.name?.charAt(0).toUpperCase() ?? '?'}
                </span>
              )}
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold text-ink">{user?.name ?? 'Welcome'}</h1>
                  <span className="rounded-full bg-sand border border-line px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-clay">
                    {role}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------- BUYER VIEW ----------------- */}
        {role === 'buyer' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted">
                  <span>Saved Favorites</span>
                  <Heart className="size-4 text-rose-500 fill-rose-500" />
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-ink">{favorites.length}</div>
                <p className="mt-1 text-xs text-muted">Properties saved to your shortlist</p>
              </div>

              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted">
                  <span>Submitted Offers</span>
                  <DollarSign className="size-4 text-emerald-600" />
                </div>
                <div className="mt-2 font-display text-3xl font-bold text-emerald-600">{offers.length}</div>
                <p className="mt-1 text-xs text-muted">Offers under review with listing agents</p>
              </div>

              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted">
                  <span>Assigned PV Advisor</span>
                  <MessageCircle className="size-4 text-clay" />
                </div>
                <div className="mt-2 font-display text-xl font-bold text-ink">Alejandro Morales</div>
                <a
                  href="https://wa.me/523221002345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-clay hover:underline"
                >
                  WhatsApp: +52 322 100 2345 <ArrowRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Buyer's Offers Section */}
            <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink mb-4">My Purchase Offers</h2>
              {offers.length === 0 ? (
                <div className="py-8 text-center text-xs sm:text-sm text-muted">
                  You have not submitted any formal offers yet.{' '}
                  <Link href="/properties" className="text-clay font-bold underline underline-offset-4">
                    Browse properties
                  </Link>{' '}
                  and click &ldquo;Make an Offer&rdquo;.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line text-muted">
                        <th className="pb-3 font-bold uppercase tracking-wider">Property</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Offer Amount</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Financing</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {offers.map((o) => (
                        <tr key={o.id} className="hover:bg-sand/30">
                          <td className="py-3.5 font-bold text-ink">{o.propertyTitle}</td>
                          <td className="py-3.5 font-bold text-clay font-display text-base">
                            ${o.offerAmountUsd.toLocaleString()} USD
                          </td>
                          <td className="py-3.5 uppercase text-muted font-semibold">{o.financingType}</td>
                          <td className="py-3.5">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                                o.status === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : o.status === 'countered'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-sand text-ink border border-line'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- AGENT & ADMIN VIEW ----------------- */}
        {(role === 'agent' || role === 'admin') && (
          <div className="space-y-8">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Active CRM Leads</span>
                <div className="mt-2 font-display text-3xl font-bold text-clay">{leads.length}</div>
                <span className="text-[11px] text-muted">Inbound inquiries & walkthroughs</span>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Unique Contacts</span>
                <div className="mt-2 font-display text-3xl font-bold text-ink">{contacts.length || 2}</div>
                <span className="text-[11px] text-emerald-700 font-semibold">Deduplicated by phone & email</span>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Purchase Offers</span>
                <div className="mt-2 font-display text-3xl font-bold text-emerald-600">{offers.length}</div>
                <span className="text-[11px] text-muted">Formal bids submitted</span>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Valuation Requests</span>
                <div className="mt-2 font-display text-3xl font-bold text-ink">{valuations.length}</div>
                <span className="text-[11px] text-muted">Seller appraisal inquiries</span>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex border-b border-line gap-2 overflow-x-auto pb-1">
              {[
                { id: 'leads', label: `CRM Leads (${leads.length})` },
                { id: 'contacts', label: `Deduplicated Contacts (${contacts.length || 2})` },
                { id: 'offers', label: `Offers Pipeline (${offers.length})` },
                { id: 'valuations', label: `Seller Valuations (${valuations.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-clay text-clay font-bold'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: LEADS PIPELINE */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="font-display text-2xl font-bold text-ink">Lead Management & Audit History</h2>
                  <span className="text-xs text-muted">
                    Shows lead-to-contact link, assigned agent, and activity logs
                  </span>
                </div>

                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-2xl border border-line bg-canvas p-5 sm:p-6 shadow-sm transition hover:border-clay/50"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-lg font-bold text-ink">{lead.name}</span>
                            <span className="rounded-full bg-sand px-2.5 py-0.5 text-[10px] font-bold text-muted uppercase">
                              via {lead.source}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                                lead.status === 'new'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : lead.status === 'contacted'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : lead.status === 'viewing'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                            <span>📧 {lead.email}</span>
                            <span>📞 {lead.phone}</span>
                            {lead.propertyTitle && (
                              <span className="text-clay font-semibold">
                                Listing: {lead.propertyTitle}
                              </span>
                            )}
                          </div>
                          {lead.message && (
                            <p className="mt-2 text-xs text-ink/80 bg-sand/40 p-3 rounded-xl border border-line">
                              &ldquo;{lead.message}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Status Switcher & WhatsApp CTA */}
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                            className="rounded-xl border border-line bg-sand/30 px-3 py-1.5 text-xs font-semibold text-ink focus:border-clay focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="viewing">Viewing Scheduled</option>
                            <option value="offer_pending">Offer Pending</option>
                            <option value="closed">Closed / Won</option>
                          </select>

                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${lead.name}! This is Alejandro Morales from PV Property Finder regarding your inquiry on ${lead.propertyTitle || 'Puerto Vallarta listings'}.`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                          >
                            <MessageCircle className="size-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Audit Activities list */}
                      {lead.activities?.length > 0 && (
                        <div className="mt-4 border-t border-line pt-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                            Activity Timeline
                          </span>
                          <div className="mt-1 space-y-1">
                            {lead.activities.map((act, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-[11px] text-muted"
                              >
                                <span className="size-1.5 rounded-full bg-clay" />
                                <span className="font-semibold text-ink">{act.action}</span>
                                <span className="text-muted">
                                  ({new Date(act.timestamp).toLocaleDateString()})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CONTACTS */}
            {activeTab === 'contacts' && (
              <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-display text-2xl font-bold text-ink">Deduplicated Contacts (Database Rule)</h2>
                  <p className="text-xs text-muted mt-1">
                    Normalized customer master records: 1 customer inquiring 3 times produces 1 contact row and 3 lead rows. Deduplicated by phone first, then email.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line text-muted">
                        <th className="pb-3 font-bold uppercase tracking-wider">Contact ID</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Name</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Email</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Phone</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">First Seen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {(contacts.length > 0 ? contacts : [
                        { id: 'contact-1', name: 'Jennifer Parker', email: 'jparker@vancouver.ca', phone: '+1 604 555 0192', createdAt: new Date().toISOString() },
                        { id: 'contact-2', name: 'Robert Vance', email: 'rvance@austintx.com', phone: '+1 512 555 4321', createdAt: new Date().toISOString() },
                      ]).map((c: any) => (
                        <tr key={c.id} className="hover:bg-sand/30">
                          <td className="py-3.5 font-mono text-clay font-bold">{c.id}</td>
                          <td className="py-3.5 font-bold text-ink">{c.name}</td>
                          <td className="py-3.5 text-muted">{c.email}</td>
                          <td className="py-3.5 text-muted">{c.phone}</td>
                          <td className="py-3.5 text-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: OFFERS */}
            {activeTab === 'offers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-bold text-ink">Purchase Offers Pipeline</h2>
                  <span className="text-xs text-muted">Accept, counter, or decline buyer offers</span>
                </div>

                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="rounded-2xl border border-line bg-canvas p-5 sm:p-6 shadow-sm"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-2xl font-bold text-clay">
                              ${offer.offerAmountUsd.toLocaleString()} USD
                            </span>
                            <span className="text-xs text-muted">on</span>
                            <span className="font-bold text-ink text-xs">
                              {offer.propertyTitle}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                            <span>Buyer: {offer.buyerName}</span>
                            <span>📧 {offer.email}</span>
                            <span>📞 {offer.phone}</span>
                            <span className="uppercase font-semibold">Method: {offer.financingType}</span>
                          </div>
                          {offer.notes && (
                            <p className="mt-2 text-xs text-ink/80 bg-sand/40 p-3 rounded-xl border border-line">
                              Terms: {offer.notes}
                            </p>
                          )}
                        </div>

                        {/* Status Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleUpdateOfferStatus(offer.id, 'accepted')}
                            className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-sm transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateOfferStatus(offer.id, 'countered')}
                            className="rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-500 shadow-sm transition"
                          >
                            Counter
                          </button>
                          <button
                            onClick={() => handleUpdateOfferStatus(offer.id, 'rejected')}
                            className="rounded-xl border border-line bg-sand/40 px-3.5 py-1.5 text-xs font-bold text-muted hover:bg-sand hover:text-ink transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: VALUATIONS */}
            {activeTab === 'valuations' && (
              <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-ink mb-4">Seller Valuation Inquiries</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line text-muted">
                        <th className="pb-3 font-bold uppercase tracking-wider">Owner</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Email</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Est. Market Value</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Est. $/sqft</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {valuations.map((v) => (
                        <tr key={v.id} className="hover:bg-sand/30">
                          <td className="py-3.5 font-bold text-ink">{v.ownerName}</td>
                          <td className="py-3.5 text-muted">{v.email}</td>
                          <td className="py-3.5 font-display text-base font-bold text-clay">
                            ${v.estimatedValueMidUsd?.toLocaleString()} USD
                          </td>
                          <td className="py-3.5 text-muted">${v.pricePerSqftUsd}/sqft</td>
                          <td className="py-3.5">
                            <a
                              href={`mailto:${v.email}?subject=Puerto%20Vallarta%20Listing%20Proposal`}
                              className="text-clay hover:underline font-bold"
                            >
                              Send CMA Proposal →
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ----------------- GUEST VIEW ----------------- */}
        {role === 'guest' && (
          <div className="rounded-3xl border border-line bg-canvas p-12 text-center shadow-sm">
            <Users className="mx-auto size-12 text-clay mb-3" />
            <h2 className="font-display text-3xl font-bold text-ink">Viewing as Guest</h2>
            <p className="mt-2 text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
              Use the role switcher above to preview either the <strong className="text-ink">Buyer Dashboard</strong> (saved homes & offers) or the <strong className="text-ink">Agent / Admin CRM</strong> (pipeline, contacts, and status updates).
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setRole('buyer')}
                className="btn-primary text-xs"
              >
                Switch to Buyer Role
              </button>
              <button
                onClick={() => setRole('agent')}
                className="btn-outline border-line text-muted hover:text-ink text-xs"
              >
                Switch to Agent CRM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
