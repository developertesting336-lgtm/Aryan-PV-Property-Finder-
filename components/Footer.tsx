'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return <footer className="bg-sand text-ink">
    <div className="container-wide grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
      <div className="lg:col-span-1"><div className="font-display text-3xl font-semibold text-ink">PV Property Finder</div><p className="mt-4 max-w-xs text-sm leading-7 text-muted">A small, local team helping buyers find a better way to live around Banderas Bay.</p></div>
      <div><p className="eyebrow">Explore</p><div className="mt-4 flex flex-col gap-3 text-sm"><Link href="/properties" className="underline-link">Available homes</Link><Link href="/neighborhoods" className="underline-link">Neighborhoods</Link><Link href="/valuation" className="underline-link">Sell your property</Link></div></div>
      <div><p className="eyebrow">Visit us</p><p className="mt-4 text-sm leading-7 text-muted">Basilio Badillo 330<br />Emiliano Zapata<br />Puerto Vallarta, Jalisco</p></div>
      <div><p className="eyebrow">Talk with us</p><p className="mt-4 text-sm leading-7 text-muted">English · Español<br />Mon–Sat, 9:00–18:00</p><a href="https://wa.me/523221002345" className="mt-4 inline-block text-sm font-semibold text-clay underline underline-offset-4">WhatsApp our team</a></div>
    </div>
    <div className="container-wide flex flex-col gap-3 border-t border-line py-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} PV Property Finder · Licensed real estate advisors</span><span>EN / ES · Privacy · Legal</span></div>
  </footer>;
}

