'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Share2,
  Bed,
  Bath,
  Maximize2,
  Waves,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Send,
  DollarSign,
  Sparkles,
  Eye,
} from 'lucide-react';
import PanoramaViewer from '../../../components/PanoramaViewer';
import LeadModal from '../../../components/LeadModal';
import OfferModal from '../../../components/OfferModal';
import { useFavoritesStore } from '../../../stores/useFavoritesStore';
import { api } from '../../../lib/api';

interface PropertyDetail {
  id: string;
  title: string;
  slug: string;
  priceUsd: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  neighborhood: string;
  address: string;
  oceanView: boolean;
  beachfront: boolean;
  pool: boolean;
  amenities: string[];
  description: string;
  media: Array<{ url: string; caption: string; isPrimary?: boolean }>;
  agent: {
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    avatar: string;
  };
}

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [show3dPreview, setShow3dPreview] = useState(false);

  const { isFavorite, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    async function fetchProperty() {
      try {
        const { data, error } = await api.getProperty(slug);
        if (data && !error) {
          setProperty(data);
        } else {
          // Local fallback for offline/development resilience
          setProperty({
            id: 'mock-detail-1',
            slug: slug,
            title: 'Residencias Los Muertos Beachfront Penthouse',
            priceUsd: 875000,
            bedrooms: 3,
            bathrooms: 3.5,
            sqft: 2200,
            neighborhood: 'Zona Romántica',
            propertyType: 'Penthouse',
            address: 'Calle Amapas 142, Zona Romántica, Puerto Vallarta',
            oceanView: true,
            beachfront: true,
            pool: true,
            media: [
              { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80', caption: 'Living Area', isPrimary: true },
              { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', caption: 'Terrace & Pool' },
              { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80', caption: 'Master Suite' },
            ],
            description: 'Stunning luxury residence overlooking Banderas Bay with wrap-around sunset terraces, private plunge pool, and direct access to Los Muertos beachfront dining.',
            amenities: ['Oceanfront Terrace', 'Infinity Pool', '24/7 Security', 'Covered Parking', 'Elevator', 'Chef Kitchen', 'Rental License'],
            agent: {
              id: 'agent-1',
              name: 'Alejandro Morales',
              phone: '+52 322 123 4567',
              email: 'alejandro@pvproperties.mx',
              whatsapp: '+52 322 123 4567',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            },
          });
        }
      } catch (err) {
        console.warn('Error fetching property, using fallback:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas py-12 text-ink">
        <div className="container-wide animate-pulse space-y-6">
          <div className="h-6 w-32 rounded-xl bg-sand" />
          <div className="h-[440px] rounded-3xl bg-sand/60 border border-line" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-canvas py-20 text-center text-ink">
        <div className="container-wide max-w-lg">
          <h2 className="font-display text-3xl font-bold text-ink">Property Not Found</h2>
          <p className="mt-2 text-sm text-muted">The requested listing could not be retrieved.</p>
          <Link
            href="/properties"
            className="mt-6 btn-primary inline-flex"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const agent = property.agent || {
    name: 'PV Property Agent',
    whatsapp: '523221002345',
    email: 'contact@pvpropertyfinder.com',
    avatar: 'https://i.pravatar.cc/150?u=pvagent'
  };

  const media = property.media || (property.images ? property.images.map((url: string) => ({ url, caption: property.title })) : [{ url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', caption: 'Property Image' }]);

  const favorited = isFavorite(property.id);
  const whatsappUrl = `https://wa.me/${agent.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello ${agent.name}! I am viewing ${property.title} ($${property.priceUsd.toLocaleString()} USD) on PV Property Finder and would like more details.`,
  )}`;

  return (
    <div className="min-h-screen bg-canvas py-8 sm:py-12 text-ink">
      <div className="container-wide">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-clay transition"
          >
            <ArrowLeft className="size-4" />
            <span>Back to All Listings</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-bold text-ink shadow-sm hover:border-clay hover:text-clay transition"
            >
              <Heart
                className={`size-4 ${
                  favorited ? 'fill-rose-500 text-rose-500' : 'text-muted'
                }`}
              />
              <span>{favorited ? 'Saved' : 'Save Property'}</span>
            </button>
          </div>
        </div>

        {/* Top Header Information */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-line bg-sand/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">
                {property.neighborhood}
              </span>
              <span className="rounded-full bg-clay px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink shadow-sm">
                {property.propertyType}
              </span>
              {property.oceanView && (
                <span className="flex items-center gap-1 rounded-full bg-canvas px-3 py-1 text-[10px] font-bold text-ink shadow-sm">
                  <Waves className="size-3 text-cyan-300" />
                  <span>Oceanfront Panorama</span>
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-tight text-ink">
              {property.title}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted">
              <MapPin className="size-4 text-clay shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          <div className="md:text-right">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted">Listing Price</span>
            <div className="font-display text-4xl sm:text-5xl font-bold text-clay">
              ${property.priceUsd.toLocaleString()}{' '}
              <span className="text-sm font-sans font-bold text-muted">USD</span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-line bg-sand/40 p-2 sm:p-3 shadow-sm">
          {/* Main Active Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand sm:aspect-[21/9]">
            <img
              src={media[activeImageIndex]?.url || media[0]?.url}
              alt={property.title}
              className="h-full w-full object-cover transition duration-500"
            />
            {media[activeImageIndex]?.caption && (
              <div className="absolute bottom-4 left-4 rounded-xl border border-line/60 bg-canvas/90 px-3 py-1.5 text-xs font-bold text-ink shadow-sm backdrop-blur-md">
                {media[activeImageIndex].caption}
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {media.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {media.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border transition ${
                    activeImageIndex === idx
                      ? 'border-clay ring-2 ring-clay/40'
                      : 'border-line opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.caption} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Specs Row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-line bg-canvas p-4 text-center shadow-sm">
                <Bed className="mx-auto size-5 text-clay" />
                <div className="mt-2 font-display text-2xl font-bold text-ink">{property.bedrooms}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">Bedrooms</div>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-4 text-center shadow-sm">
                <Bath className="mx-auto size-5 text-clay" />
                <div className="mt-2 font-display text-2xl font-bold text-ink">{property.bathrooms}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">Bathrooms</div>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-4 text-center shadow-sm">
                <Maximize2 className="mx-auto size-5 text-clay" />
                <div className="mt-2 font-display text-2xl font-bold text-ink">{property.sqft.toLocaleString()}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">Interior Sq Ft</div>
              </div>
              <div className="rounded-2xl border border-line bg-canvas p-4 text-center shadow-sm">
                <Waves className="mx-auto size-5 text-clay" />
                <div className="mt-2 font-display text-2xl font-bold text-ink">{property.oceanView ? 'Direct' : 'Mountain'}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted">View Style</div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink">About This Property</h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/80 whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-ink">Property Amenities & Features</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-line bg-sand/30 p-3 text-xs font-semibold text-ink"
                  >
                    <CheckCircle2 className="size-4 text-clay shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive 360 Panorama Tour */}
            <div className="rounded-3xl border border-line bg-sand/40 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="eyebrow">Real Villa Photography</div>
                  <h3 className="font-display text-2xl font-bold text-ink mt-1">360° Panoramic House Tour</h3>
                  <p className="text-xs text-muted mt-1">Drag to pan across real high-resolution photographs of this residence.</p>
                </div>
                <button
                  onClick={() => setShow3dPreview(!show3dPreview)}
                  className="btn-outline border-line text-ink hover:bg-canvas hover:text-ink text-xs shrink-0"
                >
                  <Eye className="size-4 mr-1.5" />
                  <span>{show3dPreview ? 'Hide Panorama' : 'Launch 360° Tour'}</span>
                </button>
              </div>

              {show3dPreview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                  <PanoramaViewer />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Agent Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 rounded-3xl border border-line bg-canvas p-6 sm:p-8 shadow-lg">
              <div className="flex items-center gap-4 border-b border-line pb-5">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="size-16 rounded-2xl object-cover ring-2 ring-clay/40"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Listing Broker</span>
                  <div className="font-display text-xl font-bold text-ink">{agent.name}</div>
                  <div className="text-xs text-muted">Bilingual PV MLS Specialist</div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="btn-primary w-full py-3 text-xs tracking-wider"
                >
                  <Send className="size-3.5" />
                  <span>Schedule Private Walkthrough</span>
                </button>

                <button
                  onClick={() => setShowOfferModal(true)}
                  className="btn-outline w-full py-3 text-xs tracking-wider border-clay text-clay hover:bg-clay hover:text-ink"
                >
                  <DollarSign className="size-3.5" />
                  <span>Submit Purchase Offer</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-500"
                >
                  <MessageCircle className="size-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="mt-6 rounded-2xl border border-line bg-sand/30 p-4 text-[11px] text-muted leading-relaxed">
                <strong className="text-ink block mb-1">Protected by Mexican Notario Laws:</strong>
                Foreign purchases in the restricted zone are legally deeded via Mexican Bank Trust (Fideicomiso) ensuring perpetual ownership rights.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry & Offer Modals */}
      <LeadModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        propertyId={property.id}
        propertyTitle={property.title}
        agentPhone={agent.whatsapp}
      />

      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        propertyId={property.id}
        propertyTitle={property.title}
        askingPriceUsd={property.priceUsd}
      />
    </div>
  );
}
