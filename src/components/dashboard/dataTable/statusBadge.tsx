import { Badge } from '@/components/ui/common/badge';
import { cn } from '@/lib/utils';

export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_DOCUMENTS'
  | 'DOCUMENTS_UPLOADED'
  | 'PENDING_VERIFICATION'
  | 'READY_TO_SIGN'
  | 'SENT'
  | 'VIEWED'
  | 'OTP_PENDING'
  | 'OTP_VERIFIED'
  | 'PARTIALLY_SIGNED'
  | 'SIGNED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

type StatusConfig = {
  label: string;
  className: string;
};

const DEFAULT_STATUS_CONFIG: StatusConfig = {
  label: 'Desconocido',
  className: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100',
};

const STATUS_CONFIG: Record<ContractStatus, StatusConfig> = {
  DRAFT: {
    label: 'Borrador',
    className: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100',
  },
  PENDING_DOCUMENTS: {
    label: 'Faltan documentos',
    className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50',
  },
  DOCUMENTS_UPLOADED: {
    label: 'Documentos completos (Revisar)',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-50',
  },
  PENDING_VERIFICATION: {
    label: 'En validación',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50',
  },
  READY_TO_SIGN: {
    label: 'Listo para firma',
    className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50',
  },
  SENT: {
    label: 'Enviado',
    className: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50',
  },
  VIEWED: {
    label: 'Visto',
    className: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50',
  },
  OTP_PENDING: {
    label: 'OTP pendiente',
    className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  },
  OTP_VERIFIED: {
    label: 'OTP validado',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50',
  },
  PARTIALLY_SIGNED: {
    label: 'Firma parcial',
    className: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  },
  SIGNED: {
    label: 'Firmado',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  },
  REJECTED: {
    label: 'Rechazado',
    className: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50',
  },
  EXPIRED: {
    label: 'Expirado',
    className: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100',
  },
};

function isContractStatus(status: string): status is ContractStatus {
  return status in STATUS_CONFIG;
}

interface ContractStatusBadgeProps {
  status: string;
  className?: string;
}

export function ContractStatusBadge({
  status,
  className,
}: ContractStatusBadgeProps) {
  const cfg = isContractStatus(status)
    ? STATUS_CONFIG[status]
    : {
        ...DEFAULT_STATUS_CONFIG,
        label: status,
      };

  return (
    <Badge
      variant="outline"
      className={cn(
        'px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </Badge>
  );
}