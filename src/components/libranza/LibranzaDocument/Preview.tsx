"use client";

import { useEffect, useState } from "react";
import publicApi from "@/lib/axiosPublicClient";
import { LibranzaData, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { BORDER, GOLD_D, INK } from "@/lib/constanst";
import { LibranzaDocument } from "./LibranzaDocumentTest";
import { LibranzaActionPanel } from "./LibranzaActionPanel";
import DocumentUploader from "@/components/documents/Uploader";
import { Toast } from "@/components/ui/Libranza/Toast";
import { AxiosError } from "axios";

interface Props {
    data: LibranzaData;
    signers?: LibranzaSigner[];
    signatures?: LibranzaSignature[];
    mode: "preview" | "sign" | "view";
    token?: string;
    onSigned?: () => void;
}

export default function LibranzaPreview({
    data,
    signers = [],
    signatures: initialSignatures = [],
    mode,
    token,
    onSigned,
}: Props) {
    const [signatures, setSignatures] = useState<LibranzaSignature[]>(initialSignatures);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const [showPad, setShowPad] = useState(false);

    useEffect(() => {
        setSignatures(initialSignatures);
    }, [initialSignatures]);

    const contractedSigner = signers.find((s) => s.partyRole === "CONTRACTED");
    const alreadySigned = !!signatures.find((sig) => sig.signerId === contractedSigner?.id);
    const isSignMode = mode === "sign";
    const showActionPanel = mode === "sign" || mode === "view";

    function showToast(message: string) {
        setToast(message);
        setTimeout(() => setToast(""), 3500);
    }

    async function handleSign(sigType: "DRAWN" | "TYPED", sigData: string) {
        if (!token) return;

        setSaving(true);
        setError("");

        try {
            const body =
                sigType === "TYPED"
                    ? { type: "TYPED", typedValue: sigData }
                    : { type: "DRAWN", imageUrl: sigData };

            const { data: res } = await publicApi.post(`/contracts/public/${token}/sign`, body);

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
            showToast("✓ " + (res.message ?? "Firma registrada correctamente"));
            onSigned?.();
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            setError(error?.response?.data?.message ?? "No se pudo guardar la firma");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    background: "white",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1.5px solid ${BORDER}`,
                    boxShadow: isSignMode ? "0 8px 40px rgba(0,0,0,0.07)" : "none",
                }}
            >
                {isSignMode && (
                    <div style={{ height: 5, background: `linear-gradient(90deg,${GOLD_D},${GOLD_D},${INK})` }} />
                )}

                <div style={{ padding: isSignMode ? "24px" : "0" }}>
                    <LibranzaDocument
                        data={data}
                        signatures={signatures}
                        signers={signers}
                        showSignatureZone={isSignMode}
                    />
                </div>
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

            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <Toast message={toast} />
        </div>
    );
}