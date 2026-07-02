const SKELETONS = Array.from({ length: 6 })

export const TripListSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {SKELETONS.map((_, i) => (
      <div
        key={i}
        className="h-36 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50"
      >
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-40 rounded bg-neutral-200" />
        <div className="mt-8 h-3 w-48 rounded bg-neutral-100" />
      </div>
    ))}
  </div>
)
