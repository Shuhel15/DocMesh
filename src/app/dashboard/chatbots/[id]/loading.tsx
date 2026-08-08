export default function Loading() {
  return (
    <main className="min-h-screen bg-background pt-24 sm:pt-28 pb-10 sm:pb-12">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-9 w-64 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-muted" />
          </div>

          <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
        </div>

        {/* Overview */}
        <section className="mt-8">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-muted" />

                <div>
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-10 w-16 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-4 w-56 animate-pulse rounded bg-muted" />
                </div>
              </div>

              <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </section>

        {/* Chatbots */}
        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <div>
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                <div className="mt-4 h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}