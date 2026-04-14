"use client";

import api from "@/lib/axiosClient";
import { FileText, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    contractId: string;
    onSuccess?: () => void;
}

export function ContractFinalReviewCard({
    contractId
}: Props) {
    const [loading, setLoading] = useState<"APPROVED" | "REJECTED" | null>(null);
    const [openRejectModal, setOpenRejectModal] = useState(false);
    const [rejectNotes, setRejectNotes] = useState("");

    const closeRejectModal = () => {
        if (loading === "REJECTED") return;
        setOpenRejectModal(false);
        setRejectNotes("");
    };

    const handleApprove = async () => {
        try {
            setLoading("APPROVED");

            await api.patch(`/contracts/contract/${contractId}/review`, {
                decision: "APPROVED",
            });

            toast.success("Datos aprobados correctamente");
            setTimeout(() => {
                location.reload()
            }, 300)
        } catch {
            toast.error("Error al aprobar los datos");
        } finally {
            setLoading(null);
        }
    };

    const handleReject = async () => {
        if (!rejectNotes.trim()) {
            toast.error("Debes indicar el motivo del rechazo");
            return;
        }

        try {
            setLoading("REJECTED");

            await api.patch(`/contracts/contract/${contractId}/review`, {
                decision: "REJECTED",
                notes: rejectNotes.trim(),
            });

            toast.success("Solicitud rechazada correctamente");
            setOpenRejectModal(false);
            setRejectNotes("");
            setTimeout(() => {
                location.reload()
            }, 300)
        } catch {
            toast.error("Error al rechazar los datos");
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            <div className="mt-4">
                <div className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>

                        <div>
                            <h3 className="text-base font-semibold text-blue-900">
                                Revisión final del expediente
                            </h3>

                            <p className="mt-1 text-sm text-blue-900/80">
                                Los documentos ya fueron verificados correctamente.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-blue-100 bg-white/70 p-4">
                        <p className="text-sm text-slate-700">
                            Ahora es necesario revisar los datos generales del usuario para
                            validar que toda la información sea correcta antes de continuar.
                        </p>

                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                            <li>Verifica nombre completo y documento</li>
                            <li>Confirma datos de contacto</li>
                            <li>Revisa información laboral y financiera</li>
                        </ul>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => setOpenRejectModal(true)}
                            disabled={loading !== null}
                            className="flex-1 cursor-pointer rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Rechazar solicitud
                        </button>

                        <button
                            type="button"
                            onClick={handleApprove}
                            disabled={loading !== null}
                            className="flex-1 cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading === "APPROVED" ? "Aprobando..." : "Aprobar y continuar"}
                        </button>
                    </div>
                </div>
            </div>

            {openRejectModal && (
                <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-red-100 p-2">
                                    <TriangleAlert className="h-5 w-5 text-red-600" />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Rechazar datos del usuario
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Indica claramente el motivo para que la libranza pueda ser
                                        corregida.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeRejectModal}
                                disabled={loading === "REJECTED"}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="rejectNotes"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Motivo del rechazo
                            </label>

                            <textarea
                                id="rejectNotes"
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                rows={5}
                                placeholder="Ej: El número de documento no coincide con la información registrada..."
                                disabled={loading === "REJECTED"}
                                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50"
                            />
                        </div>

                        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeRejectModal}
                                disabled={loading === "REJECTED"}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={loading === "REJECTED"}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50 cursor-pointer"
                            >
                                {loading === "REJECTED" ? "Rechazando..." : "Confirmar rechazo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}