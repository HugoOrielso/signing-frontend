"use client";

import { useEffect, useState } from "react";
import publicApi from "@/lib/axiosPublicClient";
import { LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { LibranzaDocument } from "./LibranzaDocument";
import { LibranzaActionPanel } from "./LibranzaDocument/LibranzaActionPanel";
import DocumentUploader from "@/components/documents/Uploader";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ScaledDocumentViewer } from "./viewer/ScaledDocument";

interface Props {
  data: LibranzaDataPreview;
  signers?: LibranzaSigner[];
  signatures?: LibranzaSignature[];
  templateKey: string
  mode: "preview" | "sign" | "view";
  token?: string;
  onSigned?: () => void;
}

export default function LibranzaPreview({ data, signers = [], signatures: initialSignatures = [], templateKey, mode, token, onSigned }: Props) {
  const [signatures, setSignatures] = useState<LibranzaSignature[]>(initialSignatures);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPad, setShowPad] = useState(false);
  useEffect(() => {
    setSignatures(initialSignatures);
  }, [initialSignatures]);

  const contractedSigner = signers.find((s) => s.partyRole === "CONTRACTED");
  const alreadySigned = !!signatures.find((sig) => sig.signerId === contractedSigner?.id);

  const isSignMode = mode === "sign";
  const showActionPanel = mode === "sign" || mode === "view";

  async function handleSign(sigType: "DRAWN" | "TYPED", sigData: string) {
    if (!token) return;

    setSaving(true);
    setError("");

    try {
      const body = sigType === "TYPED" ? { type: "TYPED", typedValue: sigData } : { type: "DRAWN", imageUrl: sigData };

      const { data: res } = await publicApi.post(
        `/contracts/public/${token}/sign`,
        body
      );

      const newSig: LibranzaSignature = {
        id: crypto.randomUUID(),
        signerId: contractedSigner?.id ?? "",
        type: sigType,
        typedValue: sigType === "TYPED" ? sigData : null,
        imageUrl: sigType === "DRAWN" ? sigData : null,
        signedAt: new Date().toISOString(),
      };

      setSignatures((prev) => [...prev, newSig]);
      setShowPad(false);

      toast.success("✓ " + (res.message ?? "Firma registrada correctamente"));

      onSigned?.();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error?.response?.data?.message ?? "No se pudo guardar la firma");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto rounded-xl border border-border-soft bg-white ${isSignMode ? "shadow-[0_8px_40px_rgba(0,0,0,0.07)]" : ""
          }`}
      >
        {isSignMode && (
          <div className="h-1.25 bg-linear-to-r from-gold-dark via-gold-dark to-ink" />
        )}

        <ScaledDocumentViewer>
          <LibranzaDocument
            data={data}
            signatures={signatures}
            signers={signers}
            showSignatureZone={isSignMode}
            templateKey={templateKey}
          />
        </ScaledDocumentViewer>
      </div>

      {showActionPanel && (
        <LibranzaActionPanel
          mode={mode}
          alreadySigned={alreadySigned}
          token={token}
          showPad={showPad}
          setShowPad={setShowPad}
          saving={saving}
          error={error}
          onSign={handleSign}
        />
      )}

      {isSignMode && token && <DocumentUploader token={token} />}
    </div>
  );
}