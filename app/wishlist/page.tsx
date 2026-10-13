'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { api } from '@/lib/api';

export default function WishlistPage() {
  const { favorites } = useFavoritesStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await api.getProperties();
        if (data && !error) {
          // Filter only favorites
          const savedProperties = data.filter((p: any) => favorites.includes(p.id));
          setProperties(savedProperties);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-canvas px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-bold text-clay hover:underline mb-8">
          <ArrowLeft className="size-4" /> Back to Properties
        </Link>
        
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">Your Wishlist</h1>
            <p className="mt-2 text-muted text-sm sm:text-base">Properties you've saved to your shortlist.</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-sm dark:bg-rose-500/20">
            <Heart className="size-6 fill-rose-500" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-clay border-t-transparent"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-line bg-canvas p-12 text-center shadow-sm">
            <Heart className="mx-auto size-12 text-muted/30" />
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">No saved properties yet</h3>
            <p className="mt-2 text-muted">Browse our listings and click the heart icon to save them here.</p>
            <Link href="/properties" className="btn-primary mt-6 inline-flex px-6 py-3">
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
