'use client';

import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Waves, Sparkles, MapPin, DollarSign, Home } from 'lucide-react';
import { useFilterStore } from '../stores/useFilterStore';

export default function FilterBar() {
  const {
    minPrice,
    maxPrice,
    neighborhood,
    propertyType,
    bedrooms,
    oceanView,
    searchQuery,
    setMinPrice,
    setMaxPrice,
    setNeighborhood,
    setPropertyType,
    setBedrooms,
    setOceanView,
    setSearchQuery,
    applyPreset,
    resetFilters,
  } = useFilterStore();

  const neighborhoods = [
    'All',
    'Zona Romántica',
    'Marina Vallarta',
    'Conchas Chinas',
    'Versalles',
    'Amapas',
    'Fluvial Vallarta',
    '5 de Diciembre',
  ];

  const types = ['All', 'Condo', 'Villa', 'Penthouse', 'Studio'];

  return (
    <div className="rounded-3xl border border-line bg-canvas/90 p-6 shadow-sm backdrop-blur-md">
      {/* Top Presets Row */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
          <Sparkles className="h-3.5 w-3.5 text-clay" />
          <span>Curated Price Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('starter')}
            className="rounded-full border border-line bg-sand/60 px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-clay hover:bg-clay/10 hover:text-clay"
          >
            🏝️ Under $350K Starter
          </button>
          <button
            onClick={() => applyPreset('beachfront500k')}
            className="rounded-full border border-line bg-sand/60 px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-clay hover:bg-clay/10 hover:text-clay"
          >
            🌊 $500K Beach Condo
          </button>
          <button
            onClick={() => applyPreset('luxuryVilla')}
            className="rounded-full border border-line bg-sand/60 px-3.5 py-1.5 text-xs font-semibold text-ink transition hover:border-clay hover:bg-clay/10 hover:text-clay"
          >
            👑 $1M+ Luxury Villa
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-clay hover:text-clay"
            title="Reset all filters"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Filter Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search by Keywords */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
            Search Keyword
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Villa, Conchas Chinas, pool..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-3.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
            />
          </div>
        </div>

        {/* Neighborhood Select */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
            Neighborhood / Zone
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-clay" />
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full appearance-none rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-8 text-xs font-medium text-ink transition focus:border-clay focus:bg-canvas focus:outline-none"
            >
              {neighborhoods.map((n) => (
                <option key={n} value={n.toLowerCase()}>
                  {n === 'All' ? 'All Banderas Bay Zones' : n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type Select */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
            Property Category
          </label>
          <div className="relative">
            <Home className="absolute left-3.5 top-3 h-4 w-4 text-clay" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full appearance-none rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-8 text-xs font-medium text-ink transition focus:border-clay focus:bg-canvas focus:outline-none"
            >
              {types.map((t) => (
                <option key={t} value={t.toLowerCase()}>
                  {t === 'All' ? 'All Types (Condo, Villa...)' : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bedrooms Min */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
            Minimum Bedrooms
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((beds) => (
              <button
                key={beds}
                type="button"
                onClick={() => setBedrooms(beds)}
                className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                  bedrooms === beds
                    ? 'border-line bg-canvas text-ink border border-line shadow-sm'
                    : 'border-line bg-canvas text-ink hover:border-clay hover:bg-sand/70'
                }`}
              >
                {beds === 0 ? 'Any' : `${beds}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Price Slider & Ocean View Checkbox */}
      <div className="mt-5 flex flex-col justify-between gap-4 border-t border-line pt-4 md:flex-row md:items-center">
        {/* Price Slider */}
        <div className="flex-1 max-w-xl">
          <div className="mb-2 flex items-center justify-between text-xs font-bold">
            <span className="uppercase tracking-wider text-muted">Price Range (USD)</span>
            <span className="font-display text-base text-clay">
              ${minPrice.toLocaleString()} &ndash; ${maxPrice >= 2000000 ? '2,000,000+' : maxPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-muted">$200K</span>
            <input
              type="range"
              min={200000}
              max={2000000}
              step={25000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="h-2 w-full appearance-none rounded-lg bg-sand accent-clay cursor-pointer"
            />
            <span className="text-[11px] font-bold text-muted">$2.0M+</span>
          </div>
        </div>

        {/* Ocean View Toggle */}
        <div className="flex items-center gap-3 pt-1">
          <label className="group flex cursor-pointer select-none items-center gap-2.5 rounded-xl border border-line bg-sand/40 px-4 py-2.5 transition hover:border-clay hover:bg-sand/70">
            <input
              type="checkbox"
              checked={Boolean(oceanView)}
              onChange={(e) => setOceanView(e.target.checked)}
              className="size-4 rounded border-line text-clay accent-clay"
            />
            <Waves className="size-4 text-clay" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Ocean View Only
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
