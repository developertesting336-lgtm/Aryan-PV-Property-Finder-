'use client';

// Navbar.tsx
// Top navigation bar. Uses the real auth store (no fake roles).
// Shows:
//   - While loading: a small animated skeleton
//   - Guest: Login + Sign Up buttons
//   - Logged-in user: avatar dropdown with dashboard links and logout
//   - Admin: same as user but also shows "Admin Panel" link and badge

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Heart, Menu, X, User, ChevronDown,
  LayoutDashboard, LogOut, ShieldAlert,
  Home, Building2, Box, Sparkles, Calculator, ArrowRight,
} from 'lucide-react';
import {
  motion, AnimatePresence, useScroll, useSpring,
  useMotionValueEvent, useReducedMotion,
} from 'framer-motion';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import { useAuthStore } from '../stores/useAuthStore';
import ThemeToggle from './ThemeToggle';

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  authOnly?: boolean; // only shown when logged in
}

const primaryNavLinks: NavLink[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Properties', href: '/properties', icon: Building2 },
  { label: 'Showcase', href: '/showcase', icon: Box, badge: 'Virtual' },
  { label: 'Quiz', href: '/quiz', icon: Sparkles },
  { label: 'Valuation', href: '/valuation', icon: Calculator },
  // { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, authOnly: true },
];

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

function isLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

// The official WhatsApp SVG logo
function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// Round avatar showing photo or initials
function Avatar({ user, className = 'size-8' }: { user?: { name?: string; avatar?: string } | null; className?: string }) {
  const initials = user?.name?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '';
  if (user?.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.avatar} alt={user.name || 'Avatar'} className={`${className} rounded-full object-cover ring-2 ring-clay/30`} />;
  }
  return (
    <span className={`${className} flex items-center justify-center rounded-full bg-canvas text-[11px] font-bold text-ink`}>
      {initials || <User className="size-4" />}
    </span>
  );
}

