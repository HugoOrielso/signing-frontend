"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { PublicContractLoading } from "@/components/libranza/LibranzaDocument/ContractLoading";
import { PublicContractError } from "@/components/libranza/LibranzaDocument/ContractErrot";
import LibranzaPreview from "@/components/libranza/LibranzaPreview";
import publicApiNew from "@/lib/publicAxios";

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
}

type Step = "loading" | "view" | "error";

export default function PublicContractView({ token, pageMode }: Props) {

  const [step, setStep] = useState<Step>("loading");
  const [contract, setContract] = useState<ContractData | null>(null);
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await publicApiNew.get(`/users/contracts/${token}`);
        setContract(data.data);
        setSignatures(data.data.signatures ?? []);
        setStep("view");
      } catch (err) {
        console.log(err)
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message ?? "No se pudo cargar el contrato");
        setStep("error");
      }
    };

    if (pageMode === "view") {
      // Vista libre — carga directo sin validar sesión
      load();
      return;
    }

    // Modo sign — por ahora también carga directo, aquí irá la validación OTP después
    // TODO: validar sesión antes de cargar
    load();
  }, [token, pageMode]);

  function resolveMode(): ViewMode {
    if (pageMode === "view") return "view";
    if (contract?.status === "SIGNED") return "view";
    return "sign";
  }

  if (!token) return <PublicContractError />;
  if (step === "loading") return <PublicContractLoading />;
  if (step === "error" || !contract) return <PublicContractError />;

  const isLibranza = contract.contractType === "LIBRANZA" && !!contract.libranzaData;
  const mode = resolveMode();

  return (
    <div className="min-h-screen font-sans">
      <div className="mx-auto max-w-215 px-4 py-10 gap-2 flex flex-col">
        {isLibranza ? (
          <LibranzaPreview
            data={contract.libranzaData!}
            signers={contract.signers}
            signatures={signatures}
            templateKey={contract.templateKey ?? ""}
            mode={mode}
            token={token}
            onSigned={() =>
              setContract((prev) => prev ? { ...prev, status: "SIGNED" } : prev)
            }
          />
        ) : (
          <div className="rounded-2xl border border-border-soft bg-white px-13 py-10">
            <p className="m-0 text-center text-sm text-muted">
              Este tipo de contrato no es soportado en la vista pública.
            </p>
          </div>
        )}
        {/* 
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
        )} */}
      </div>
    </div>
  );
}