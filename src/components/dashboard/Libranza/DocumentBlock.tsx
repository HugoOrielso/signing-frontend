"use client";

import { useRef, useState } from "react";
import {
  Loader2,
  Upload,
  CheckCircle,
  FileText,
  ImageIcon,
  X,
  Dot,
  Pencil,
} from "lucide-react";
import { DocType, DocumentStatus, UploadState } from "@/types/libranza";
import { getDocumentBlockFlags } from "@/lib/utils/reviewDocuments";
import { useSessionStore } from "@/store/adminSession";
import Image from "next/image";
import { EditDocumentModal } from "./EditDocument";

type Props = {
  label: string;
  type: DocType;
  doc: UploadState;
  required?: boolean;
  onChange: (type: DocType, file: File | null) => void;
  onUpload: (type: DocType) => void;
  onPreview: (url: string) => void;
  onUpdateDocument?: (type: DocType, file: File) => Promise<void> | void;
};

export function DocumentBlock({
  label,
  type,
  doc,
  required = false,
  onChange,
  onUpload,
  onPreview,
  onUpdateDocument,
}: Props) {
  const user = useSessionStore((state) => state.user);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const flags = getDocumentBlockFlags(doc.status);

  const hasSelectedFile = !!doc.file;
  const hasRemoteFile = !!doc.uploadedUrl;
console.log(doc)
  const previewUrl = doc.preview || doc.uploadedUrl || null;

  const isImage =
    !!previewUrl && (!!doc.mimeType ? doc.mimeType.startsWith("image/") : false);

  const isPdf =
    doc.mimeType === "application/pdf" ||
    (!!previewUrl && previewUrl.toLowerCase().endsWith(".pdf"));

  const canUpload =
    hasSelectedFile &&
    !doc.loading &&
    (flags.isRejected ||
      (!hasRemoteFile && !doc.status) ||
      (!hasRemoteFile && flags.isPending === false && flags.isApproved === false));

  const canEditDocument = (user?.role === "CREDIT_ANALYST" || user?.role === "ADMIN") && hasRemoteFile && !doc.loading;

  const triggerFilePicker = () => {
    inputRef.current?.click();
  };

  const handleConfirmEdit = async (type: DocType, file: File) => {
    if(onUpdateDocument){
      await onUpdateDocument(type, file);
      setEditModalOpen(false);
    }
  };

  return (
    <>
      <div
        className={`space-y-3 rounded-2xl border p-4 shadow-sm ${getCardStyles(
          doc.status
        )}`}
      >
        {canEditDocument && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Pencil size={14} />
              Editar documento
            </button>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </p>
          </div>

          {flags.isApproved && (
            <span className="flex items-center gap-1 rounded border-emerald-200 bg-emerald-100 p-1 text-xs font-medium text-emerald-700">
              <CheckCircle size={16} />
              Aprobado
            </span>
          )}

          {flags.isRejected && (
            <span className="flex items-center gap-1 rounded border-red-200 bg-red-100 p-1 text-xs font-medium text-red-700">
              <X size={16} />
              Rechazado
            </span>
          )}

          {flags.isPending && (
            <span className="flex items-center gap-1 rounded border-yellow-200 bg-yellow-100 p-1 text-xs font-medium text-yellow-700">
              <Dot size={16} />
              En revisión
            </span>
          )}
        </div>

        {flags.canShowRejectedMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-xs font-medium text-red-700">
              Documento rechazado. Debes volver a subirlo.
            </p>

            {doc.notes ? (
              <p className="mt-1 text-xs text-red-600">Motivo: {doc.notes}</p>
            ) : null}
          </div>
        )}

        {flags.canShowPendingMessage && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
            <p className="text-xs font-medium text-amber-700">
              Documento en revisión.
            </p>
          </div>
        )}

        <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
          {previewUrl ? (
            isPdf ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                <FileText size={16} />
                Ver PDF
              </a>
            ) : isImage ? (
              <div className="relative h-full w-full">
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  onClick={() => onPreview(previewUrl)}
                  className="cursor-pointer object-contain"
                />
              </div>
            ) : (
              <span className="text-xs text-gray-500">Archivo cargado</span>
            )
          ) : (
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <ImageIcon className="mb-2 h-6 w-6 text-gray-300" />
              <span className="text-xs text-gray-400">Sin archivo</span>
            </div>
          )}
        </div>

        {flags.canUploadNewFile && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => onChange(type, e.target.files?.[0] ?? null)}
              disabled={doc.loading || !flags.canPickFile}
              className="hidden"
            />

            <button
              type="button"
              onClick={triggerFilePicker}
              disabled={doc.loading || !flags.canPickFile}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {doc.file ? (
                <>
                  <CheckCircle size={16} />
                  <span className="max-w-50 truncate">{doc.file.name}</span>
                </>
              ) : flags.canReplaceFile ? (
                <>
                  <Upload size={16} />
                  Seleccionar nuevo archivo
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Seleccionar archivo
                </>
              )}
            </button>
          </>
        )}

        {flags.canUploadNewFile && (
          <button
            type="button"
            onClick={() => onUpload(type)}
            disabled={!canUpload}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition ${
              doc.loading
                ? "bg-gray-200 text-gray-600"
                : !canUpload
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : flags.isRejected
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-black text-white hover:opacity-90"
            }`}
          >
            {doc.loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Subiendo...
              </>
            ) : flags.isRejected ? (
              <>
                <Upload size={16} />
                Actualizar documento
              </>
            ) : (
              <>
                <Upload size={16} />
                Subir documento
              </>
            )}
          </button>
        )}
      </div>

      <EditDocumentModal
        open={editModalOpen}
        label={label}
        type={type}
        loading={doc.loading}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleConfirmEdit}
      />
    </>
  );
}

function getCardStyles(status?: DocumentStatus | null) {
  switch (status) {
    case "APPROVED":
      return "border-emerald-200 bg-emerald-50";
    case "REJECTED":
      return "border-red-200 bg-red-50";
    case "PENDING":
      return "border-amber-200 bg-amber-50";
    default:
      return "border-gray-200 bg-white";
  }
}