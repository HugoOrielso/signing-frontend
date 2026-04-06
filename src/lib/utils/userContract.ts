import { ContractStatus } from "@/types/libranza";
import {
    CheckCircle,
    Clock,
    Eye,
    FileText,
    FolderOpen,
    PenLine,
    Send,
    XCircle,
} from "lucide-react";

export const TOTAL_STEPS = 11;

export type StatusMeta = {
    label: string;
    description: string;
    step: number;
    icon: React.ElementType;
    className: string;
    cardClassName?: string;
    progressClassName?: string;
    action?: {
        label: string;
        href: (token: string) => string;
        variant: "primary" | "secondary";
        icon: React.ElementType;
    };
};

export const STATUS_META: Record<ContractStatus, StatusMeta> = {
  DRAFT: {
    label: "Borrador",
    description: "Tu contrato está siendo preparado por el asesor.",
    step: 1,
    icon: FileText,
    className: "border-slate-200 bg-slate-50 text-slate-600",
    cardClassName: "border-slate-200 bg-slate-50",
    progressClassName: "bg-slate-400",
    action: {
      label: "Subir documentos",
      href: (token) => `/users/contracts/upload-documents/${token}`,
      variant: "primary",
      icon: FolderOpen,
    },
  },

  PENDING_DOCUMENTS: {
    label: "Documentos pendientes",
    description: "Necesitas subir los documentos requeridos para continuar.",
    step: 2,
    icon: FolderOpen,
    className: "border-amber-200 bg-amber-50 text-amber-700",
    cardClassName: "border-amber-200 bg-amber-50",
    progressClassName: "bg-amber-500",
    action: {
      label: "Subir documentos",
      href: (token) => `/users/contracts/upload-documents/${token}`,
      variant: "primary",
      icon: FolderOpen,
    },
  },

  DOCUMENTS_UPLOADED: {
    label: "Documentos enviados",
    description: "Tus documentos fueron recibidos y están en revisión.",
    step: 3,
    icon: CheckCircle,
    className: "border-blue-200 bg-blue-50 text-blue-700",
    cardClassName: "border-blue-200 bg-blue-50",
    progressClassName: "bg-blue-500",
  },

  PENDING_VERIFICATION: {
    label: "En verificación",
    description: "Estamos validando tu información.",
    step: 4,
    icon: Clock,
    className: "border-sky-200 bg-sky-50 text-sky-700",
    cardClassName: "border-sky-200 bg-sky-50",
    progressClassName: "bg-sky-500",
  },

  READY_TO_SIGN: {
    label: "Listo para firmar",
    description: "Tu contrato está listo para firmar.",
    step: 5,
    icon: PenLine,
    className: "border-green-200 bg-green-50 text-green-700",
    cardClassName: "border-green-200 bg-green-50",
    progressClassName: "bg-green-500",
    action: {
      label: "Firmar contrato",
      href: (token) => `/users/contracts/sign/${token}`,
      variant: "primary",
      icon: PenLine,
    },
  },

  SENT: {
    label: "Enviado",
    description: "Te enviamos el contrato.",
    step: 6,
    icon: Send,
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cardClassName: "border-indigo-200 bg-indigo-50",
    progressClassName: "bg-indigo-500",
  },

  VIEWED: {
    label: "Visto",
    description: "Has abierto el contrato.",
    step: 7,
    icon: Eye,
    className: "border-violet-200 bg-violet-50 text-violet-700",
    cardClassName: "border-violet-200 bg-violet-50",
    progressClassName: "bg-violet-500",
  },

  OTP_PENDING: {
    label: "Verificación pendiente",
    description: "Confirma tu identidad.",
    step: 8,
    icon: Clock,
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    cardClassName: "border-yellow-200 bg-yellow-50",
    progressClassName: "bg-yellow-500",
  },

  OTP_VERIFIED: {
    label: "Verificado",
    description: "Identidad confirmada.",
    step: 9,
    icon: CheckCircle,
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
    cardClassName: "border-cyan-200 bg-cyan-50",
    progressClassName: "bg-cyan-500",
  },

  PARTIALLY_SIGNED: {
    label: "Firma parcial",
    description: "Faltan firmas.",
    step: 10,
    icon: PenLine,
    className: "border-orange-200 bg-orange-50 text-orange-700",
    cardClassName: "border-orange-200 bg-orange-50",
    progressClassName: "bg-orange-500",
  },

  SIGNED: {
    label: "Firmado",
    description: "Contrato completado.",
    step: TOTAL_STEPS, // 👈 SIEMPRE 11
    icon: CheckCircle,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    cardClassName: "border-emerald-300 bg-emerald-100",
    progressClassName: "bg-emerald-600",
  },

  // estados fuera del flujo 👇

  REJECTED: {
    label: "Rechazado",
    description: "Contrato rechazado.",
    step: 0,
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700",
    cardClassName: "border-red-200 bg-red-50",
    progressClassName: "bg-red-500",
  },

  EXPIRED: {
    label: "Expirado",
    description: "Contrato expirado.",
    step: 0,
    icon: Clock,
    className: "border-rose-200 bg-rose-50 text-rose-700",
    cardClassName: "border-rose-200 bg-rose-50",
    progressClassName: "bg-rose-500",
  },

  CANCELLED: {
    label: "Cancelado",
    description: "Contrato cancelado.",
    step: 0,
    icon: XCircle,
    className: "border-slate-200 bg-slate-50 text-slate-500",
    cardClassName: "border-slate-200 bg-slate-50",
    progressClassName: "bg-slate-400",
  },
};

export const DEFAULT_STATUS_META: StatusMeta = {
    label: "Desconocido",
    description: "Estado no reconocido.",
    step: 0,
    icon: FileText,
    className: "border-slate-200 bg-slate-50 text-slate-600",
    cardClassName: "border-slate-200 bg-slate-50",
    progressClassName: "bg-slate-400",
};