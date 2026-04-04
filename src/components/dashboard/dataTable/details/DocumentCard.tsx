import { useState } from "react"
import { fmtDate } from "@/lib/utils/libranzaHelper"
import { ContractDocumentItem } from "@/types/libranza"
import {
    CheckCircle2,
    FileText,
    ImageIcon,
    XCircle,
    Loader2,
} from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axiosClient"
import { getDocumentStatusUI } from "./StatusUi"
import { resolveDocumentType } from "./DocumentTypeBadge"

export function DocumentComplianceCard({
    doc,
    onPreview,
    onReviewed,
}: {
    doc: ContractDocumentItem
    onPreview: (url: string) => void
    onReviewed?: () => Promise<void> | void
}) {
    const statusUI = getDocumentStatusUI(doc.status)

    const [loading, setLoading] = useState(false)
    const [showReject, setShowReject] = useState(false)
    const [notes, setNotes] = useState("")

    const isPdf =
        doc.mimeType === "application/pdf" ||
        doc.fileUrl?.toLowerCase().endsWith(".pdf")

    async function handleApprove() {
        try {
            setLoading(true)

            await api.patch(`/contracts/documents/${doc.id}/review`, {
                status: "APPROVED",
            })

            toast.success("Documento aprobado")
            await onReviewed?.()
            setTimeout(() => {
                location.reload()
            }, 250)
        } catch (error) {
            console.error("approve document error:", error)
            toast.error("No se pudo aprobar el documento")
        } finally {
            setLoading(false)
        }
    }

    async function handleReject() {
        if (!notes.trim()) {
            toast.error("Debes agregar una nota")
            return
        }

        try {
            setLoading(true)

            await api.patch(`/contracts/documents/${doc.id}/review`, {
                status: "REJECTED",
                notes: notes.trim(),
            })

            toast.success("Documento rechazado")
            setShowReject(false)
            setNotes("")
            await onReviewed?.()
            setTimeout(() => {
                location.reload()
            }, 250)
        } catch (error) {
            console.error("reject document error:", error)
            toast.error("No se pudo rechazar el documento")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="rounded-2xl border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-xl border bg-muted/30 p-3">
                        {isPdf ? (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {resolveDocumentType(doc.type).label}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Documento requerido
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusUI.className}`}
                >
                    {statusUI.icon}
                    {statusUI.label}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                <div className="rounded-lg bg-muted/20 px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wide">
                        Tipo de archivo
                    </span>
                    <span className="font-medium text-foreground">
                        {doc.fileUrl ? (isPdf ? "PDF" : "Imagen") : "Sin archivo"}
                    </span>
                </div>

                <div className="rounded-lg bg-muted/20 px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wide">
                        Fecha de carga
                    </span>
                    <span className="font-medium text-foreground">
                        {doc.uploadedAt ? fmtDate(doc.uploadedAt.toString()) : "—"}
                    </span>
                </div>

                <div className="col-span-full rounded-lg bg-muted/20 px-3 py-2">
                    <span className="block text-[10px] uppercase tracking-wide">
                        URL
                    </span>
                    <span className="block truncate font-medium text-foreground">
                        {doc.fileUrl ?? "—"}
                    </span>
                </div>
            </div>

            {doc.notes && (
                <div className="mt-3 rounded-xl border border-dashed bg-muted/10 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">Notas:</span>{" "}
                        {doc.notes}
                    </p>
                </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
                {doc.fileUrl ? (
                    isPdf ? (
                        <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            Abrir PDF
                        </a>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onPreview(doc.fileUrl!)}
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs hover:bg-muted"
                        >
                            <ImageIcon className="h-3.5 w-3.5" />
                            Previsualizar
                        </button>
                    )
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Sin archivo cargado
                    </span>
                )}
            </div>

            {doc.fileUrl && doc.status !== "APPROVED" && (
                <div className="mt-4 border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleApprove}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-3 w-3" />
                            )}
                            Aprobar
                        </button>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => setShowReject((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs disabled:opacity-50 cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                        >
                            <XCircle className="h-3 w-3" />
                            Rechazar
                        </button>
                    </div>

                    {showReject && (
                        <div className="mt-3 space-y-2">
                            <textarea
                                placeholder="Motivo del rechazo..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full rounded-lg border p-2 text-xs"
                                rows={3}
                            />

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={loading || !notes.trim()}
                                className="w-full rounded-lg bg-red-600 py-2 text-xs text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="mx-auto h-3 w-3 animate-spin" />
                                ) : (
                                    "Confirmar rechazo"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

