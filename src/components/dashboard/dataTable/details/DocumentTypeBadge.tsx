import { cn } from "@/lib/utils"
import { FileText, CreditCard, Landmark, ReceiptText, ShieldCheck, ImageIcon } from "lucide-react"

type DocumentType =
  | "ID_FRONT"
  | "ID_BACK"
  | "SELFIE_WITH_ID"
  | "BANK_CERTIFICATE"
  | "PAYROLL_STUB"
  | "ADDITIONAL_DOCUMENT"

const DOCUMENT_TYPE_CONFIG: Record<
  DocumentType,
  {
    label: string
    icon: React.ReactNode
    className?: string
  }
> = {
  ID_FRONT: {
    label: "Cédula frontal",
    icon: <CreditCard className="h-3.5 w-3.5" />,
  },
  ID_BACK: {
    label: "Cédula respaldo",
    icon: <CreditCard className="h-3.5 w-3.5" />,
  },
  SELFIE_WITH_ID: {
    label: "Selfie con cédula",
    icon: <ImageIcon className="h-3.5 w-3.5" />,
  },
  BANK_CERTIFICATE: {
    label: "Certificado bancario",
    icon: <Landmark className="h-3.5 w-3.5" />,
  },
  PAYROLL_STUB: {
    label: "Comprobante de nómina",
    icon: <ReceiptText className="h-3.5 w-3.5" />,
  },
  ADDITIONAL_DOCUMENT: {
    label: "Documento adicional",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
}

function getFallback(type?: string) {
  if (!type) {
    return {
      label: "Documento",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
    }
  }

  return {
    label: type.replaceAll("_", " "),
    icon: <FileText className="h-3.5 w-3.5" />,
  }
}

export function resolveDocumentType(type?: string) {
  if (!type) return getFallback(type)

  return DOCUMENT_TYPE_CONFIG[type as DocumentType] ?? getFallback(type)
}

export function DocumentTypeBadge({
  type,
  className,
}: {
  type?: string
  className?: string
}) {
  const config = resolveDocumentType(type)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-foreground",
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  )
}