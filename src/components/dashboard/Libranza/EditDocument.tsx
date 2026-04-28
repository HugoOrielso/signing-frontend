"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { DocType } from "@/types/libranza";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    label: string;
    type: DocType;
    loading?: boolean;
    onClose: () => void;
    onConfirm: (type: DocType, file: File) => Promise<void> | void;
};

export function EditDocumentModal({
    open,
    label,
    type,
    loading = false,
    onClose,
    onConfirm,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    const handleClose = () => {
        if (loading) return;
        setFile(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!file) return;

        await onConfirm(type, file);
        setFile(null);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="relative z-10000 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Editar documento
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Vas a reemplazar el documento:{" "}
                            <span className="font-medium text-gray-800">{label}</span>
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-xs font-medium text-amber-700">
                        Al editar este documento, volverá a quedar pendiente de revisión.
                    </p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    disabled={loading}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={loading}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-700 transition hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer "
                >
                    {file ? (
                        <>
                            <FileText size={16} />
                            <span className="max-w-62.5 truncate">{file.name}</span>
                        </>
                    ) : (
                        <>
                            <Upload size={16} />
                            Seleccionar nuevo archivo
                        </>
                    )}
                </button>

                <div className="mt-5 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            "Sí, editar"
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}