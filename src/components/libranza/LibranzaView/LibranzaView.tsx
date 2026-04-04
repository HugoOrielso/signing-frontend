"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "sonner";
import publicApi from "@/lib/axiosPublicClient";
import { LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { PublicContractLoading } from "@/components/libranza/LibranzaDocument/ContractLoading";
import { PublicContractError } from "@/components/libranza/LibranzaDocument/ContractErrot";
import { PublicContractTopBar } from "@/components/libranza/LibranzaDocument/PublicContractTopBar";
import { PublicContractAdminBanner } from "@/components/libranza/LibranzaDocument/AdminBanner";
import { usePublicContractSignerStore } from "@/store/publicContractSignerStore";
import LibranzaPreview from "@/components/libranza/LibranzaPreview";
import PagarePreview from "../pagare/pagare";

interface ContractData {
  id: string;
  contractNumber?: string;
  contractType?: string;
  title: string;
  status: string;
  templateKey?: string | null;
  signers: LibranzaSigner[];
  signatures: LibranzaSignature[];
  libranzaData?: LibranzaDataPreview | null;
}

export type ViewMode = "sign" | "view" | "preview";

interface Props {
  token: string;
  pageMode: "sign" | "view";
  isAdmin: boolean;
}

type Step = "checking" | "loading" | "view" | "error";

export default function PublicContractView({ token, pageMode, isAdmin }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("checking");
  const [contract, setContract] = useState<ContractData | null>(null);
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);
  const hydrated = usePublicContractSignerStore((s) => s.hydrated);
  const session = usePublicContractSignerStore((s) => s.sessions[token] ?? null);
  const hasValidSession = usePublicContractSignerStore((s) => s.hasValidSession);

  useEffect(() => {
    if (!hydrated) return;

    const run = async () => {
      if (isAdmin || hasValidSession(token)) {
        setStep("loading");

        try {
          const { data } = await publicApi.get(`/contracts/public/${token}`);
          setContract(data.contract);
          setSignatures(data.contract.signatures ?? []);
          setStep("view");
        } catch (err) {
          const error = err as AxiosError<{ message?: string }>;
          toast.error(
            error.response?.data?.message ?? "No se pudo cargar el contrato"
          );
          setStep("error");
        }

        return;
      }

      router.replace(`/contracts/auth/${token}`);
    };

    run();
  }, [hydrated, isAdmin, token, hasValidSession, router]);

  function resolveMode(): ViewMode {
    if (isAdmin) return "preview";
    if (pageMode === "view") return "view";
    if (contract?.status === "SIGNED") return "view";
    return "sign";
  }

  if (!token) return <PublicContractError />;
  if (!hydrated || step === "checking" || step === "loading") {
    return <PublicContractLoading />;
  }
  if (step === "error" || !contract) {
    return <PublicContractError />;
  }

  const isLibranza = contract.contractType === "LIBRANZA" && !!contract.libranzaData;
  const mode = resolveMode();

  return (
    <div className="min-h-screen bg-cream font-sans">
      <PublicContractTopBar
        isAdmin={isAdmin}
        clientEmail={session?.email ?? null}
        status={contract.status}
      />

      {isAdmin && <PublicContractAdminBanner />}

      <div className="mx-auto max-w-215 px-4 py-10 gap-2 flex flex-col">
        {isLibranza ? (
          <LibranzaPreview
            data={contract.libranzaData!}
            signers={contract.signers}
            signatures={signatures}
            templateKey={contract.templateKey ?? ''}
            mode={mode}
            token={token}
            onSigned={() =>
              setContract((prev) =>
                prev ? { ...prev, status: "SIGNED" } : prev
              )
            }
          />
        ) : (
          <div className="rounded-2xl border border-border-soft bg-white px-13 py-10">
            <p className="m-0 text-center text-sm text-muted">
              Este tipo de contrato no es soportado en la vista pública.
            </p>
          </div>
        )}

        {isLibranza ? (
          <PagarePreview
            data={contract.libranzaData!}
            signers={contract.signers}
            signatures={signatures}
          />
        ) : (
          <div className="rounded-2xl border border-border-soft bg-white px-13 py-10">
            <p className="m-0 text-center text-sm text-muted">
              Este tipo de contrato no es soportado en la vista pública.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}