"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import publicApiNew from "@/lib/publicAxios";
import { ViewMode } from "../libranza/LibranzaView/LibranzaView";
import { ReciboConformidadActionPanel } from "./ReciboPanel";
import { ReciboConformidadHeader } from "./ReciboHeader";
import { ScaledDocumentViewer } from "../libranza/viewer/ScaledDocument";

interface ReciboConformidadData {
  ciudad: string
  clienteCC: string
  clienteNombre: string
  contractId: string
  createdAt: string
  fechaFirma?: string | null
  firmaImagenUrl: string | null
  firmaTexto: string | null
  id: string
  numeroRecibo: number
  textoRecibido: string
  tipoFirma?: string | null
  updatedAt: string
  isConformityReceiptSigned: boolean
  templateKey: string
}

interface Props {
  token: string;
  mode: ViewMode;
  onSigned?: () => void;
}

export default function ReciboConformidadPreview({
  token,
  mode,
}: Props) {
  const [data, setData] = useState<ReciboConformidadData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showPad, setShowPad] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicApiNew.get(
          `/users/contracts/${token}/conformity-receipt`
        );
        setData(res.data.data);
      } catch {
        toast.error("No se pudo cargar el recibo de conformidad");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSign = async (
    sigType: "DRAWN" | "TYPED",
    sigData: string
  ) => {
    try {
      setSaving(true);
      setError("");

      await publicApiNew.post(
        `/users/contracts/${token}/sign-conformity-receipt`,
        {
          type: sigType,
          sigData,
        }
      );

      toast.success("Recibo de conformidad firmado correctamente");

      setData((prev) =>
        prev
          ? {
            ...prev,
            fechaFirma: new Date().toISOString(),
          }
          : prev
      );

      setShowPad(false);
      setTimeout(() => { location.reload() }, 500)
    } catch (error: unknown) {
      let message = "No se pudo firmar el recibo de conformidad";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = err.response?.data?.message ?? message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Cargando recibo...</p>
      </div>
    );
  }

  if (!data) return null;
  const alreadySigned = data.isConformityReceiptSigned

  return (
    <div className="mx-auto w-full max-w-3xl px-3 ">
      <div className="w-full overflow-x-auto">
        <ScaledDocumentViewer>
          <div className="mx-auto min-w-175 max-w-205">
            <div className="rounded-3xl   p-4 ">
              <div className="rounded-2xl  p-4">

                <ReciboConformidadHeader
                  templateKey={data.templateKey}
                  consecutivo={data.numeroRecibo}
                />

                <div className="space-y-5 text-sm font-semibold">
                  <div className="grid grid-cols-[90px_1fr] items-end gap-3">
                    <span>Ciudad:</span>
                    <div className="border-b px-2 py-1 text-black">
                      {data.ciudad ?? ""}
                    </div>
                  </div>

                  <div className="grid grid-cols-[90px_1fr] items-end gap-3">
                    <span>Cliente:</span>
                    <div className="border-b px-2 py-1 text-black">
                      {data.clienteNombre}
                    </div>
                  </div>
                </div>

                <div className="mt-10 text-base font-bold leading-8">
                  Manifiesto haber recibido de la Empresa{" "}
                  <span className="uppercase">Dimcultura</span>, en buen estado y a mi
                  entera conformidad como comprador de:
                </div>

                <div className="mt-5 rounded-2xl border bg-blue-50/40 p-5 text-sm leading-7 text-slate-700">
                  {data.textoRecibido ??
                    "los productos y/o servicios relacionados en el documento correspondiente."}
                </div>

                <div className="mt-20 w-72">
                  <div className="h-20 border-b" />

                  <p className="mt-2 text-center text-sm font-bold uppercase">
                    Cliente
                  </p>

                  {data.clienteCC && (
                    <p className="mt-1 text-center text-xs">
                      C.C. {data.clienteCC}
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </ScaledDocumentViewer>
      </div>

      <ReciboConformidadActionPanel
        mode={mode}
        alreadySigned={alreadySigned}
        showPad={showPad}
        setShowPad={setShowPad}
        saving={saving}
        error={error}
        onSign={handleSign}
      />
    </div>
  );
}