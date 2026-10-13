export default function Loading() {
  return (
    <div className="container-wide py-12">
      <div className="mb-8">
        <div className="h-10 w-48 rounded-xl bg-sand animate-pulse mb-4" />
        <div className="h-6 w-96 rounded-lg bg-sand animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-line bg-canvas p-4 shadow-sm">
            <div className="aspect-[16/10] w-full rounded-2xl bg-sand animate-pulse mb-4" />
            <div className="h-6 w-1/3 rounded bg-sand animate-pulse mb-3" />
            <div className="h-8 w-3/4 rounded bg-sand animate-pulse mb-4" />
            <div className="h-4 w-1/2 rounded bg-sand animate-pulse mb-6" />
            <div className="flex gap-2">
              <div className="h-10 flex-1 rounded-xl bg-sand animate-pulse" />
              <div className="h-10 w-10 rounded-xl bg-sand animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
