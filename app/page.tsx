import Link from 'next/link';
import { ArrowRight, Search, MapPin, Sparkles, Waves, ShieldCheck, Heart, Cuboid, DollarSign, Award, ChevronRight } from 'lucide-react';
import { listProperties } from '@/app/actions/properties';

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

export default async function HomePage() {
  const homes = await listProperties();
  const featuredHome = homes[0];
  const supportingHomes = homes.slice(1, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[640px] overflow-hidden bg-canvas text-ink sm:min-h-[740px]">
        <img
          src={image('photo-1600210492486-724fe5c67fb0')}
          alt="Elegant luxury Puerto Vallarta living room"
          className="absolute inset-0 size-full object-cover opacity-85 transition duration-1000 scale-100 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent" />

        <div className="container-wide relative flex min-h-[780px] flex-col justify-start pt-36 pb-[280px] sm:justify-end sm:pt-24 sm:min-h-[740px] sm:pb-40">
          {/* Floating Pill */}
          <div className="animate-slideDown mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-canvas/70 px-4 py-1.5 text-xs backdrop-blur-md w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="eyebrow text-[#f6d6b8] hover:text-emerald-500">Banderas Bay Real Estate · MLS Verified</span>
          </div>

          <h1 className="animate-slideUp mt-2 max-w-3xl font-display text-5xl leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl text-ink">
            A place to come home to.
          </h1>

          <p className="animate-slideUp mt-6 max-w-lg text-base leading-relaxed text-ink/90 sm:text-lg">
            Thoughtfully selected oceanfront villas, condominiums, and penthouses across Puerto Vallarta and the Riviera Nayarit.
          </p>

          {/* Search Bar Floating Widget */}
          <div className="animate-scaleIn absolute inset-x-4 bottom-6 grid overflow-hidden rounded-2xl border border-canvas/25 bg-canvas/95 backdrop-blur-md text-ink shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-[calc(100%-4rem)] sm:-translate-x-1/2 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
            <Link
              href="/properties?neighborhood=zona%20rom%C3%A1ntica"
              className="border-b border-line p-4 hover:bg-sand/60 transition sm:border-b-0 sm:border-r"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Location
              </span>
              <span className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <MapPin className="size-4 text-clay" /> Puerto Vallarta All Zones
              </span>
            </Link>

            <Link
              href="/properties?maxPrice=750000"
              className="border-b border-line p-4 hover:bg-sand/60 transition sm:border-b-0 sm:border-r"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Target Budget
              </span>
              <span className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <DollarSign className="size-4 text-clay" /> $300k &ndash; $1.5M+ USD
              </span>
            </Link>

            <Link
              href="/properties"
              className="border-b border-line p-4 hover:bg-sand/60 transition sm:border-b-0 sm:border-r"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                Property Type
              </span>
              <span className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <Waves className="size-4 text-clay" /> Villas, Condos & Penthouses
              </span>
            </Link>

            <Link
              href="/properties"
              className="flex items-center justify-center bg-clay px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] text-ink hover:bg-canvas transition"
            >
              <Search className="mr-2 size-4" /> Explore Homes
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Budget Tiers Row */}
      <section className="border-b border-line bg-canvas">
        <div className="container-wide grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line">
          <Link
            href="/properties?maxPrice=350000"
            className="group p-6 sm:p-8 hover:bg-sand/70 transition"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Starter & Studio</span>
            <span className="font-display text-3xl font-bold text-ink group-hover:text-clay transition block">
              Under $350k
            </span>
            <span className="text-xs text-muted mt-1 block">Versalles & 5 de Diciembre</span>
          </Link>

          <Link
            href="/properties?minPrice=350000&maxPrice=600000"
            className="group p-6 sm:p-8 hover:bg-sand/70 transition"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Beachfront Condo</span>
            <span className="font-display text-3xl font-bold text-ink group-hover:text-clay transition block">
              $350k &ndash; $600k
            </span>
            <span className="text-xs text-muted mt-1 block">Zona Romántica & Marina</span>
          </Link>

          <Link
            href="/properties?minPrice=600000&maxPrice=1000000"
            className="group p-6 sm:p-8 hover:bg-sand/70 transition"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Luxury Penthouse</span>
            <span className="font-display text-3xl font-bold text-ink group-hover:text-clay transition block">
              $600k &ndash; $1M
            </span>
            <span className="text-xs text-muted mt-1 block">Amapas Panoramic Balconies</span>
          </Link>

          <Link
            href="/properties?minPrice=1000000"
            className="group p-6 sm:p-8 hover:bg-sand/70 transition"
          >
            <span className="text-[10px] uppercase tracking-widest text-muted font-bold block mb-1">Estate Villas</span>
            <span className="font-display text-3xl font-bold text-ink group-hover:text-clay transition block">
              $1M+ USD
            </span>
            <span className="text-xs text-muted mt-1 block">Conchas Chinas Cliffsides</span>
          </Link>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="container-wide py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">A considered shortlist</p>
            <h2 className="mt-3 font-display text-4xl leading-none sm:text-6xl text-ink">
              Featured Homes
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/3d-showcase"
              className="inline-flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-clay hover:bg-clay hover:text-ink transition"
            >
              <Sparkles className="size-3.5" />
              <span>3D Villa Tour</span>
            </Link>
            <Link
              href="/properties"
              className="underline-link text-xs font-bold uppercase tracking-[0.14em] text-ink hover:text-clay transition"
            >
              View all homes <ArrowRight className="ml-1 inline size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Main Featured Card */}
          {featuredHome && (
            <Link
              href={`/properties/${featuredHome.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-lg hover:shadow-2xl transition duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                <img
                  src={
                    (featuredHome as any).image ||
                    (featuredHome as any).images?.[0] ||
                    (featuredHome as any).media?.[0]?.url ||
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={featuredHome.title}
                  className="photo-zoom size-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded-full bg-canvas px-3 py-1 text-xs font-bold text-ink border border-line backdrop-blur-md">
                    {featuredHome.propertyType}
                  </span>
                  <span className="rounded-full bg-clay px-3 py-1 text-xs font-bold text-ink">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 rounded-xl bg-canvas/90 px-3 py-1.5 text-sm font-extrabold text-clay backdrop-blur-md">
                  ${((featuredHome as any).priceUsd ?? (featuredHome as any).price ?? 875000).toLocaleString()} USD
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl text-ink group-hover:text-clay transition">
                  {featuredHome.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{featuredHome.location}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted line-clamp-2">
                  {featuredHome.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-4 text-xs font-bold uppercase tracking-wider text-ink">
                  <span>Explore Listing & 3D Walkthrough</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          )}

          {/* Supporting Homes List */}
          <div className="space-y-5">
            {supportingHomes.map((home) => (
              <Link
                href={`/properties/${home.slug}`}
                key={home.id || home.title}
                className="group grid grid-cols-[38%_1fr] gap-4 rounded-2xl border border-line bg-canvas p-3 shadow-sm hover:shadow-md hover:border-clay/40 transition"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                  <img
                    src={
                      (home as any).image ||
                      (home as any).images?.[0] ||
                      (home as any).media?.[0]?.url ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={home.title}
                    className="photo-zoom size-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-clay">
                    {home.propertyType}
                  </span>
                  <h4 className="font-display text-xl leading-tight text-ink group-hover:text-clay transition">
                    {home.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted line-clamp-1">{home.location}</p>
                  <p className="mt-3 text-sm font-bold text-clay">
                    ${((home as any).priceUsd ?? (home as any).price ?? 500000).toLocaleString()} USD
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 360 Real House Panorama Teaser Banner */}
      <section className="bg-gradient-to-r from-ocean via-slate-900 to-ocean py-20 text-ink">
        <div className="container-wide grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-clay/40 bg-clay/20 px-4 py-1.5 text-xs text-clay backdrop-blur-md">
              <Sparkles className="size-3.5 text-clay" />
              <span>Real House Panoramic Photography</span>
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl text-ink leading-tight">
              360° Real Villa Panorama Tour
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink/80 max-w-lg">
              Explore authentic high-resolution panoramic photography of luxury residences. Drag to pan 360° across the private infinity pool, open-plan living pavilion, master sunset suite, and chef kitchen.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/3d-showcase"
                className="btn-primary bg-clay hover:bg-amber-600 text-ink rounded-xl shadow-lg"
              >
                Launch 360° Panorama Tour <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/quiz"
                className="btn-outline border-canvas/40 text-ink hover:border-canvas"
              >
                Match My Budget
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-line bg-canvas/80 p-2 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"
              alt="Real House Panoramic Villa Tour"
              className="rounded-2xl w-full aspect-[16/10] object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Real 360° Panorama Active
                </span>
              </div>
              <Link
                href="/3d-showcase"
                className="rounded-xl bg-clay px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-amber-600 transition"
              >
                Enter Tour →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods Exploration */}
      <section className="bg-sand py-20 sm:py-28">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Know the bay</p>
              <h2 className="mt-3 max-w-md font-display text-4xl leading-tight sm:text-6xl text-ink">
                Every neighborhood has its own rhythm.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted max-w-sm">
                From the bustling cobblestone taco alleys of Zona Romántica to the cliffside tranquility of Conchas Chinas.
              </p>
              <Link
                href="/neighborhoods"
                className="btn-primary mt-8 inline-flex"
              >
                Explore all neighborhoods <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: 'Zona Romántica', img: 'photo-1507525428034-b723cf961d3e', price: 'Avg. $450k' },
                { name: 'Versalles', img: 'photo-1510798831971-661eb04b3739', price: 'Avg. $320k' },
                { name: 'Marina Vallarta', img: 'photo-1544551763-46a013bb70d5', price: 'Avg. $590k' },
              ].map((item) => (
                <Link
                  href={`/properties?neighborhood=${encodeURIComponent(item.name)}`}
                  key={item.name}
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-canvas shadow-md"
                >
                  <img
                    src={image(item.img)}
                    alt={item.name}
                    className="photo-zoom absolute inset-0 size-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean/90 via-ocean/20 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-clay block">
                      {item.price}
                    </span>
                    <span className="font-display text-2xl font-bold text-ink block mt-0.5">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advisory & How We Work */}
      <section className="container-wide py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Local Advisory</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl text-ink">
            Good advice is local, bilingual, and transparent.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Listen First',
              desc: 'Budget matching, lifestyle criteria, and closing timeline tailored to your purchase goals.',
            },
            {
              step: '02',
              title: 'Fideicomiso & Escrow',
              desc: 'Step-by-step guidance navigating Mexican bank trust (Fideicomiso) laws, title searches, and US/Canadian escrow accounts.',
            },
            {
              step: '03',
              title: 'Closing & Beyond',
              desc: 'A calm, licensed bilingual team supporting you from initial walkthrough to notary closing day and property management.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-line bg-canvas p-8 shadow-sm hover:border-clay/50 transition"
            >
              <span className="font-display text-4xl font-bold text-clay">{item.step}</span>
              <h3 className="mt-4 font-display text-2xl font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-canvas border-t border-line py-20 text-center text-ink sm:py-28">
        <div className="container-wide">
          <p className="eyebrow text-muted">A better way to begin</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-6xl text-ink">
            Tell us what you are looking for.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quiz"
              className="btn-primary bg-clay hover:bg-amber-600 text-ink rounded-xl shadow-lg"
            >
              Take the Lifestyle Quiz <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/valuation"
              className="btn-outline border-canvas/40 text-ink hover:border-canvas rounded-xl"
            >
              Get Free Property Valuation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
