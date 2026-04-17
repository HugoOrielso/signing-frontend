export function PagareStatusLoader() {
  return (
    <div className="rounded-2xl border border-border-soft bg-white shadow-sm overflow-hidden">
      <div className="h-1 bg-linear-to-r from-gold to-gold-dark" />

      <div className="px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <svg
              className="h-6 w-6 animate-spin text-gold"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>

          <div>
            <h3 className="m-0 font-serif text-[18px] text-ink">
              Validando estado del pagaré
            </h3>
            <p className="mt-1 mb-0 text-[13px] text-muted">
              Estamos verificando si este documento ya fue firmado.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="h-4 w-2/5 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}