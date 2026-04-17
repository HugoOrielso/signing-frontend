"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  LibranzaDataPreview,
  LibranzaSignature,
  LibranzaSigner,
} from "@/types/libranza";
import { PublicContractLoading } from "@/components/libranza/LibranzaDocument/ContractLoading";
import { PublicContractError } from "@/components/libranza/LibranzaDocument/ContractErrot";
import LibranzaPreview from "@/components/libranza/LibranzaPreview";
import publicApiNew from "@/lib/publicAxios";
import PagarePreview from "@/components/pagare/pagarePreview";

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
  isSigned?: boolean
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
  console.log(contract?.isSigned)
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);

  

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await publicApiNew.get(`/users/contracts/${token}`);
        setContract(data.data);
        setSignatures(data.data.signatures ?? []);
        setStep("view");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(
          error.response?.data?.message ?? "No se pudo cargar el contrato"
        );
        setStep("error");
      }
    };

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

  const mode = resolveMode();
  const isLibranzaSigned = contract.isSigned

  return (
    <div className="min-h-screen font-sans">
      <div className="mx-auto flex max-w-215 flex-col gap-2 px-4 py-10">
        {!isLibranzaSigned ? (
          <LibranzaPreview
            data={contract.libranzaData!}
            signers={contract.signers}
            signatures={signatures}
            templateKey={contract.templateKey ?? ""}
            mode={mode}
            token={token}
            onSigned={() =>
              setContract((prev) =>
                prev ? { ...prev, status: "SIGNED" } : prev
              )
            }
          />
        ) :  (
          <PagarePreview
            contract={contract}
            signers={contract.signers}
            signatures={signatures}
            mode={mode}
            token={token}
            onSigned={() =>
              setContract((prev) =>
                prev ? { ...prev, status: "SIGNED" } : prev
              )
            }
          />
        ) }
      </div>
    </div>
  );
}