import { CheckCircle2, Clock3, XCircle } from "lucide-react"

export function getDocumentStatusUI(status?: string) {
  switch (status) {
    case "APPROVED":
      return {
        label: "Aprobado",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: <CheckCircle2 className="h-4 w-4" />,
      }
    case "REJECTED":
      return {
        label: "Rechazado",
        className: "border-red-200 bg-red-50 text-red-700",
        icon: <XCircle className="h-4 w-4" />,
      }
    default:
      return {
        label: "Pendiente",
        className: "border-amber-200 bg-amber-50 text-amber-700",
        icon: <Clock3 className="h-4 w-4" />,
      }
  }
}