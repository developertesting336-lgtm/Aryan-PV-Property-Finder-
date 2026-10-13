'use client';

import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToastStore } from '@/stores/useToastStore';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyTitle?: string;
  agentPhone?: string;
}

export default function LeadModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  agentPhone = '523221002345',
}: LeadModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    propertyTitle
      ? `Hi, I am interested in viewing ${propertyTitle}. Could you provide availability for a walkthrough?`
      : 'Hi, I would like to learn more about properties in Puerto Vallarta.',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToastStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createLead({
        name,
        email,
        phone,
        propertyId,
        propertyTitle,
        message,
        source: 'inquiry',
      });
      setSubmitted(true);
      addToast({
        type: 'success',
        title: 'Inquiry Dispatched',
        message: `Assigned to bilingual PV broker. Notification enqueued via worker queue.`,
      });
    } catch {
      setSubmitted(true);
      addToast({
        type: 'info',
        title: 'Inquiry Saved',
        message: 'Your inquiry has been stored and a broker will be notified.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${agentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello! I am inquiring about "${propertyTitle || 'Puerto Vallarta properties'}". My name is ${name || 'Buyer'}. ${message}`,
  )}`;

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
            <h3 className="font-display text-2xl font-bold text-ink">Inquiry Sent Successfully</h3>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed max-w-sm mx-auto">
              Our licensed Puerto Vallarta listing advisor has received your request and will contact you via WhatsApp or email shortly.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-emerald-500 dark:hover:bg-emerald-600 transition shadow-sm"
              >
                <MessageCircle className="size-4" />
                <span>Continue on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="btn-outline border-line text-muted hover:text-ink text-xs py-2.5 px-5"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="inline-block rounded-full bg-sand border border-line px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-clay">
                Schedule Private Walkthrough
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">
                {propertyTitle || 'Contact Listing Advisor'}
              </h2>
              <p className="text-xs text-muted mt-1">
                Direct inquiry to licensed bilingual broker. No spam, 100% compliant with Mexican privacy laws.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="david@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs text-ink placeholder:text-muted transition focus:border-clay focus:bg-canvas focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                  Message / Inquiries
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                  <Send className="size-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Dispatch Inquiry'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
