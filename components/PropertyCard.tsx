'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Waves, Bed, Bath, Maximize2, MessageCircle, Send, MapPin, Sparkles } from 'lucide-react';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import LeadModal from './LeadModal';

export interface PropertyData {
  id: string;
  title: string;
  slug: string;
  priceUsd: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  neighborhood: string;
  oceanView: boolean;
  featured?: boolean;
  images: Array<{ url: string; caption: string; isPrimary?: boolean }>;
  agent?: {
    name: string;
    phone: string;
    whatsapp: string;
  };
}

export default function PropertyCard({ property }: { property: PropertyData }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const favorited = isFavorite(property.id);

  const primaryImage =
    property.media?.find((m) => m.isPrimary)?.url ||
    property.media?.[0]?.url || property.images?.[0] ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  const whatsappPhone = property.agent?.whatsapp || '523221002345';
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello! I saw ${property.title} for $${property.priceUsd.toLocaleString()} USD on PV Property Finder and would like more details.`,
  )}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-sand text-ink shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-clay/40 hover:shadow-xl"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand">
          <Link href={`/properties/${property.slug}`} className="block h-full w-full">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              src={primaryImage}
              alt={property.title}
              className="h-full w-full object-cover dark:brightness-90"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-line/80 bg-canvas/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm backdrop-blur-md">
              {property.neighborhood}
            </span>
            {property.oceanView && (
              <span className="flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-[10px] font-bold text-ink border border-line shadow-sm backdrop-blur-md">
                <Waves className="h-3 w-3 text-cyan-300" />
                <span>Ocean View</span>
              </span>
            )}
            {property.featured && (
              <span className="flex items-center gap-1 rounded-full bg-clay px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">
                <Sparkles className="h-2.5 w-2.5" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(property.id)}
            className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full border border-line/80 bg-canvas/90 text-ink shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-clay"
            aria-label={favorited ? 'Remove favorite' : 'Save property'}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-ink/70 hover:text-rose-500'
              }`}
            />
          </button>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Price & Property Type */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Asking Price</span>
              <div className="font-display text-2xl font-bold tracking-tight text-clay sm:text-3xl">
                ${property.priceUsd.toLocaleString()}{' '}
                <span className="text-xs font-sans font-bold tracking-widest text-muted">USD</span>
              </div>
            </div>
            <span className="rounded-full bg-sand/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
              {property.propertyType}
            </span>
          </div>

          {/* Title */}
          <Link href={`/properties/${property.slug}`} className="mt-3 group-hover:text-clay transition-colors">
            <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted font-medium">
            <MapPin className="h-3.5 w-3.5 text-clay shrink-0" />
            <span className="truncate">{property.neighborhood}, Puerto Vallarta</span>
          </div>

          {/* Specs Row */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-y border-line py-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <Bed className="h-3.5 w-3.5 text-clay" />
              <span className="font-bold text-ink">{property.bedrooms}</span>
              <span className="text-[11px]">Beds</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 border-x border-line text-xs text-muted">
              <Bath className="h-3.5 w-3.5 text-clay" />
              <span className="font-bold text-ink">{property.bathrooms}</span>
              <span className="text-[11px]">Baths</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <Maximize2 className="h-3.5 w-3.5 text-clay" />
              <span className="font-bold text-ink">{property.sqft.toLocaleString()}</span>
              <span className="text-[11px]">Sq Ft</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 flex items-center gap-2 pt-1">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="btn-primary flex-1 py-2.5 text-xs tracking-wider"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Inquire</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp message"
              title="Message agent on WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-sand/60 text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:bg-emerald-600 hover:text-ink hover:border-emerald-600 dark:hover:border-emerald-500"
            >
              <MessageCircle className="h-4 w-4" />
            </a>

            <Link
              href={`/properties/${property.slug}`}
              className="btn-outline px-3.5 py-2.5 text-xs border-line text-ink hover:border-line hover:bg-canvas hover:text-ink"
            >
              Details
            </Link>
          </div>
        </div>
      </motion.div>

      <LeadModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        propertyId={property.id}
        propertyTitle={property.title}
        agentPhone={property.agent?.whatsapp}
      />
    </>
  );
}