// Small pulsing gray circle shown while we load the session
function AuthSkeleton() {
  return <span className="size-9 rounded-full bg-sand/80 animate-pulse border border-line" />;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const { favorites } = useFavoritesStore();
  const { status, role, user, logout } = useAuthStore();

  const isGuest = status === 'unauthenticated' || status === 'loading';
  const isLoading = status === 'loading';
  const isAdmin = status === 'authenticated' && role === 'admin';

  const favoritesCount = mounted ? favorites?.length ?? 0 : 0;

  // Scroll hide/show
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 15);
    const diff = y - lastScrollY.current;
    if (y > 120 && diff > 6) setHidden(true);
    else if (diff < -6 || y <= 120) setHidden(false);
    lastScrollY.current = y;
  });

  const isHidden = hidden && !mobileOpen && !dropdownOpen;

  useEffect(() => setMounted(true), []);
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobileOpen(false); setDropdownOpen(false); } };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);
  useEffect(() => {
    const h = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Real logout: clears cookie on server, resets store, redirects home
  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    await logout();
    router.push('/');
    router.refresh();
  };

  // Hide on admin pages (admin has its own layout)
  if (pathname.startsWith('/admin')) return null;

  // Which nav links to show (hide auth-only links for guests)
  const visibleLinks = primaryNavLinks.filter(l => !l.authOnly || status === 'authenticated');

  return (
    <>
      <motion.header
        animate={{ y: isHidden ? '-100%' : '0%' }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeInOut' }}
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 ${scrolled ? 'border-line/80 bg-canvas/95 shadow-[0_4px_24px_rgba(30,41,59,0.08)] backdrop-blur-xl' : 'border-line/40 bg-canvas/80 backdrop-blur-md'
          }`}
      >
        <div className="container-wide">
          <div className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

            {/* Logo */}
            <Link href="/" className={`group flex shrink-0 items-center gap-3 rounded-2xl ${focusRing}`} aria-label="PV Property Finder, go to home">
              <div className="relative flex size-11 items-center justify-center rounded-2xl bg-canvas shadow-md transition-all duration-300 group-hover:rotate-[-4deg] group-hover:bg-clay">
                <span className="font-display text-2xl font-bold tracking-tight text-ink">PV</span>
                <span className="absolute -bottom-1 -right-1 size-2.5 rounded-full border-2 border-canvas bg-emerald-500" />
              </div>
              <div className="hidden flex-col leading-tight sm:flex lg:hidden xl:flex">
                <span className="font-display text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-clay">PV Property Finder</span>
                <span className="hidden text-[9.5px] font-bold uppercase tracking-[0.22em] text-muted sm:block">Puerto Vallarta · MLS</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden items-center gap-0.5 rounded-full border border-line/70 bg-sand/40 p-1 lg:flex" aria-label="Main navigation">
              {visibleLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);
                // For admin, the Dashboard link goes to /admin
                const href = link.href === '/dashboard' && isAdmin ? '/admin' : link.href;
                return (
                  <Link
                    key={link.href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-1 xl:gap-1.5 rounded-full px-2.5 py-2 xl:px-3.5 text-[9.5px] xl:text-[11px] font-bold uppercase tracking-wider xl:tracking-[0.14em] transition-colors duration-200 ${focusRing} ${active ? 'text-ink' : 'text-ink/70 hover:text-clay'}`}
                  >
                    {active && (
                      <motion.span layoutId="navbar-active-pill" className="absolute inset-0 rounded-full bg-canvas shadow-sm ring-1 ring-line dark:bg-sand" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {link.badge && (
                      <span className={`relative z-10 rounded-full px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase transition-colors ${active ? 'bg-clay text-ink' : 'bg-clay/15 text-clay'}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right-side actions */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />

              {/* Favorites */}
              <Link href="/wishlist" title="Saved properties" aria-label={`Saved properties, ${favoritesCount} items`}
                className={`group relative flex size-10 items-center justify-center rounded-full border border-line bg-canvas/80 shadow-sm transition hover:border-clay hover:bg-sand/60 ${focusRing}`}
              >
                <Heart className={`size-[18px] transition-transform duration-200 group-hover:scale-110 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-muted'}`} />
                <AnimatePresence>
                  {favoritesCount > 0 && (
                    <motion.span key={favoritesCount} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-[18px] text-ink ring-2 ring-canvas"
                    >
                      {favoritesCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* WhatsApp */}
              <a href="https://wa.me/523221002345" target="_blank" rel="noreferrer" title="Chat on WhatsApp" aria-label="Chat with an advisor on WhatsApp"
                className="group relative hidden size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-ink shadow-sm transition duration-200 hover:scale-110 hover:shadow-lg hover:shadow-[#25D366]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas md:flex"
              >
                <WhatsAppIcon className="size-5" />
                <span className="absolute -right-0.5 -top-0.5 flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-canvas/80 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full border-2 border-canvas bg-emerald-500" />
                </span>
              </a>

              {/* Auth section */}
              <div className="relative hidden sm:block" ref={dropdownRef}>
                {/* Loading: show a pulsing skeleton, not buttons */}
                {isLoading && <AuthSkeleton />}

                {/* Guest: show Login + Sign Up */}
                {!isLoading && isGuest && (
                  <div className="flex items-center gap-1.5">
                    <Link href="/login" className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-sand/70 hover:text-clay ${focusRing}`}>Login</Link>
                    <Link href="/signup" className={`rounded-full bg-canvas px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-sm transition hover:bg-clay hover:shadow-md ${focusRing}`}>Sign Up</Link>
                  </div>
                )}

                {/* Authenticated: avatar dropdown */}
                {!isLoading && !isGuest && (
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className={`flex items-center gap-2 rounded-full border border-line bg-sand/40 py-1 pl-1 pr-3 text-xs font-bold shadow-sm transition hover:border-clay hover:bg-sand ${focusRing}`}
                    aria-expanded={dropdownOpen} aria-haspopup="menu" aria-label="User menu"
                  >
                    <Avatar user={user} className="size-8" />
                    <span className="hidden max-w-[110px] truncate capitalize xl:inline-block">{user?.name || 'Profile'}</span>
                    {isAdmin && (
                      <span className="hidden rounded-full bg-clay/15 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase text-clay xl:inline-block">Admin</span>
                    )}
                    <ChevronDown className={`size-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && !isGuest && (
                    <motion.div role="menu" initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }} style={{ transformOrigin: 'top right' }}
                      className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-line bg-canvas p-2 shadow-xl"
                    >
                      {/* User info */}
                      <div className="mb-2 flex items-center gap-3 rounded-xl bg-sand/50 p-3">
                        <Avatar user={user} className="size-10" />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-ink">{user?.name}</p>
                          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {role}
                          </p>
                        </div>
                      </div>

                      {/* Admin Panel (admins only) */}
                      {isAdmin && (
                        <Link href="/admin" role="menuitem"
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-700 dark:text-amber-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 ${focusRing}`}
                        >
                          <ShieldAlert className="size-4" /> Admin Panel
                        </Link>
                      )}

                      {/* Dashboard */}
                      <Link href="/profile" role="menuitem"
                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-sand hover:text-ink ${focusRing}`}
                      >
                        <LayoutDashboard className="size-4" /> My Profile
                      </Link>

                      <div className="my-2 h-px bg-line" />

                      <button role="menuitem" onClick={handleLogout}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-300 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 ${focusRing}`}
                      >
                        <LogOut className="size-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger for mobile */}
              <button onClick={() => setMobileOpen(o => !o)}
                className={`flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-ink shadow-sm transition hover:bg-sand lg:hidden ${focusRing}`}
                aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={mobileOpen ? 'close' : 'open'} initial={{ rotate: -80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 80, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
                    {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll progress bar */}
        <motion.div style={{ scaleX: progress }} className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-gradient-to-r from-clay to-amber-400" aria-hidden="true" />
      </motion.header>

      {/* Mobile menu drawer (outside <header> to avoid blur issues) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[55] bg-ink/40 backdrop-blur-sm lg:hidden" aria-hidden="true"
          />
        )}
        {mobileOpen && (
          <motion.aside key="drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 right-0 z-[60] flex w-[min(88vw,380px)] flex-col bg-canvas shadow-2xl lg:hidden"
          >
            {/* Drawer header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-line px-5">
              <span className="font-display text-lg font-bold text-ink">Menu</span>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button onClick={() => setMobileOpen(false)}
                  className={`flex size-10 items-center justify-center rounded-full border border-line text-ink transition hover:bg-sand ${focusRing}`}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Scrollable links */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation links">
                {visibleLinks.map((link, index) => {
                  const active = isLinkActive(pathname, link.href);
                  const Icon = link.icon;
                  const href = link.href === '/dashboard' && isAdmin ? '/admin' : link.href;
                  return (
                    <motion.div key={link.href} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: prefersReducedMotion ? 0 : 0.08 + index * 0.04, duration: 0.25 }}>
                      <Link href={href} aria-current={active ? 'page' : undefined}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 font-display text-lg transition ${focusRing} ${active ? 'bg-canvas font-bold text-ink shadow-sm' : 'text-ink hover:bg-sand/80'}`}
                      >
                        <Icon className="size-5 shrink-0" />
                        <span className="flex-1">{link.label}</span>
                        {link.badge && (
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${active ? 'bg-amber-400 text-ink' : 'bg-clay text-ink'}`}>{link.badge}</span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="my-5 h-px bg-line" />

              {/* Mobile auth section */}
              {isLoading && (
                <div className="flex items-center justify-center py-6">
                  <AuthSkeleton />
                </div>
              )}

              {!isLoading && isGuest && (
                <div className="flex flex-col gap-3">
                  <Link href="/login" className={`flex items-center justify-center rounded-2xl border border-line px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-sand ${focusRing}`}>Login</Link>
                  <Link href="/signup" className={`flex items-center justify-center gap-2 rounded-2xl bg-canvas px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-ink shadow-sm transition hover:bg-clay ${focusRing}`}>
                    Create Account <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}

              {!isLoading && !isGuest && (
                <div className="flex flex-col gap-1.5">
                  <div className="mb-2 flex items-center gap-3 rounded-2xl bg-sand/50 p-4">
                    <Avatar user={user} className="size-11" />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{user?.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{role}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link href="/admin" className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-amber-700 dark:text-amber-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 ${focusRing}`}>
                      <ShieldAlert className="size-5" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-medium text-rose-600 dark:text-rose-300 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 ${focusRing}`}>
                    <LogOut className="size-5" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp pinned at bottom */}
            <div className="shrink-0 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <a href="https://wa.me/523221002345" target="_blank" rel="noreferrer"
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-ink shadow-sm transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
              >
                <WhatsAppIcon className="size-5" /> Chat on WhatsApp
              </a>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}