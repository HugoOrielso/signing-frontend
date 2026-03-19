'use client';

interface Contract { status: string; }

export default function StatsBar({ contracts }: { contracts: Contract[] }) {
  const stats = [
    { label: 'Total',         value: contracts.length,
      accent: '#1a1a2e', bg: 'rgba(26,26,46,0.06)' },
    { label: 'Enviados',      value: contracts.filter(c => ['SENT','VIEWED'].includes(c.status)).length,
      accent: '#1d4ed8', bg: 'rgba(29,78,216,0.06)' },
    { label: 'Pend. firma',   value: contracts.filter(c => c.status === 'PARTIALLY_SIGNED').length,
      accent: '#b45309', bg: 'rgba(180,83,9,0.06)' },
    { label: 'Firmados',      value: contracts.filter(c => c.status === 'SIGNED').length,
      accent: '#065f46', bg: 'rgba(6,95,70,0.06)' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
      {stats.map(s => (
        <div key={s.label} className="rounded-xl p-4 border border-stone-200"
          style={{ background: s.bg }}>
          <p className="text-3xl font-bold"
            style={{ color: s.accent, fontFamily: 'Playfair Display, serif' }}>
            {s.value}
          </p>
          <p className="text-xs text-stone-400 mt-1 leading-tight">{s.label}</p>
        </div>
      ))}
    </div>
  );
}