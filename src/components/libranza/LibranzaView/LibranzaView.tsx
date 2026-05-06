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
import ReciboConformidadPreview from "@/components/conformityReceipt/ReciboConformidadPreview";
import { DocumentsSigned } from "@/components/common/DocumentsSigned";

interface ContractData {
  id: string;
  contractNumber?: string;
  contractType?: string;
  title: string;
  consecutivo?: string
  status: string;
  templateKey?: string | null;
  signers: LibranzaSigner[];
  signatures: LibranzaSignature[];
  libranzaData?: LibranzaDataPreview | null;
  isSigned?: boolean;
  isConformityReceiptSigned?: boolean;
  pagareSigned?: boolean;
}

export type ViewMode = "sign" | "view" | "preview";

interface Props {
  token: string;
  pageMode: "sign" | "view";
}

type Step =
  | "loading"
  | "identity-required"
  | "starting-veriff"
  | "view"
  | "error";

interface ApiErrorResponse {
  message?: string;
  code?: string;
  status?: string;
}

export default function PublicContractView({ token, pageMode }: Props) {
  const [step, setStep] = useState<Step>("loading");
  const [contract, setContract] = useState<ContractData | null>(null);
  const [signatures, setSignatures] = useState<LibranzaSignature[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await publicApiNew.get(`/users/contracts/${token}`);
        console.log(data)
        setContract(data.data);
        setSignatures(data.data.signatures ?? []);
        setStep("view");
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        const code = error.response?.data?.code;

        if (
          code === "IDENTITY_VERIFICATION_REQUIRED" ||
          code === "IDENTITY_VERIFICATION_PENDING" ||
          code === "IDENTITY_VERIFICATION_INCOMPLETE" ||
          code === "IDENTITY_VERIFICATION_NOT_APPROVED"
        ) {
          setStep("identity-required");
          return;
        }

        if (code === "IDENTITY_VERIFICATION_REJECTED") {
          toast.error(
            error.response?.data?.message ??
            "La verificación de identidad fue rechazada"
          );
          setStep("error");
          return;
        }

        toast.error(
          error.response?.data?.message ?? "No se pudo cargar el contrato"
        );
        setStep("error");
      }
    };

    if (token) load();
  }, [token, pageMode]);

  const handleStartVeriff = async () => {
    try {
      setStep("starting-veriff");

      const { data } = await publicApiNew.get(
        `/users/contracts/${token}/generateVeriffSession`
      );

      const sessionUrl =
        data?.data?.sessionUrl ||
        data?.sessionUrl ||
        data?.verification?.url;

      if (!sessionUrl) {
        toast.error("No se pudo obtener la sesión de verificación");
        setStep("identity-required");
        return;
      }

      window.location.href = sessionUrl;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;

      toast.error(
        error.response?.data?.message ??
        "No se pudo iniciar la verificación de identidad"
      );

      setStep("identity-required");
    }
  };

  function resolveMode(): ViewMode {
    if (pageMode === "view") return "view";
    if (contract?.status === "SIGNED") return "view";
    return "sign";
  }

  if (!token) return <PublicContractError />;

  if (step === "loading") {
    return <PublicContractLoading />;
  }

  if (step === "identity-required" || step === "starting-veriff") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#dbeafe,transparent_35%),radial-gradient(circle_at_bottom_right,#bfdbfe,transparent_30%)]" />

        <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-blue-950/10">


          <h1 className="text-center text-2xl font-bold text-slate-900">
            Antes de continuar, vamos a verificar que eres tú
          </h1>

          <p className="mt-4 text-center text-sm leading-6 text-slate-600">
            Por razones de seguridad, necesitamos confirmar tu identidad antes
            de permitirte revisar o firmar este documento.
          </p>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-950">
              Durante el proceso deberás:
            </p>

            <ul className="mt-3 space-y-2 text-sm text-blue-950/80">
              <li>• Tomar o subir una imagen de tu documento de identidad.</li>
              <li>• Realizar una validación facial o selfie.</li>
              <li>• Completar la verificación segura con Veriff.</li>
            </ul>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Este paso nos ayuda a proteger tu información y asegurar que el
            proceso de firma sea realizado únicamente por la persona autorizada.
          </p>

          <button
            type="button"
            onClick={handleStartVeriff}
            disabled={step === "starting-veriff"}
            className="mt-7 flex w-full items-center justify-center rounded-2xl bg-blue-700 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {step === "starting-veriff"
              ? "Iniciando verificación..."
              : "Continuar con la verificación"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "error" || !contract) return <PublicContractError />;

  const mode = resolveMode();
  const isLibranzaSigned = contract.isSigned;
  const pagareSigned = contract.pagareSigned;
  const isReciboConformidadSigned = contract.isConformityReceiptSigned;
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-h-screen font-sans">
        <div className="mx-auto flex max-w-215 flex-col gap-2 px-4 py-10">
          {!isLibranzaSigned ? (
            <LibranzaPreview
              data={{ ...contract.libranzaData!, consecutivo: contract.consecutivo }}
              signers={contract.signers}
              signatures={signatures}
              templateKey={contract.templateKey ?? ""}
              mode={mode}
              token={token}
              onSigned={() =>
                setContract((prev) =>
                  prev
                    ? {
                      ...prev,
                      status: "SIGNED",
                      isSigned: true,
                    }
                    : prev
                )
              }
            />
          ) : !pagareSigned ? (

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
          ) : !isReciboConformidadSigned ? (

            <ReciboConformidadPreview
              token={token}
              mode={mode}
            />
          ) : 
            <DocumentsSigned/>
          }
        </div>
      </div>
    </div>
  );
}