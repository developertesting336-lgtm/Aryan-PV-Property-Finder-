'use client';

import React, { useState } from 'react';
import { Eye, MapPin, Send, Compass, Sparkles, Waves, Bed, Bath, Maximize2 } from 'lucide-react';
import PanoramaViewer from '@/components/PanoramaViewer';
import LeadModal from '@/components/LeadModal';

export default function ThreeShowcasePage() {
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  return (
    <div className="min-h-screen bg-canvas py-10 sm:py-14 text-ink">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/80 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-clay shadow-sm">
              <Eye className="size-3.5 text-clay" />
              <span>Real Panoramic House Photography · 360° View</span>
            </div>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink">
              360° Real Villa Panorama Tour
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
              Step inside a real Puerto Vallarta oceanfront residence. Drag to pan 360° across the infinity pool deck, open-plan living pavilion, master sunset suite, and chef kitchen.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="btn-primary text-xs"
            >
              <Send className="size-3.5" />
              <span>Book In-Person Private Tour</span>
            </button>
          </div>
        </div>

        {/* Real Photo Panorama Viewer Container */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-line bg-canvas shadow-xl">
          <PanoramaViewer className="w-full" />
        </div>

        {/* Real Villa Features Breakdown */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-line bg-canvas p-6 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-clay mb-1">Architecture</div>
            <div className="font-display text-xl font-bold text-ink">Seamless Ocean Living</div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Designed specifically for tropical coastal microclimates with multi-slide pocket glass walls, cross-ventilation, and expansive shaded overhangs.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-canvas p-6 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-clay mb-1">Finishes</div>
            <div className="font-display text-xl font-bold text-ink">Parota & Travertine</div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Solid Mexican Parota hardwoods naturally impervious to ocean salt air, paired with honed ivory travertine pool deck tiles.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-canvas p-6 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-clay mb-1">Orientation</div>
            <div className="font-display text-xl font-bold text-ink">Sunset Horizon</div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              True western exposure framing 365 days of unobstructed Pacific sunsets over Banderas Bay, Los Arcos, and the Sierra Madre.
            </p>
          </div>

          <div className="rounded-3xl border border-line bg-canvas p-6 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-clay mb-1">Navigation</div>
            <div className="font-display text-xl font-bold text-ink">Multi-Room Tour</div>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Switch seamlessly between the Oceanfront Terrace, Great Living Salon, Master Bedroom Suite, and Gourmet Kitchen using the interactive room selector.
            </p>
          </div>
        </div>
      </div>

      <LeadModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        propertyTitle="Oceanfront Villa Panoramic Tour"
      />
    </div>
  );
}
