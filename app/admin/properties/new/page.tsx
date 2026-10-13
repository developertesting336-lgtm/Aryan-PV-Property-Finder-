'use client';

// app/admin/properties/new/page.tsx
// Form to add a new property. Calls POST /api/properties (admin-only).
// Uses react-hook-form + client-side validation.
// Note: we use simple client validation here; the API validates again on the server.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Star } from 'lucide-react';

interface ImageEntry { url: string; isPrimary: boolean; }

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sqft, setSqft] = useState('');
  const [propertyType, setPropertyType] = useState('Condo');
  const [neighborhood, setNeighborhood] = useState('');
  const [oceanView, setOceanView] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentWhatsapp, setAgentWhatsapp] = useState('');
  const [images, setImages] = useState<ImageEntry[]>([{ url: '', isPrimary: true }]);

  const handleTitleChange = (v: string) => { setTitle(v); setSlug(slugify(v)); };
  const addImage = () => setImages(prev => [...prev, { url: '', isPrimary: false }]);
  const removeImage = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i));
  const updateImage = (i: number, url: string) => setImages(prev => prev.map((img, idx) => idx === i ? { ...img, url } : img));
  const setPrimary = (i: number) => setImages(prev => prev.map((img, idx) => ({ ...img, isPrimary: idx === i })));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !priceUsd || !bedrooms || !neighborhood) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, slug, description,
          priceUsd: Number(priceUsd),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          sqft: Number(sqft),
          propertyType, neighborhood, oceanView, featured,
          media: images.filter(img => img.url.trim()),
          agent: { name: agentName, phone: agentPhone, whatsapp: agentWhatsapp },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create property.');
      } else {
        router.push('/admin/properties');
        router.refresh();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-line bg-sand/30 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted outline-none focus:border-clay focus:bg-canvas transition";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-muted mb-1.5";
  const toggleClass = (on: boolean) => `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-canvas' : 'bg-line'}`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/properties" className="rounded-xl border border-line p-2 hover:bg-sand transition">
            <ArrowLeft className="size-4 text-muted" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Properties</p>
            <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Add New Property</h1>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
          {error && <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-4 text-sm font-medium text-rose-700 dark:text-rose-300">{error}</div>}

          {/* Basic Info */}
          <div className="rounded-2xl border border-line bg-canvas p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Title *</label>
                <input value={title} onChange={e => handleTitleChange(e.target.value)} required className={inputClass} placeholder="e.g. Oceanfront Luxury Penthouse" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Slug (auto-generated)</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} placeholder="oceanfront-luxury-penthouse" />
                <p className="mt-1 text-[11px] text-muted">URL: /properties/{slug || '…'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className={inputClass} placeholder="Describe the property…" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-line bg-canvas p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">Property Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Price (USD) *</label>
                <input type="number" value={priceUsd} onChange={e => setPriceUsd(e.target.value)} required className={inputClass} placeholder="450000" min="0" />
              </div>
              <div>
                <label className={labelClass}>Bedrooms *</label>
                <input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} required className={inputClass} placeholder="3" min="0" />
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} className={inputClass} placeholder="2" min="0" />
              </div>
              <div>
                <label className={labelClass}>Sqft</label>
                <input type="number" value={sqft} onChange={e => setSqft(e.target.value)} className={inputClass} placeholder="1800" min="0" />
              </div>
              <div>
                <label className={labelClass}>Property Type</label>
                <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className={inputClass}>
                  {['Condo', 'Villa', 'Penthouse', 'Studio', 'House', 'Land'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Neighborhood *</label>
                <input value={neighborhood} onChange={e => setNeighborhood(e.target.value)} required className={inputClass} placeholder="Zona Romántica" />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex cursor-pointer items-center gap-3">
                <button type="button" onClick={() => setOceanView(v => !v)} className={toggleClass(oceanView)}>
                  <span className={`inline-block size-4 rounded-full bg-canvas shadow transition-transform ${oceanView ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-medium text-ink">Ocean View</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <button type="button" onClick={() => setFeatured(v => !v)} className={toggleClass(featured)}>
                  <span className={`inline-block size-4 rounded-full bg-canvas shadow transition-transform ${featured ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-medium text-ink">Featured Listing</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-2xl border border-line bg-canvas p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">Images</h2>
            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button type="button" onClick={() => setPrimary(i)} title="Set as primary"
                    className={`shrink-0 rounded-lg p-1.5 transition ${img.isPrimary ? 'text-amber-500' : 'text-muted hover:text-amber-400'}`}>
                    <Star className={`size-4 ${img.isPrimary ? 'fill-amber-400' : ''}`} />
                  </button>
                  <input value={img.url} onChange={e => updateImage(i, e.target.value)} placeholder="https://images.unsplash.com/…"
                    className="flex-1 rounded-xl border border-line bg-sand/30 px-3 py-2 text-xs text-ink placeholder:text-muted outline-none focus:border-clay transition" />
                  {img.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt="preview" className="size-10 rounded-lg object-cover shrink-0 border border-line" />
                  )}
                  <button type="button" onClick={() => removeImage(i)} className="shrink-0 rounded-lg p-1.5 text-muted hover:text-rose-600 transition">
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addImage} className="flex items-center gap-2 text-xs font-bold text-clay hover:text-ink transition">
              <Plus className="size-3.5" /> Add Image URL
            </button>
          </div>

          {/* Agent Info */}
          <div className="rounded-2xl border border-line bg-canvas p-6 shadow-sm space-y-4">
            <h2 className="font-display text-lg font-bold text-ink">Listing Agent</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Agent Name</label>
                <input value={agentName} onChange={e => setAgentName(e.target.value)} className={inputClass} placeholder="Alejandro Morales" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input value={agentPhone} onChange={e => setAgentPhone(e.target.value)} className={inputClass} placeholder="+52 322 100 2345" />
              </div>
              <div>
                <label className={labelClass}>WhatsApp</label>
                <input value={agentWhatsapp} onChange={e => setAgentWhatsapp(e.target.value)} className={inputClass} placeholder="523221002345" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pb-8">
            <Link href="/admin/properties" className="btn-outline border-line text-muted hover:text-ink text-sm px-5 py-2.5">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2.5">
              {saving ? 'Saving…' : 'Create Property'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
