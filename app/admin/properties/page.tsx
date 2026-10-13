'use client';

// app/admin/properties/page.tsx
// Lists all properties in a searchable, sortable table.
// Only reachable by admins (layout.tsx enforces this on the server).

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, ExternalLink, Eye, EyeOff, Star } from 'lucide-react';

interface Property {
  id: string; slug: string; title: string; neighborhood: string;
  priceUsd: number; bedrooms: number; propertyType: string;
  featured: boolean; oceanView: boolean;
  media?: Array<{ url: string; isPrimary?: boolean }>;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/properties').then(r => r.json()).then(data => {
      setProperties(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
    p.propertyType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== deleteId));
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Properties</p>
            <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Properties</h1>
          </div>
          <Link href="/admin/properties/new" className="btn-primary text-xs px-4 py-2.5 gap-1.5">
            <Plus className="size-3.5" /> Add Property
          </Link>
        </div>
      </header>

      <main className="px-6 py-6 lg:px-8">
        {/* Search */}
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-2.5 max-w-md shadow-sm">
          <Search className="size-4 text-muted shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties…"
            className="w-full bg-transparent text-sm text-ink placeholder:text-muted outline-none"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-sand/60" />)}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line bg-canvas shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-sand/40 text-left text-[11px] font-bold uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Flags</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted">No properties found.</td></tr>
                ) : filtered.map((p) => {
                  const thumb = p.media?.find(m => m.isPrimary)?.url || p.media?.[0]?.url;
                  return (
                    <tr key={p.id} className="hover:bg-sand/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt={p.title} className="size-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="size-10 rounded-lg bg-sand flex items-center justify-center shrink-0">
                              <span className="text-[10px] text-muted">IMG</span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-ink line-clamp-1">{p.title}</p>
                            <p className="text-xs text-muted">{p.neighborhood}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold uppercase text-ink">{p.propertyType}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-clay">${p.priceUsd.toLocaleString()}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex gap-1.5">
                          {p.featured && <Star className="size-3.5 fill-amber-400 text-amber-400" title="Featured" />}
                          {p.oceanView && <Eye className="size-3.5 text-cyan-500" title="Ocean View" />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <a href={`/properties/${p.slug}`} target="_blank" rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-muted hover:bg-sand hover:text-ink transition" title="View on site">
                            <ExternalLink className="size-3.5" />
                          </a>
                          <Link href={`/admin/properties/${p.id}/edit`}
                            className="rounded-lg p-1.5 text-muted hover:bg-canvas/10 hover:text-ink transition" title="Edit">
                            <Edit2 className="size-3.5" />
                          </Link>
                          <button onClick={() => setDeleteId(p.id)}
                            className="rounded-lg p-1.5 text-muted hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition" title="Delete">
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Delete confirmation dialog */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-canvas p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-ink">Delete Property?</h3>
            <p className="mt-2 text-sm text-muted">This action cannot be undone. The property will be permanently removed.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline border-line text-muted flex-1 text-xs py-2.5">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700 disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
