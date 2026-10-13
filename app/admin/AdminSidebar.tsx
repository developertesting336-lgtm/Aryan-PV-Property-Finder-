'use client';

// app/admin/AdminSidebar.tsx
// The left sidebar for the admin area.
// Fixed on desktop, slides in on mobile.
// Uses Framer Motion for the animated active-link indicator.

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Building2, Users, MessageSquare,
  DollarSign, Settings, LogOut, Menu, X, ExternalLink,
  ListChecks, Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Properties', href: '/admin/properties', icon: Building2 },
  { label: 'Offers', href: '/admin/offers', icon: DollarSign },
  { label: 'Leads', href: '/admin/leads', icon: MessageSquare },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Queues', href: '/admin/queues', icon: Activity },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

function SidebarContent({ adminName, adminEmail, onClose }: { adminName: string; adminEmail: string; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/');

  const handleLogout = async () => {
    onClose?.();
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo area */}
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-canvas shadow-sm">
          <span className="font-display text-lg font-bold text-ink">PV</span>
        </div>
        <div>
          <span className="font-display text-base font-bold text-ink">Admin Panel</span>
          <p className="text-[10px] text-muted">PV Property Finder</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto rounded-lg p-1.5 hover:bg-sand" aria-label="Close sidebar">
            <X className="size-4 text-muted" />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  active ? 'text-ink' : 'text-muted hover:bg-sand hover:text-ink'
                }`}
              >
                {/* Animated active background pill */}
                {active && (
                  <motion.span
                    layoutId="admin-active-nav"
                    className="absolute inset-0 rounded-xl bg-canvas/8 ring-1 ring-ocean/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon className={`relative z-10 size-4 shrink-0 ${active ? 'text-ink' : 'text-muted group-hover:text-ink'}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="my-4 h-px bg-line" />

        {/* View public site link */}
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-sand hover:text-ink"
        >
          <ExternalLink className="size-4 shrink-0" />
          <span>View Public Site</span>
        </a>
      </nav>

      {/* Admin info + Logout at the bottom */}
      <div className="border-t border-line p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-sand/60 px-3 py-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-canvas text-[10px] font-bold text-ink">
            {adminName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-ink">{adminName}</p>
            <p className="truncate text-[10px] text-muted">{adminEmail}</p>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted">Theme</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut className="size-4" /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ adminName, adminEmail }: { adminName: string; adminEmail: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex size-10 items-center justify-center rounded-xl border border-line bg-canvas shadow-sm lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5 text-ink" />
      </button>

      {/* Desktop sidebar: always visible */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-line bg-canvas lg:flex lg:flex-col">
        <SidebarContent adminName={adminName} adminEmail={adminEmail} />
      </aside>

      {/* Mobile sidebar: slides in */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-canvas shadow-2xl lg:hidden"
            >
              <SidebarContent adminName={adminName} adminEmail={adminEmail} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
