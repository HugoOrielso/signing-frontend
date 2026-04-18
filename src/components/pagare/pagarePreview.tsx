"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  LibranzaDataPreview,
  LibranzaSignature,
  LibranzaSigner,
} from "@/types/libranza";
import { ViewMode } from "../libranza/LibranzaView/LibranzaView";
import publicApiNew from "@/lib/publicAxios";
import { toast } from "sonner";
import { SignaturePad } from "@/components/contracts/SignaturePad";
import { PagareStatusLoader } from "./pagareStatusLoader";
import { SignatureBlock } from "./signaureBlock";
import {
  formatCurrency,
  formatDateText,
  formatDateTimeText,
  numberToSpanishWords,
  safeText,
} from "./utils";

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

interface PagarePreviewProps {
  contract: ContractData;
  signers: LibranzaSigner[];
  signatures: LibranzaSignature[];
  mode: ViewMode;
  token?: string;
  onSigned?: () => void;
}

interface PagareSignatureInfo {
  type: "TYPED" | "DRAWN";
  typedValue?: string | null;
  imageUrl?: string | null;
  signedAt?: string | null;
}

interface PagareInfo {
  id: string;
  number: number;
  status: "DRAFT" | "SIGNED" | "CANCELLED";
  ciudadFirma?: string | null;
  fechaSuscripcion?: string | null;
  fechaPrimeraCuota?: string | null;
  ciudadPago?: string | null;
  acreedorNombre?: string | null;
  acreedorNit?: string | null;
  deudorNombre?: string | null;
  deudorDocumento?: string | null;
  deudorDocumentoDe?: string | null;
  deudorDireccion?: string | null;
  deudorTelefono?: string | null;
  deudorEmail?: string | null;
  valorTotal?: number | null;
  numeroCuotas?: number | null;
  valorCuota?: number | null;
  interesCorriente?: string | null;
  interesMora?: string | null;
  signedAt?: string | null;
  signature?: PagareSignatureInfo | null;
}

interface PagareStatusResponse {
  ok: boolean;
  hasPagare: boolean;
  isSigned: boolean;
  pagare: PagareInfo | null;
}

