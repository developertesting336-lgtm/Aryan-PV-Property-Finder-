'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, DollarSign, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface Neighborhood {
  id: string;
  name: string;
  description: string;
  averagePriceUsd: number;
  vibe: string;
  highlight: string;
  imageUrl: string;
}

const FALLBACK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'zona-romantica',
    name: 'Zona Romántica',
    description: 'The historic, beating heart of Puerto Vallarta. Cobblestone streets lined with bougainvillea, world-class dining, bustling cafes, and direct access to Los Muertos Beach and the iconic sail pier.',
    averagePriceUsd: 450000,
    vibe: 'Walkable, Vibrant & Culinary',
    highlight: 'Los Muertos Pier, Basilio Badillo Restaurant Row, vibrant beach clubs.',
    imageUrl: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'marina-vallarta',
    name: 'Marina Vallarta',
    description: 'A nautical haven of tranquility featuring a 500-slip world-class yacht harbor, an 18-hole championship golf course, top international private schools, and a scenic perimeter boardwalk.',
    averagePriceUsd: 590000,
    vibe: 'Yachting, Golf & Family Peaceful',
    highlight: '500-slip Marina boardwalk, lighthouse restaurant, golf club.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'conchas-chinas',
    name: 'Conchas Chinas',
    description: 'Often referred to as the "Beverly Hills of Puerto Vallarta." Dramatically situated where the Sierra Madre mountains plunge directly into turquoise Pacific tidal pools.',
    averagePriceUsd: 1250000,
    vibe: 'Ultra-Luxury, Secluded & Cliffside',
    highlight: 'Turquoise private coves, unobstructed Pacific sunsets, multi-million dollar estates.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'versalles',
    name: 'Versalles',
    description: 'The premier culinary epicenter of Puerto Vallarta. A thriving neighborhood packed with micro-roasters, French bakeries, gourmet taco stands, and high rental demand.',
    averagePriceUsd: 320000,
    vibe: 'Foodie Capital & Digital Nomad Hub',
    highlight: 'Award-winning gastronomy, high rental cap rate, authentic community.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'amapas',
    name: 'Amapas',
    description: 'Elevated just above Zona Romántica, offering bird’s-eye views of Banderas Bay while remaining within walking distance of Old Town beaches and nightlife.',
    averagePriceUsd: 540000,
    vibe: 'Panoramic Views & Hillside Privacy',
    highlight: 'Sweeping bay panoramas, lush jungle canopy, quick beach descent.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: '5-de-diciembre',
    name: '5 de Diciembre',
    description: 'Traditional Mexican charm meeting coastal bohemian energy. Steeper cobblestones provide breathtaking sunsets, while Playa Camarones offers relaxed beachfront seafood dining.',
    averagePriceUsd: 380000,
    vibe: 'Authentic Charm, Beach & High Yields',
    highlight: 'Playa Camarones, Mercado Municipal, panoramic sunset lookouts.',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function NeighborhoodsPage() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(FALLBACK_NEIGHBORHOODS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await api.getNeighborhoods();
        if (data && !error && data.length > 0) {
          setNeighborhoods(data);
        }
      } catch (err) {
        console.warn('Using local fallback for neighborhoods', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-canvas py-10 sm:py-14 text-ink">
      <div className="container-wide">
        {/* Header Banner */}
        <div className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/80 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-clay shadow-sm">
            <Compass className="size-3.5 text-clay" />
            <span>Puerto Vallarta Zone Guide</span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink">
            Explore PV Neighborhoods
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
            Every neighborhood in Puerto Vallarta has its own unique lifestyle, price profile, and character. Discover where you feel most at home along Banderas Bay.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-sand/60 border border-line" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {neighborhoods.map((n) => (
              <div
                key={n.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-canvas shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                  <img
                    src={n.imageUrl}
                    alt={n.name}
                    className="photo-zoom h-full w-full object-cover"
                  />
                  <div className="absolute left-3.5 top-3.5 rounded-full border border-line/70 bg-canvas/90 px-3 py-1 text-[11px] font-bold text-ink shadow-sm backdrop-blur-md">
                    Avg ${n.averagePriceUsd.toLocaleString()} USD
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-sand/80 border border-line px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-clay">
                      {n.vibe}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-ink group-hover:text-clay transition-colors">
                    {n.name}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted flex-1">
                    {n.description}
                  </p>

                  <div className="mt-5 border-t border-line pt-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted">
                      Zone Highlight
                    </div>
                    <div className="mt-1 text-xs font-semibold text-ink">
                      {n.highlight}
                    </div>
                  </div>

                  <div className="mt-6 pt-2">
                    <Link
                      href={`/properties?neighborhood=${encodeURIComponent(n.name.toLowerCase())}`}
                      className="btn-primary w-full py-2.5 text-xs tracking-wider"
                    >
                      <span>Explore {n.name} Listings</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
