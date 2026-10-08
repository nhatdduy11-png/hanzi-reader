export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-2/3 max-w-sm animate-pulse rounded-full bg-muted" />
      <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-3xl bg-muted" />
        <div className="h-28 animate-pulse rounded-3xl bg-muted" />
      </div>
    </div>
  )
}
