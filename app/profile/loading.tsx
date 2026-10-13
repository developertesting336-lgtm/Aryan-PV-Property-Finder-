export default function Loading() {
  return (
    <div className="container-wide py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="size-16 rounded-full bg-sand animate-pulse" />
        <div>
          <div className="h-8 w-48 rounded-lg bg-sand animate-pulse mb-2" />
          <div className="h-4 w-32 rounded bg-sand animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border border-line bg-canvas p-6 shadow-sm">
            <div className="h-4 w-24 rounded bg-sand animate-pulse mb-4" />
            <div className="h-10 w-16 rounded-lg bg-sand animate-pulse" />
          </div>
        ))}
      </div>
      
      <div className="rounded-3xl border border-line bg-canvas p-6 shadow-sm h-64">
        <div className="h-6 w-48 rounded bg-sand animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-12 w-full rounded-xl bg-sand animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-sand animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-sand animate-pulse" />
        </div>
      </div>
    </div>
  );
}
