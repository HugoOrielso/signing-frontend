"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import publicApiNew from "@/lib/publicAxios";
import { LetraCambioActionPanel } from "./letraDeCambioActionPanel";
import { ViewMode } from "../LibranzaView/LibranzaView";

interface LetraCambioData {
  id: string;
  contractId: string;
  tipoFirma?: string | null;
  firmaImagenUrl?: string | null;
  firmaTexto?: string | null;
  fechaFirma?: string | null;
  isLetraCambioSigned: boolean;
}

interface Props {
  token: string;
  mode: ViewMode;
}

export default function LetraCambioPreview({ token, mode }: Props) {
  const [data, setData] = useState<LetraCambioData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showPad, setShowPad] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await publicApiNew.get(
          `/users/contracts/${token}/letra-cambio`
        );
        setData(res.data.data);
      } catch {
        toast.error("No se pudo cargar la letra de cambio");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSign = async (sigType: "DRAWN" | "TYPED", sigData: string) => {
    try {
      setSaving(true);
      setError("");

      await publicApiNew.post(`/users/contracts/${token}/sign-letra-cambio`, {
        type: sigType,
        sigData,
      });

      toast.success("Letra de cambio firmada correctamente");

      setData((prev) =>
        prev
          ? {
            ...prev,
            tipoFirma: sigType,
            fechaFirma: new Date().toISOString(),
            isLetraCambioSigned: true,
            firmaImagenUrl:
              sigType === "DRAWN" ? sigData : prev.firmaImagenUrl,
            firmaTexto: sigType === "TYPED" ? sigData : prev.firmaTexto,
          }
          : prev
      );

      setShowPad(false);

      setTimeout(() => {
        location.reload();
      }, 500);
    } catch (error: unknown) {
      let message = "No se pudo firmar la letra de cambio";

      if (typeof error === "object" && error !== null && "response" in error) {
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
        <p className="text-sm text-gray-500">Cargando letra de cambio...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-3xl border border-blue-200 bg-white p-4 shadow-xl">
        <div className="w-full overflow-x-auto">
          <LetraCambioDocument data={data} />
        </div>
      </div>
      <LetraCambioActionPanel
        mode={mode}
        alreadySigned={data.isLetraCambioSigned}
        showPad={showPad}
        setShowPad={setShowPad}
        saving={saving}
        error={error}
        onSign={handleSign}
      />
    </div>
  );
}

function LetraCambioDocument({ data }: { data: LetraCambioData }) {
  return (
    <div className="inline-block min-w-195 align-top">
      <div className="w-195 overflow-hidden rounded-[12px] border border-[#2d2d2d] bg-[#e9e9ec] text-[#252525]">
        <div className="grid grid-cols-[120px_1fr]">
          <div className="grid grid-cols-[30px_30px_30px_30px] border-r border-[#2d2d2d] bg-white">
            <div className="col-span-4 bg-[#2d2d2d] py-1 text-center text-xs font-black leading-none tracking-tight text-white">
              ACEPTADA
            </div>

            <VerticalSignatureCell
              label="Firma."
              signatureImageUrl={data.firmaImagenUrl}
              signatureText={data.firmaTexto}
              signatureType={data.tipoFirma}
            />

            <VerticalText text="Cédula o NIT." />
            <VerticalText text="Codeudor." />
            <VerticalText text="Cédula o NIT." />
          </div>

          <div className=" text-[10px] font-bold leading-none">
            <div className="grid py-1 grid-cols-[1.2fr_45px_130px_60px_160px] items-center border-b border-[#2d2d2d]">
              <div className="flex items-center gap-1 px-1 py-1">
                <span>Fecha:</span>
              </div>

              <span className="text-center">N°.</span>

              <div className="mx-1 h-5 rounded-[6px] border border-[#2d2d2d] bg-white" />

              <span className="text-center">Por $</span>

              <div className="mx-1 h-5 rounded-[6px] border border-[#2d2d2d] bg-white" />
            </div>

            <div className="flex items-center border-b border-[#2d2d2d] px-1 py-1">
              <span>Señor(es):</span>
            </div>

            <div className="grid grid-cols-3 border-b border-[#2d2d2d] px-1 py-0.75 text-center">
              <span>El</span>
              <span>de</span>
              <span>del año</span>
            </div>

            <div className="flex items-center border-b border-[#2d2d2d] px-1 py-1">
              <span>Se servirá(n) ud.(s) pagar solidariamente en</span>
            </div>

            <div className="flex items-end border-b border-[#2d2d2d] px-1 py-1">
              <span className="ml-1">
                por esta Única de Cambio sin protesto, excusado al aviso de
                rechazo a
              </span>
            </div>

            <div className="border-b border-[#2d2d2d] px-1 py-1">
              la orden de
            </div>

            <div className="flex items-center border-b border-[#2d2d2d] px-1 justify-between py-1">
              <span>La cantidad de:</span>
              <div className="flex">
                <span>($</span>
                <span className="mx-1 h-px w-24  " />
                <span>)</span>
              </div>
            </div>

            <div className="flex items-center border-b border-[#2d2d2d] justify-between px-1 py-0.75">
              <span>Pesos m/l en</span>
              <span>Cuotas(s) de $</span>
              <span>, más intereses durante el plazo de</span>
            </div>

            <div className="flex justify-end border-b border-[#2d2d2d] px-1 py-0.5">
              <span>
                %) mensual y de mora a la tasa máxima legal autorizada.
              </span>
            </div>

            <div className="grid grid-cols-[1.25fr_0.7fr_1fr]">
              <div className="border-r border-[#2d2d2d]">
                <div className="border-b border-[#2d2d2d] py-0.5 text-center text-[10px] font-black">
                  DIRECCIÓN ACEPTANTES
                </div>
                <div className="h-5 border-b border-[#2d2d2d]" />
                <div className="h-5 border-b border-[#2d2d2d]" />
                <div className="h-5" />
              </div>

              <div className="border-r border-[#2d2d2d]">
                <div className="border-b border-[#2d2d2d] py-0.5 text-center text-[10px] font-black">
                  TELÉFONO
                </div>
                <div className="h-5 border-b border-[#2d2d2d]" />
                <div className="h-5 border-b border-[#2d2d2d]" />
                <div className="h-5" />
              </div>

              <div className="bg-white px-2 py-1 text-[10px] font-black">
                Atentamente,
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerticalSignatureCell({
  label,
  signatureImageUrl,
  signatureText,
  signatureType,
}: {
  label: string;
  signatureImageUrl?: string | null;
  signatureText?: string | null;
  signatureType?: string | null;
}) {
  return (
    <div className="relative min-h-55 border-r border-[#2d2d2d]">
      <div className="absolute inset-x-0 bottom-7 top-2 flex items-center justify-center">
        {signatureImageUrl ? (
          <Image
            src={signatureImageUrl}
            alt="Firma"
            width={140}
            height={42}
            unoptimized
            className="max-h-35 max-w-5.5 -rotate-90 object-contain"
          />
        ) : signatureType === "TYPED" && signatureText ? (
          <span className="-rotate-90 whitespace-nowrap font-signature text-[11px] font-normal">
            {signatureText}
          </span>
        ) : null}
      </div>

      <VerticalLabel text={label} />
    </div>
  );
}

function VerticalText({ text }: { text: string }) {
  return (
    <div className="relative min-h-55 border-r border-[#2d2d2d] last:border-r-0">
      <VerticalLabel text={text} />
    </div>
  );
}

function VerticalLabel({ text }: { text: string }) {
  return (
    <span
      className="absolute bottom-10 left-1/2 block w-21.5 origin-center -translate-x-1/2 -rotate-90 text-left text-[9px] font-bold leading-none"
      title={text}
    >
      {text}
    </span>
  );
}