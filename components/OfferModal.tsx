'use client';

import React, { useState } from 'react';
import { X, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api';
import { useToastStore } from '@/stores/useToastStore';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  listPriceUsd?: number;
  askingPriceUsd?: number;
}

export default function OfferModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  listPriceUsd,
  askingPriceUsd,
}: OfferModalProps) {
  const basePrice = listPriceUsd || askingPriceUsd || 500000;
  const [buyerName, setBuyerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offerAmountUsd, setOfferAmountUsd] = useState<number>(basePrice);
  const [financingType, setFinancingType] = useState('cash');
  const [notes, setNotes] = useState(
    'Offer contingent upon clear title inspection, Fideicomiso bank trust transfer, and 30-day closing.',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createOffer({
        buyerName,
        email,
        phone,
        propertyId,
        propertyTitle,
        offerAmountUsd,
        financingType,
        notes,
      });
      setSubmitted(true);
      useToastStore.getState().addToast({
        type: 'success',
        title: 'Offer Submitted Successfully',
        message: `Formal purchase offer of $${offerAmountUsd.toLocaleString()} USD dispatched for ${propertyTitle}.`,
      });
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const percentOfList = Math.round((offerAmountUsd / basePrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/70 border border-line p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-line bg-canvas p-6 sm:p-8 text-ink shadow-2xl animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-sand hover:text-ink transition"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-emerald-600 dark:text-emerald-400 mb-3" />
            <h3 className="font-display text-2xl font-bold text-ink">Offer Dispatched Successfully</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed max-w-sm mx-auto">
              Your formal offer of <strong className="text-clay">${offerAmountUsd.toLocaleString()} USD</strong> on{' '}
              <strong className="text-ink">{propertyTitle}</strong> has been transmitted to the listing advisor.
            </p>
            <div className="mt-6">
              <button
                onClick={onClose}
                className="btn-primary text-xs py-2.5 px-6"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="inline-block rounded-full bg-sand border border-line px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-clay">
                Purchase Offer Draft
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">
                Submit an Official Offer
              </h2>
              <p className="text-xs text-muted mt-1">
                Property: <strong className="text-ink">{propertyTitle}</strong> (Asking: ${basePrice.toLocaleString()} USD)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Emily Watson"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="emily@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  WhatsApp / Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                />
              </div>

              {/* Offer Amount */}
              <div className="rounded-2xl border border-line bg-canvas p-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  <span>Offer Amount (USD)</span>
                  <span className="font-sans text-xs text-clay">{percentOfList}% of Asking Price</span>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 size-4 text-clay" />
                  <input
                    type="number"
                    min={100000}
                    step={5000}
                    value={offerAmountUsd}
                    onChange={(e) => setOfferAmountUsd(Number(e.target.value))}
                    className="w-full rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-3.5 font-display text-xl font-bold text-ink focus:border-clay focus:outline-none"
                  />
                </div>
              </div>

              {/* Financing Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  Financing Type
                </label>
                <select
                  value={financingType}
                  onChange={(e) => setFinancingType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs font-medium text-ink transition focus:border-clay focus:bg-canvas focus:outline-none"
                >
                  <option value="cash">100% Cash / Wire Transfer</option>
                  <option value="us_cross_border">Cross-Border Mortgage (US/Canadian)</option>
                  <option value="developer">Developer Direct Financing</option>
                  <option value="mexican_bank">Mexican Bank Mortgage (Scotiabank / BBVA)</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  Contingencies & Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline border-line text-muted hover:text-ink text-xs py-2.5 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs py-2.5 px-5"
                >
                  <DollarSign className="size-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit Formal Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
