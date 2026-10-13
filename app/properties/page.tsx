'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  RotateCcw,
  Building2,
  MapPin,
  Waves,
  ArrowRight,
} from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import PropertyCard, { PropertyData } from '@/components/PropertyCard';
import { useFilterStore } from '@/stores/useFilterStore';
import { api } from '@/lib/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'beds'>('featured');

  const {
    minPrice,
    maxPrice,
    neighborhood,
    propertyType,
    bedrooms,
    oceanView,
    searchQuery,
    resetFilters,
  } = useFilterStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await api.getProperties();
        if (data && !error && data.length > 0) {
          setProperties(data as any);
        }
      } catch (err) {
        console.warn('Using local store for properties', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter & sort
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Price
        if (p.priceUsd < minPrice || p.priceUsd > maxPrice) return false;
        // Neighborhood
        if (neighborhood !== 'all' && p.neighborhood.toLowerCase() !== neighborhood.toLowerCase()) {
          return false;
        }
        // Property Type
        if (propertyType !== 'all' && p.propertyType.toLowerCase() !== propertyType.toLowerCase()) {
          return false;
        }
        // Bedrooms
        if (bedrooms > 0 && p.bedrooms < bedrooms) return false;
        // Ocean View
        if (oceanView === true && !p.oceanView) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.title.toLowerCase().includes(q) ||
            p.neighborhood.toLowerCase().includes(q) ||
            p.propertyType.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUsd - b.priceUsd;
        if (sortBy === 'price-desc') return b.priceUsd - a.priceUsd;
        if (sortBy === 'beds') return b.bedrooms - a.bedrooms;
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [properties, minPrice, maxPrice, neighborhood, propertyType, bedrooms, oceanView, searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-canvas py-10 sm:py-14 text-ink">
      <div className="container-wide">
        {/* Header Banner */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/80 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-clay shadow-sm">
              <Sparkles className="size-3.5 text-clay" />
              <span>MLS Verified Coastal Properties</span>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink">
              Puerto Vallarta Real Estate
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
              Explore authentic oceanfront residences, modern turnkey condominiums, and private cliffside villas across Banderas Bay.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/quiz"
              className="btn-outline border-line bg-canvas text-ink hover:border-line hover:bg-sand/70 text-xs"
            >
              Take Budget Quiz
            </Link>
            <Link
              href="/3d-showcase"
              className="btn-primary text-xs"
            >
              3D Villa Experience
            </Link>
          </div>
        </div>

        {/* Filter Bar Component */}
        <div className="mb-8">
          <FilterBar />
        </div>

        {/* Results Counter & Controls */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-line pb-4">
          <div className="text-sm font-medium text-muted">
            Showing <span className="font-bold text-ink">{filteredProperties.length}</span> properties
            {neighborhood !== 'all' && (
              <span> in <strong className="text-clay capitalize">{neighborhood}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-muted">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-line bg-sand/40 px-3 py-1.5 font-bold text-ink focus:border-clay focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="beds">Most Bedrooms</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl border border-line bg-sand/40 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-canvas text-ink border border-line shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === 'list'
                    ? 'bg-canvas text-ink border border-line shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-sand/60 border border-line" />
            ))}
          </div>
        )}

        {/* Properties Content */}
        {!loading && filteredProperties.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col gap-6'
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProperties.length === 0 && (
          <div className="rounded-3xl border border-line bg-sand/30 py-16 text-center">
            <Building2 className="mx-auto size-12 text-muted" />
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">No properties match your criteria</h3>
            <p className="mt-2 text-sm text-muted max-w-md mx-auto">
              Try adjusting your price range, clearing neighborhood filters, or relaxing your bedroom requirement.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 btn-primary inline-flex items-center gap-2"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
