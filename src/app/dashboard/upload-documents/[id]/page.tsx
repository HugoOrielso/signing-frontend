"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axiosClient";
import { DocumentBlock } from "@/components/dashboard/Libranza/DocumentBlock";
import { ContractDocumentItem, DocType, UploadState } from "@/types/libranza";

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

    const loadDocs = async () => {
      try {
        const { data } = await api.get(`/contracts/public/${token}/documents`);
        console.log(data);

        const serverDocs = data?.data as Record<DocType, ContractDocumentItem>;
        console.log(serverDocs);

        setDocs((prev) => {
          const updated = { ...prev };

          Object.keys(serverDocs || {}).forEach((key) => {
            const doc = serverDocs[key as DocType];
            if (!doc) return;

            updated[key as DocType] = {
              ...updated[key as DocType],
              uploaded: !!doc.fileUrl,
              uploadedUrl: doc.fileUrl ?? null,
              preview: doc.fileUrl ?? null,
              mimeType: doc.mimeType ?? null,
              status: doc.status ?? null,
              notes: doc.notes ?? '',
            };
          });

          return updated;
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadDocs();
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
      setTimeout(()=>{
        location.reload()
      },300)
    } catch  {
      toast.error("Error subiendo documento");
      setDocs((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-center text-xl font-bold">
        Verifica tu identidad
      </h1>

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
          />
        ))}
      </div>

    </div>
  );
}