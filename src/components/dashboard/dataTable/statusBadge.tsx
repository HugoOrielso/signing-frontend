import { Badge } from '@/components/ui/common/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  SIGNED: {
    label: 'Firmado',
    className:
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  },
  PARTIALLY_SIGNED: {
    label: 'Parcial',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  },
  PENDING_SIGN: {
    label: 'Pendiente',
    className:
      'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  },
  SENT: {
    label: 'Enviado',
    className:
      'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  },
  VIEWED: {
    label: 'Visto',
    className:
      'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50',
  },
  EXPIRED: {
    label: 'Expirado',
    className:
      'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
  },
  CANCELLED: {
    label: 'Cancelado',
    className:
      'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100',
  },
};

interface ContractStatusBadgeProps {
  status: string;
  className?: string;
}

export function ContractStatusBadge({ status, className }: ContractStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <Badge
      variant="outline"
      className={cn('text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider', cfg.className, className)}
    >
      {cfg.label}
    </Badge>
  );
}


