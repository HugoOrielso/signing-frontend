"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";

import publicApi from "@/lib/axiosPublicClient";
import { BORDER, CREAM, MUTED } from "@/lib/constanst";
import { LibranzaData, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { PublicContractLoading } from "@/components/libranza/LibranzaDocument/ContractLoading";
import { PublicContractError } from "@/components/libranza/LibranzaDocument/ContractErrot";
import { PublicContractTopBar } from "@/components/libranza/LibranzaDocument/PublicContractTopBar";
import { PublicContractAdminBanner } from "@/components/libranza/LibranzaDocument/AdminBanner";
import { usePublicContractSignerStore } from "@/store/publicContractSignerStore";
import LibranzaPreview from "@/components/libranza/LibranzaDocument/Preview";

interface ContractData {
  id: string; contractNumber?: string; contractType?: string;
  title: string; status: string;
  signers:    LibranzaSigner[];
  signatures: LibranzaSignature[];
  libranzaData?: LibranzaData | null;
}

export type ViewMode = "sign" | "view" | "preview";

interface Props {
  token:    string;
  pageMode: "sign" | "view";
  isAdmin:  boolean;
}

type Step = "checking" | "loading" | "view" | "error";

export default function PublicContractView({ token, pageMode, isAdmin }: Props) {
  const router = useRouter();

  const [step,       setStep]       = useState<Step>("checking");
  const [contract,   setContract]   = useState<ContractData | null>(null);
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);

  const hydrated        = usePublicContractSignerStore(s => s.hydrated);
  const session         = usePublicContractSignerStore(s => s.sessions[token] ?? null);
  const hasValidSession = usePublicContractSignerStore(s => s.hasValidSession);

  async function loadContract() {
    await Promise.resolve();
    setStep("loading");
    try {
      const { data } = await publicApi.get(`/contracts/public/${token}`);
      setContract(data.contract);
      setSignatures(data.contract.signatures ?? []);
      setStep("view");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "No se pudo cargar el contrato");
      setStep("error");
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    if (isAdmin)              { loadContract(); return; }
    if (hasValidSession(token)) { loadContract(); return; }
    router.replace(`/contracts/auth/${token}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isAdmin, token]);

  function resolveMode(): ViewMode {
    if (isAdmin)                       return "preview";
    if (pageMode === "view")           return "view";
    if (contract?.status === "SIGNED") return "view";
    return "sign";
  }

  if (!token)                                    return <PublicContractError />;
  if (!hydrated || step === "checking" || step === "loading") return <PublicContractLoading />;
  if (step === "error" || !contract)             return <PublicContractError />;

  const isLibranza = contract.contractType === "LIBRANZA" && !!contract.libranzaData;
  const mode       = resolveMode();

  return (
    <div style={{ minHeight:"100vh", background:CREAM, fontFamily:"DM Sans, sans-serif" }}>

      <PublicContractTopBar
        isAdmin={isAdmin}
        clientEmail={session?.email ?? null}
        status={contract.status}
      />

      {isAdmin && <PublicContractAdminBanner />}

      <div style={{ maxWidth:860, margin:"0 auto", padding:"40px 16px" }}>
        {isLibranza ? (
          <LibranzaPreview
            data={contract.libranzaData!}
            signers={contract.signers}
            signatures={signatures}
            mode={mode}
            token={token}
            onSigned={() => setContract(prev => prev ? { ...prev, status:"SIGNED" } : prev)}
          />
        ) : (
          <div style={{ background:"white", borderRadius:16,
            padding:"40px 52px", border:`1.5px solid ${BORDER}` }}>
            <p style={{ color:MUTED, fontSize:14, margin:0, textAlign:"center" }}>
              Este tipo de contrato no es soportado en la vista pública.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}