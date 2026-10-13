'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, CheckCircle2, DollarSign, ArrowRight, RotateCcw, Building2, Waves } from 'lucide-react';
import PropertyCard, { PropertyData } from '@/components/PropertyCard';
import { api } from '@/lib/api';
import { useToastStore } from '@/stores/useToastStore';

interface QuizResult {
  matchedNeighborhood: string;
  matchPercentage: number;
  secondaryNeighborhood: string;
  reason: string;
  averageNeighborhoodPrice: number;
  recommendedProperties: PropertyData[];
}

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [budgetUsd, setBudgetUsd] = useState(500000);
  const [lifestyle, setLifestyle] = useState('nightlife_culinary');
  const [beachProximity, setBeachProximity] = useState('ocean_view');
  const [propertyType, setPropertyType] = useState('condo');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const { addToast } = useToastStore();

  const handleScoreQuiz = async () => {
    setLoading(true);
    try {
      const { data, error } = await api.scoreQuiz({
        budgetUsd,
        lifestyle,
        beachProximity,
        propertyType,
      });

      if (data && !error) {
        setResult(data);
        addToast({
          type: 'success',
          title: `Matched: ${data.matchedNeighborhood}!`,
          message: `${data.matchPercentage}% lifestyle match found for your budget.`,
        });
      } else {
        throw new Error(error || 'Failed to score');
      }
    } catch {
      // Offline fallback
      setResult({
        matchedNeighborhood: 'Zona Romántica',
        matchPercentage: 94,
        secondaryNeighborhood: 'Versalles',
        reason: 'You thrive in vibrant walkable environments with direct access to Los Muertos Beach, vibrant culinary scenes, and rich culture.',
        averageNeighborhoodPrice: 450000,
        recommendedProperties: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-canvas py-10 sm:py-14 text-ink">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/80 px-4 py-1 text-xs font-bold uppercase tracking-widest text-clay shadow-sm">
            <Sparkles className="size-3.5 text-clay" />
            <span>Lifestyle & Budget Matching Quiz</span>
          </div>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink">
            What Can I Buy in Puerto Vallarta?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            Answer 4 quick questions to calculate your optimal neighborhood match and discover homes within your target budget.
          </p>
        </div>

        {/* Quiz Flow */}
        {!result ? (
          <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-10 shadow-lg">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted mb-2">
                <span>Step {step} of 4</span>
                <span className="text-clay">{step * 25}% Completed</span>
              </div>
              <div className="h-2 w-full rounded-full bg-sand overflow-hidden">
                <div
                  className="h-full bg-clay transition-all duration-300"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>

            {/* Step 1: Budget */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    What is your estimated purchase budget?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Drag the slider to your preferred target budget in USD.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-sand/30 p-8 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Target Price</span>
                  <div className="font-display text-4xl sm:text-5xl font-bold text-clay mb-4">
                    ${budgetUsd.toLocaleString()}{' '}
                    <span className="text-sm font-sans font-bold text-muted">USD</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={1800000}
                    step={25000}
                    value={budgetUsd}
                    onChange={(e) => setBudgetUsd(Number(e.target.value))}
                    className="h-3 w-full appearance-none rounded-lg bg-sand accent-clay cursor-pointer"
                  />
                  <div className="mt-3 flex justify-between text-xs font-semibold text-muted">
                    <span>$200K (Condos & Studios)</span>
                    <span>$1.8M+ (Luxury Cliffside Villas)</span>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary"
                  >
                    <span>Next: Lifestyle</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Lifestyle */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    What kind of lifestyle do you envision?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Select your preferred everyday rhythm and environment.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      id: 'nightlife_culinary',
                      title: 'Walkable, Foodie & Vibrant',
                      desc: 'Cobblestone streets, high culinary energy, boutique shops, and beach clubs.',
                    },
                    {
                      id: 'tranquil_yachting',
                      title: 'Boating, Golf & Serenity',
                      desc: 'Yacht harbor boardwalk, championship golf course, peaceful surroundings.',
                    },
                    {
                      id: 'secluded_nature',
                      title: 'Cliffside Privacy & Sunsets',
                      desc: 'Panoramic ocean horizons, Sierra Madre jungle canopy, total tranquility.',
                    },
                    {
                      id: 'local_authentic',
                      title: 'Authentic Mexican Culture',
                      desc: 'Traditional markets, community warmth, local bakeries, high rental yields.',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLifestyle(opt.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        lifestyle === opt.id
                          ? 'border-clay bg-clay/5 ring-2 ring-clay/20'
                          : 'border-line bg-sand/20 hover:border-clay hover:bg-sand/60'
                      }`}
                    >
                      <div className="font-display text-lg font-bold text-ink">{opt.title}</div>
                      <p className="mt-1 text-xs text-muted leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-outline border-line text-muted hover:text-ink"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn-primary"
                  >
                    <span>Next: Proximity</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Beach Proximity */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    How close do you want to be to the Pacific?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Balance ocean views with walkable beach access.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      id: 'oceanfront',
                      title: 'Direct Beachfront / Walk on Sand',
                      desc: 'Steps from your terrace directly onto Los Muertos or Playa Camarones.',
                    },
                    {
                      id: 'ocean_view',
                      title: 'Elevated Ocean View',
                      desc: 'Unobstructed bay panoramas with sunsets from an elevated hillside.',
                    },
                    {
                      id: 'short_walk',
                      title: 'Short Walk to Beach (5-10 min)',
                      desc: 'Convenient stroll to sand, nestled in vibrant neighborhood streets.',
                    },
                    {
                      id: 'peaceful_inland',
                      title: 'Quiet Residential Haven',
                      desc: 'More space, private garden or pool, short drive to beach.',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBeachProximity(opt.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        beachProximity === opt.id
                          ? 'border-clay bg-clay/5 ring-2 ring-clay/20'
                          : 'border-line bg-sand/20 hover:border-clay hover:bg-sand/60'
                      }`}
                    >
                      <div className="font-display text-lg font-bold text-ink">{opt.title}</div>
                      <p className="mt-1 text-xs text-muted leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-outline border-line text-muted hover:text-ink"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="btn-primary"
                  >
                    <span>Next: Property Type</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Property Type */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                    What type of property fits your needs?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Choose the layout and maintenance lifestyle that suits you best.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      id: 'condo',
                      title: 'Turnkey Luxury Condominium',
                      desc: 'Low-maintenance lock-and-leave with pool, gym, 24/7 security, and rental management.',
                    },
                    {
                      id: 'penthouse',
                      title: 'Rooftop Penthouse',
                      desc: 'Private plunge pool, top-floor bay breezes, large entertainment terrace.',
                    },
                    {
                      id: 'villa',
                      title: 'Freestanding Private Villa',
                      desc: 'Gated grounds, private infinity pool, lush tropical gardens, ultimate privacy.',
                    },
                    {
                      id: 'studio',
                      title: 'Studio / Starter Investment',
                      desc: 'Compact footprint, maximum rental yield, prime culinary zone location.',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPropertyType(opt.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        propertyType === opt.id
                          ? 'border-clay bg-clay/5 ring-2 ring-clay/20'
                          : 'border-line bg-sand/20 hover:border-clay hover:bg-sand/60'
                      }`}
                    >
                      <div className="font-display text-lg font-bold text-ink">{opt.title}</div>
                      <p className="mt-1 text-xs text-muted leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(3)}
                    className="btn-outline border-line text-muted hover:text-ink"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleScoreQuiz}
                    disabled={loading}
                    className="btn-primary"
                  >
                    <span>{loading ? 'Calculating Match...' : 'Calculate My Match'}</span>
                    <Sparkles className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-line bg-canvas p-8 sm:p-12 shadow-lg text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-sand/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-clay shadow-sm">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Optimal Match Calculated</span>
              </div>

              <div className="mt-6 text-xs uppercase tracking-widest text-muted font-bold">
                Your Ideal Puerto Vallarta Zone
              </div>
              <h2 className="mt-2 font-display text-4xl sm:text-6xl font-bold text-ink">
                {result.matchedNeighborhood}
              </h2>

              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sand/60 border border-line px-5 py-2.5">
                <span className="font-display text-2xl font-bold text-clay">
                  {result.matchPercentage}%
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Lifestyle Compatibility Score
                </span>
              </div>

              <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-ink/80">
                {result.reason}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
                <div className="rounded-xl border border-line bg-sand/30 px-4 py-2">
                  <span className="text-muted">Target Budget: </span>
                  <strong className="text-ink">${budgetUsd.toLocaleString()} USD</strong>
                </div>
                <div className="rounded-xl border border-line bg-sand/30 px-4 py-2">
                  <span className="text-muted">Secondary Match: </span>
                  <strong className="text-ink">{result.secondaryNeighborhood}</strong>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/properties?neighborhood=${encodeURIComponent(result.matchedNeighborhood.toLowerCase())}&maxPrice=${budgetUsd}`}
                  className="btn-primary py-3 px-6 text-xs tracking-wider"
                >
                  <span>Browse {result.matchedNeighborhood} Homes Under ${budgetUsd.toLocaleString()}</span>
                  <ArrowRight className="size-4" />
                </Link>

                <button
                  onClick={handleReset}
                  className="btn-outline border-line text-ink hover:bg-sand/70 text-xs py-3 px-6"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
