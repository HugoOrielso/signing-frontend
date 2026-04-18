import { Skeleton } from "@/components/ui/common/skeleton"; // si no tienes, te dejo fallback abajo

export default function Page() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* HEADER */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      {/* CARDS / KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[26px] border border-slate-200/80 bg-white/80 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>

            <Skeleton className="mt-4 h-3 w-full rounded-lg" />
            <Skeleton className="mt-2 h-3 w-3/4 rounded-lg" />
          </div>
        ))}
      </div>

      {/* TABLA / LISTADO */}
      <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40 rounded-lg" />
                  <Skeleton className="h-3 w-28 rounded-lg" />
                </div>
              </div>

              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}