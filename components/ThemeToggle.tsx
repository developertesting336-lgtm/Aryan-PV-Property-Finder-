'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

export default function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Placeholder while rendering on the server to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="size-10 shrink-0 rounded-full border border-line bg-canvas/80 animate-pulse" />
    );
  }

  // Determine actual current visual mode (resolving 'system' to actual)
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`group relative flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-canvas/80 shadow-sm transition hover:border-clay hover:bg-sand/60 ${focusRing}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <Sun className="size-[18px] text-ink transition-transform group-hover:scale-110" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute"
          >
            <Moon className="size-[18px] text-ink transition-transform group-hover:scale-110" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
