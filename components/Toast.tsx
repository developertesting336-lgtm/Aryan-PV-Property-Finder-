'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../stores/useToastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start justify-between rounded-2xl border border-line/80 bg-sand/95 p-4 shadow-2xl backdrop-blur-xl animate-slideDown"
        >
          <div className="flex items-start space-x-3">
            {toast.type === 'success' && (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            )}
            {toast.type === 'warning' && (
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold text-ink">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] text-muted mt-0.5 leading-snug">
                  {toast.message}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-ink transition p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
