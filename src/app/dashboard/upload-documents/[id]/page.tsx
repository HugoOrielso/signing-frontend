"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axiosClient";
import { DocumentBlock } from "@/components/dashboard/Libranza/DocumentBlock";
import { ContractDocumentItem, DocType, UploadState } from "@/types/libranza";
import { BackgroundSurface } from "@/components/common/backgroudDecor";
import { PreviewModal } from "@/components/common/PreviewImages";

const DOC_CONFIG: {
  type: DocType;
  label: string;
  required: boolean;
}[] = [
    { type: "ID_FRONT", label: "Cédula frontal", required: true },
    { type: "ID_BACK", label: "Cédula trasera", required: true },
    { type: "SELFIE_WITH_ID", label: "Selfie con documento", required: true },
    { type: "BANK_CERTIFICATE", label: "Certificado bancario", required: true },
    { type: "PAYROLL_STUB", label: "Comprobante de nómina", required: true },
    { type: "ADDITIONAL_DOCUMENT", label: "Documento adicional", required: false },
  ];

export default function LibranzaUploadDocuments() {
  const params = useParams();
  const token = params?.id as string;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<DocType, UploadState>>({
    ID_FRONT: { file: null, preview: null, loading: false, status: null, notes: "" },
    ID_BACK: { file: null, preview: null, loading: false, status: null, notes: "" },
    SELFIE_WITH_ID: { file: null, preview: null, loading: false, status: null, notes: "" },
    BANK_CERTIFICATE: { file: null, preview: null, loading: false, status: null, notes: "" },
    PAYROLL_STUB: { file: null, preview: null, loading: false, status: null, notes: "" },
    ADDITIONAL_DOCUMENT: { file: null, preview: null, loading: false, status: null, notes: "" },
  });

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const loadDocs = async () => {
      try {
        const { data } = await api.get(`/contracts/contract/${token}/documents`);
        const serverDocs = data?.data as Record<DocType, ContractDocumentItem>;

        if (!isMounted) return;

        setDocs((prev) => {
          let hasChanges = false;
          const updated = { ...prev };

          Object.keys(serverDocs || {}).forEach((key) => {
            const doc = serverDocs[key as DocType];
            if (!doc) return;

            const prevDoc = prev[key as DocType];

            const newDoc = {
              ...prevDoc,
              uploaded: !!doc.fileUrl,
              uploadedUrl: doc.fileUrl ?? null,
              preview: doc.fileUrl ?? null,
              mimeType: doc.mimeType ?? null,
              status: doc.status ?? null,
              notes: doc.notes ?? '',
            };

            // 🔥 solo actualiza si cambió algo
            if (JSON.stringify(prevDoc) !== JSON.stringify(newDoc)) {
              updated[key as DocType] = newDoc;
              hasChanges = true;
            }
          });

          return hasChanges ? updated : prev;
        });
      } catch (error) {
        console.error(error);
      }
    };

    // 🔥 primera carga inmediata
    loadDocs();

    // 🔥 polling cada 10s
    const interval = setInterval(() => {
      loadDocs();
    }, 10000);

    // cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token]);

  const handleFileChange = (type: DocType, file: File | null) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setDocs((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        file,
        preview,
        mimeType: file.type || null,
        uploaded: false,
        uploadedUrl: null,
      },
    }));
  };

  const uploadDocument = async (type: DocType) => {
    const doc = docs[type];

    if (!doc.file) {
      toast.error("Selecciona un archivo");
      return;
    }

    try {
      setDocs((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: true },
      }));

      const formData = new FormData();
      formData.append("file", doc.file);
      formData.append("type", type);

      const res = await api.post(
        `/contracts/public/${token}/upload-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedDoc = res.data?.document;
      const url = uploadedDoc?.url ?? doc.preview ?? null;
      const mimeType = uploadedDoc?.mimeType ?? doc.file.type ?? null;

      setDocs((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          uploaded: true,
          uploadedUrl: url,
          preview: url,
          mimeType,
        },
      }));

      toast.success("Documento subido");
      setTimeout(() => {
        location.reload()
      }, 300)
    } catch {
      toast.error("Error subiendo documento");
      setDocs((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
    }
  };

  const handleUpdateDocument = async (type: DocType, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", type);

    try {
      await api.patch(`/contracts/public/${token}/edit-document`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Documento actualizado");
    } catch (error) { 
      console.log(error)
    }

  };

  return (
    <div className="relative bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
      <BackgroundSurface />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs font-medium text-blue-700 shadow-sm">
            Proceso seguro
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Verifica tu identidad
          </h1>

          <p className="text-sm text-slate-600 max-w-md mx-auto leading-6">
            Sube los documentos requeridos para validar tu información y continuar con el proceso de tu contrato.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_CONFIG.map((doc) => (
            <DocumentBlock
              key={doc.type}
              label={doc.label}
              type={doc.type}
              doc={docs[doc.type]}
              onChange={handleFileChange}
              onUpload={uploadDocument}
              required={doc.required}
              onPreview={setPreviewUrl}
              onUpdateDocument={handleUpdateDocument}
            />
          ))}
        </div>

      </div>
      <PreviewModal
        previewUrl={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  );
}


