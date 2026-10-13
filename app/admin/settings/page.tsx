// app/admin/settings/page.tsx
// Basic site settings. Stored server-side.

import { Settings, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-canvas px-6 py-5 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Admin / Settings</p>
        <h1 className="mt-0.5 font-display text-2xl font-bold text-ink">Settings</h1>
      </header>
      <main className="px-6 py-6 lg:px-8">
        <form className="mx-auto max-w-xl space-y-6">
          <div className="rounded-2xl border border-line bg-canvas p-6 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Settings className="size-5" /> Site Settings
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Site Name</label>
              <input defaultValue="PV Property Finder"
                className="w-full rounded-xl border border-line bg-sand/30 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-clay focus:bg-canvas transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Contact WhatsApp Number</label>
              <input defaultValue="523221002345" type="tel"
                className="w-full rounded-xl border border-line bg-sand/30 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-clay focus:bg-canvas transition"
              />
              <p className="mt-1 text-[11px] text-muted">Include country code, no spaces (e.g. 523221002345)</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">Default Currency</label>
              <select defaultValue="USD" className="w-full rounded-xl border border-line bg-sand/30 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-clay focus:bg-canvas transition">
                <option value="USD">USD – US Dollar</option>
                <option value="MXN">MXN – Mexican Peso</option>
                <option value="CAD">CAD – Canadian Dollar</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary text-sm px-5 py-2.5 gap-1.5">
            <Save className="size-4" /> Save Settings
          </button>
        </form>
      </main>
    </div>
  );
}
