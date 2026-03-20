'use client';

interface Contract {
  status: string;
}

export default function StatsBar({ contracts }: { contracts: Contract[] }) {
  const stats = [
    {
      label: 'Total',
      value: contracts.length,
      accent: 'text-[#1a1a2e]',
      bg: 'bg-[#1a1a2e]/5',
    },
    {
      label: 'Enviados',
      value: contracts.filter(c => ['SENT', 'VIEWED'].includes(c.status)).length,
      accent: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    {
      label: 'Pend. firma',
      value: contracts.filter(c => c.status === 'PARTIALLY_SIGNED').length,
      accent: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      label: 'Firmados',
      value: contracts.filter(c => c.status === 'SIGNED').length,
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border border-stone-200 p-5 shadow-sm ${s.bg}`}
        >
          <p
            className={`text-3xl font-bold ${s.accent}`}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {s.value}
          </p>

          <p className="text-xs text-stone-500 mt-1 tracking-wide">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}