export default function PagarePreview({
  contract,
  signers,
  signatures,
  mode,
  token,
}: PagarePreviewProps) {
  const fallbackData = contract.libranzaData;

  const [showPad, setShowPad] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [hasPagare, setHasPagare] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [pagare, setPagare] = useState<PagareInfo | null>(null);
  const [error, setError] = useState("");

  const deudorSigner = useMemo(
    () => signers.find((s) => s.partyRole === "DEUDOR"),
    [signers]
  );

  const acreedorSigner = useMemo(
    () => signers.find((s) => s.partyRole === "CONTRACTOR"),
    [signers]
  );

  const deudorSignature = useMemo(() => {
    if (!pagare?.signature || !deudorSigner) return undefined;

    return {
      id: "pagare-signature",
      signerId: deudorSigner.id,
      type: pagare.signature.type,
      typedValue: pagare.signature.typedValue ?? null,
      imageUrl: pagare.signature.imageUrl ?? null,
      signedAt: pagare.signature.signedAt ?? new Date().toISOString(),
    } as LibranzaSignature;
  }, [pagare?.signature, deudorSigner]);

  const acreedorSignature = useMemo(() => {
    if (!acreedorSigner) return undefined;
    return signatures.find((s) => s.signerId === acreedorSigner.id);
  }, [acreedorSigner, signatures]);

  useEffect(() => {
    if (!token) {
      setStatusLoading(false);
      setHasPagare(false);
      setIsSigned(false);
      setPagare(null);
      return;
    }

    const loadStatus = async () => {
      try {
        setStatusLoading(true);

        const { data } = await publicApiNew.get<PagareStatusResponse>(
          `/users/contracts/pagare/${token}`
        );

        setHasPagare(Boolean(data.hasPagare));
        setIsSigned(Boolean(data.isSigned));
        setPagare(data.pagare ?? null);
      } catch {
        setHasPagare(false);
        setIsSigned(false);
        setPagare(null);
      } finally {
        setStatusLoading(false);
      }
    };

    loadStatus();
  }, [token]);

  async function handleSign(type: "DRAWN" | "TYPED", value: string) {
    try {
      setSaving(true);
      setError("");

      const response = await publicApiNew.post(
        `/users/contracts/pagare/${token}/sign`,
        {
          type,
          ...(type === "TYPED" ? { typedValue: value } : { imageUrl: value }),
        }
      );

      const signedAt = response?.data?.signedAt ?? new Date().toISOString();
      const pagareNumber = response?.data?.pagareNumber ?? pagare?.number ?? null;

      setHasPagare(true);
      setIsSigned(true);
      setPagare((prev) =>
        prev
          ? {
            ...prev,
            number: pagareNumber,
            status: "SIGNED",
            signedAt,
            fechaSuscripcion: signedAt,
            signature: {
              type,
              typedValue: type === "TYPED" ? value : null,
              imageUrl: type === "DRAWN" ? value : null,
              signedAt,
            },
          }
          : null
      );

      setShowPad(false);
      toast.success("Pagaré firmado correctamente");
      setTimeout(() => {
        location.reload();
      }, 500);
    } catch {
      toast.error("Ocurrió un error al firmar");
    } finally {
      setSaving(false);
    }
  }

  if (statusLoading) {
    return <PagareStatusLoader />;
  }

  if (!hasPagare || !pagare) {
    return (
      <div className="rounded-md border border-neutral-300 bg-white px-10 py-12 shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
        <p className="m-0 text-center text-sm text-neutral-700">
          El pagaré aún no ha sido generado. Firma primero la libranza para
          habilitar este documento.
        </p>
      </div>
    );
  }

  const acreedorNombre = pagare.acreedorNombre || "GRUCULCOL";
  const acreedorNit = pagare.acreedorNit || "________________";
  const ciudadPago = safeText(
    pagare.ciudadPago || pagare.ciudadFirma || fallbackData?.ciudad
  );
  const interesCorriente =
    pagare.interesCorriente ||
    "Según tasa pactada sin exceder la máxima legal permitida";
  const interesMora =
    pagare.interesMora || "Según la máxima legal permitida";

  const valorTotal = pagare.valorTotal ?? fallbackData?.sumaTotal ?? 0;
  const valorCuota = pagare.valorCuota ?? fallbackData?.valorCuota ?? 0;
  const numeroCuotas = pagare.numeroCuotas ?? fallbackData?.numeroCuotas ?? 0;

  const valorTotalLetras = numberToSpanishWords(valorTotal);
  const valorCuotaLetras = numberToSpanishWords(valorCuota);

  const deudorNombre = safeText(
    pagare.deudorNombre || fallbackData?.clienteNombre
  );
  const deudorDocumento = safeText(
    pagare.deudorDocumento || fallbackData?.clienteCC
  );
  const deudorDocumentoDe = safeText(
    pagare.deudorDocumentoDe || fallbackData?.clienteCCDe
  );
  const deudorDireccion = safeText(
    pagare.deudorDireccion || fallbackData?.clienteDireccion
  );
  const deudorTelefono = safeText(
    pagare.deudorTelefono || fallbackData?.clienteTelefono
  );
  const deudorEmail = safeText(
    pagare.deudorEmail || fallbackData?.clienteEmail
  );

  const ciudadFirma = safeText(pagare.ciudadFirma || fallbackData?.ciudad);

  const fechaSuscripcionTexto = pagare.fechaSuscripcion
    ? formatDateTimeText(pagare.fechaSuscripcion)
    : formatDateText(fallbackData?.fecha);

  const fechaPrimeraCuota = safeText(
    pagare.fechaPrimeraCuota || fallbackData?.mesCobro
  );

  const showReadonlyMode = isSigned;

  return (
    <section className="mx-auto max-w-225 border border-neutral-300 bg-white px-6 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:px-12 md:py-12">
      <div className="mb-8 h-px w-full bg-neutral-300" />

      <header className="mb-10 text-center">
        <h1 className="text-[26px] font-semibold tracking-[0.22em] text-neutral-900">
          PAGARÉ
        </h1>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          Documento privado de obligación de pago
        </p>
      </header>

      <div className="grid gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-5 py-4 text-[13px] leading-6 text-neutral-800 md:grid-cols-2">
        <p>
          <span className="font-semibold text-neutral-900">Pagaré No.:</span>{" "}
          {pagare.number}
        </p>

        <p>
          <span className="font-semibold text-neutral-900">
            Lugar y fecha de suscripción:
          </span>{" "}
          {ciudadFirma}, {fechaSuscripcionTexto}
        </p>

        <p>
          <span className="font-semibold text-neutral-900">Valor total:</span>{" "}
          {valorTotalLetras} ({formatCurrency(valorTotal)})
        </p>

        <p>
          <span className="font-semibold text-neutral-900">Plazo:</span>{" "}
          {numeroCuotas} cuotas mensuales
        </p>

        <p>
          <span className="font-semibold text-neutral-900">
            Interés corriente:
          </span>{" "}
          {interesCorriente}
        </p>

        <p>
          <span className="font-semibold text-neutral-900">
            Interés de mora:
          </span>{" "}
          {interesMora}
        </p>

        <p>
          <span className="font-semibold text-neutral-900">Acreedor:</span>{" "}
          {acreedorNombre}
        </p>

        <p>
          <span className="font-semibold text-neutral-900">
            NIT acreedor:
          </span>{" "}
          {acreedorNit}
        </p>

        <p className="md:col-span-2">
          <span className="font-semibold text-neutral-900">Lugar de pago:</span>{" "}
          {ciudadPago}
        </p>
      </div>

      <article className="mt-10 space-y-6 text-justify text-[14px] leading-7 text-neutral-900">
        <p>
          Yo, <strong>{deudorNombre}</strong>, mayor de edad, identificado(a) con
          cédula de ciudadanía No. <strong>{deudorDocumento}</strong> de{" "}
          <strong>{deudorDocumentoDe}</strong>, domiciliado(a) en{" "}
          <strong>{deudorDireccion}</strong>, con número de contacto{" "}
          <strong>{deudorTelefono}</strong> y correo electrónico{" "}
          <strong>{deudorEmail}</strong>, actuando en calidad de{" "}
          <strong>DEUDOR</strong>, por medio del presente documento declaro:
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            PRIMERO. OBJETO:
          </span>{" "}
          Que pagaré incondicionalmente, de manera indivisible y a la orden de{" "}
          <strong>{acreedorNombre}</strong>, o de quien represente sus derechos,
          o de quien en el futuro ostente legítimamente la calidad de acreedor,
          la suma de <strong>{valorTotalLetras}</strong>{" "}
          ({formatCurrency(valorTotal)}), junto con los intereses corrientes y
          moratorios a que haya lugar, de conformidad con las condiciones aquí
          pactadas.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            SEGUNDO. INTERESES:
          </span>{" "}
          Sobre la suma adeudada reconoceré intereses corrientes a la tasa de{" "}
          <strong>{interesCorriente}</strong>, sin que exceda la tasa máxima legal
          permitida. En caso de mora en el pago total o parcial de cualquiera de
          las cuotas pactadas, reconoceré intereses moratorios a la tasa de{" "}
          <strong>{interesMora}</strong>, liquidados sobre las sumas vencidas y no
          pagadas.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            TERCERO. PLAZO Y FORMA DE PAGO:
          </span>{" "}
          La obligación contenida en este pagaré será pagada en{" "}
          <strong>{numeroCuotas}</strong> cuotas mensuales, iguales y sucesivas,
          cada una por valor de <strong>{valorCuotaLetras}</strong>{" "}
          ({formatCurrency(valorCuota)}). La primera cuota deberá pagarse a partir
          del mes de <strong>{fechaPrimeraCuota}</strong> y las demás en forma
          mensual y consecutiva hasta la cancelación total de la obligación.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            CUARTO. RELACIÓN CON LA LIBRANZA:
          </span>{" "}
          El presente pagaré respalda las obligaciones derivadas de la libranza
          y/o autorización de descuento suscrita por el deudor a favor de{" "}
          <strong>{acreedorNombre}</strong>. En consecuencia, el deudor reconoce
          que los pagos podrán ser recaudados mediante descuento de nómina
          conforme a la autorización otorgada de manera separada. La existencia de
          la libranza no limita, modifica ni reemplaza la fuerza ejecutiva del
          presente pagaré.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            QUINTO. MORA:
          </span>{" "}
          El simple retardo en el pago de cualquiera de las cuotas pactadas
          constituirá en mora al deudor, sin necesidad de requerimiento judicial o
          extrajudicial, ni constitución en mora previa.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            SEXTO. CLÁUSULA ACELERATORIA:
          </span>{" "}
          El tenedor legítimo de este pagaré podrá declarar vencido
          anticipadamente el plazo de todas las cuotas pendientes y exigir de
          inmediato el pago total de la obligación, judicial o extrajudicialmente,
          en cualquiera de los siguientes casos: a) cuando el deudor incurra en
          mora en el pago de una o más cuotas; b) cuando el deudor incumpla
          cualquiera de las obligaciones contenidas en este pagaré o en la
          libranza relacionada; c) cuando termine, se suspenda o se modifique la
          relación laboral o contractual que sirve de base al descuento por
          nómina; d) cuando los descuentos de nómina no puedan realizarse por
          cualquier causa; e) cuando se inicie proceso de insolvencia, embargo o
          persecución judicial de bienes del deudor; f) en los demás casos
          previstos en la ley.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            SÉPTIMO. PAGO DIRECTO EN AUSENCIA DE DESCUENTO:
          </span>{" "}
          En caso de que por cualquier motivo no sea posible efectuar el descuento
          por nómina, el deudor se obliga a pagar directamente las cuotas
          pendientes en las fechas pactadas, sin que ello implique novación de la
          obligación ni modificación de las condiciones del presente pagaré.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            OCTAVO. GASTOS DE COBRANZA:
          </span>{" "}
          Serán a cargo del deudor todos los gastos y costos que ocasione el cobro
          judicial o extrajudicial de la obligación, incluidos honorarios de
          abogado, costas, agencias en derecho, impuestos y demás erogaciones
          legalmente procedentes.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            NOVENO. CESIÓN Y ENDOSO:
          </span>{" "}
          El acreedor queda expresamente facultado para ceder, negociar, endosar,
          transferir o enajenar a cualquier título el presente pagaré y los
          derechos incorporados en él, sin necesidad de notificación previa al
          deudor.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            DÉCIMO. AUTORIZACIÓN DE CONSULTA Y REPORTE:
          </span>{" "}
          El deudor autoriza de manera expresa, previa, informada e irrevocable a{" "}
          <strong>{acreedorNombre}</strong>, o a quien represente sus derechos, o
          a quien en el futuro ostente la calidad de acreedor, para consultar,
          reportar, procesar, solicitar, actualizar, aclarar, retirar y divulgar
          ante operadores de información, centrales de riesgo y demás bases de
          datos legalmente autorizadas, toda la información referente al
          nacimiento, modificación, ejecución, cumplimiento, incumplimiento y
          extinción de las obligaciones a su cargo, en los términos de la ley
          aplicable.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            DÉCIMO PRIMERO. LUGAR DE CUMPLIMIENTO:
          </span>{" "}
          Para todos los efectos legales, el lugar de cumplimiento de las
          obligaciones derivadas del presente pagaré será la ciudad de{" "}
          <strong>{ciudadPago}</strong>.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            DÉCIMO SEGUNDO. MÉRITO EJECUTIVO:
          </span>{" "}
          El deudor reconoce expresamente que el presente documento presta mérito
          ejecutivo y contiene una obligación clara, expresa y exigible.
        </p>

        <p>
          <span className="font-semibold tracking-wide text-neutral-900">
            DÉCIMO TERCERO. ACEPTACIÓN:
          </span>{" "}
          Declaro que he leído, entendido y aceptado integralmente el contenido
          del presente pagaré, y que lo suscribo de manera libre y voluntaria.
        </p>

        <p>
          En constancia, se suscribe en <strong>{ciudadFirma}</strong> el día{" "}
          <strong>{fechaSuscripcionTexto}</strong>.
        </p>
      </article>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div>
          <h3 className="mb-6 text-[12px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
            El deudor
          </h3>

          <div className="min-h-27.5">
            <SignatureBlock signer={deudorSigner} signature={deudorSignature} />
          </div>

          <div className="mt-3 w-full max-w-[320px] border-t border-neutral-400 pt-3 text-sm text-neutral-700">
            <p>
              <span className="font-medium text-neutral-900">Nombre:</span>{" "}
              {deudorNombre}
            </p>
            <p>
              <span className="font-medium text-neutral-900">C.C.:</span>{" "}
              {deudorDocumento} de {deudorDocumentoDe}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-[12px] font-semibold uppercase tracking-[0.15em] text-neutral-600">
            El acreedor
          </h3>

          <div className="min-h-27.5">
            <SignatureBlock signer={acreedorSigner} signature={acreedorSignature} />
          </div>

          <div className="mt-3 w-full max-w-[320px] border-t border-neutral-400 pt-3 text-sm text-neutral-700">
            <p>
              <span className="font-medium text-neutral-900">
                Razón social:
              </span>{" "}
              {acreedorNombre}
            </p>
            <p>
              <span className="font-medium text-neutral-900">NIT:</span>{" "}
              {acreedorNit}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-md border border-neutral-300 bg-white shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
        <div className="h-0.5 bg-neutral-800" />

        <div className="relative px-6 py-6 md:px-8">
          {saving && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm">
              <svg
                className="h-8 w-8 animate-spin text-neutral-700"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <p className="text-[13px] font-semibold text-neutral-800">
                Guardando firma del pagaré...
              </p>
            </div>
          )}

          {showReadonlyMode ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#166534"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="m-0 text-[17px] font-semibold text-neutral-900">
                    {mode === "view"
                      ? "Pagaré firmado"
                      : "¡Pagaré firmado correctamente!"}
                  </h3>

                  <p className="mt-1 mb-0 text-[13px] text-neutral-600">
                    {mode === "view"
                      ? "Este pagaré ya fue firmado y se muestra en modo solo lectura."
                      : "Tu firma ha sido registrada correctamente."}
                  </p>

                  <p className="mt-2 mb-0 text-[12px] text-neutral-600">
                    Número de pagaré:{" "}
                    <span className="font-semibold text-neutral-900">
                      {pagare.number}
                    </span>
                  </p>

                  {pagare.signedAt ? (
                    <p className="mt-1 mb-0 text-[12px] text-neutral-600">
                      Fecha de firma:{" "}
                      <span className="font-semibold text-neutral-900">
                        {formatDateTimeText(pagare.signedAt)}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 mb-0 text-[12px] text-neutral-600">
                      Estado:{" "}
                      <span className="font-semibold text-neutral-900">
                        Listo para firma
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div
                className={`flex flex-wrap items-center justify-between gap-4 ${showPad ? "mb-5" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">✍️</span>
                  <div>
                    <h2 className="m-0 text-[18px] font-semibold text-neutral-900">
                      Firmar Pagaré
                    </h2>
                    <p className="mt-1 mb-0 text-[13px] text-neutral-600">
                      Pagaré No. {pagare.number} listo para firma
                    </p>
                  </div>
                </div>

                {!showPad && (
                  <button
                    onClick={() => setShowPad(true)}
                    className="cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-neutral-800"
                  >
                    Firmar ahora
                  </button>
                )}
              </div>

              {showPad && (
                <div>
                  <div className="rounded-md border border-neutral-300 bg-neutral-50 p-4">
                    <SignaturePad onSave={handleSign} disabled={saving} />
                  </div>

                  {error && (
                    <p className="mt-3 text-[13px] font-medium text-red-700">
                      ⚠ {error}
                    </p>
                  )}

                  <div className="mt-3 flex justify-start">
                    <button
                      onClick={() => {
                        setShowPad(false);
                        setError("");
                      }}
                      className="cursor-pointer rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}