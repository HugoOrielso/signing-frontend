const CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  DRAFT:            { label: 'Borrador',         dot: '#9ca3af', text: '#6b7280', bg: '#f3f4f6' },
  SENT:             { label: 'Enviado',           dot: '#3b82f6', text: '#1e40af', bg: '#eff6ff' },
  VIEWED:           { label: 'Visto',             dot: '#f59e0b', text: '#92400e', bg: '#fef3c7' },
  PENDING_SIGN:     { label: 'Pend. firma',       dot: '#f59e0b', text: '#92400e', bg: '#fef3c7' },
  PARTIALLY_SIGNED: { label: 'Firma parcial',     dot: '#8b5cf6', text: '#5b21b6', bg: '#f5f3ff' },
  SIGNED:           { label: 'Firmado ✓',         dot: '#10b981', text: '#065f46', bg: '#ecfdf5' },
  EXPIRED:          { label: 'Expirado',          dot: '#ef4444', text: '#991b1b', bg: '#fef2f2' },
  CANCELLED:        { label: 'Cancelado',         dot: '#ef4444', text: '#991b1b', bg: '#fef2f2' },
  PENDING_CREATOR:  { label: 'Pend. creador',     dot: '#f59e0b', text: '#92400e', bg: '#fef3c7' },
  PENDING_RECEIVER: { label: 'Pend. receptor',    dot: '#3b82f6', text: '#1e40af', bg: '#eff6ff' },
  COMPLETED:        { label: 'Completado ✓',      dot: '#10b981', text: '#065f46', bg: '#ecfdf5' },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = CONFIG[status] ?? { label: status, dot: '#9ca3af', text: '#6b7280', bg: '#f3f4f6' };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}