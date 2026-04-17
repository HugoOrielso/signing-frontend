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
    if (pagare?.signature) {
      return {
        id: "pagare-signature",
        signerId: deudorSigner?.id ?? "deudor",
        type: pagare.signature.type,
        typedValue: pagare.signature.typedValue ?? null,
        imageUrl: pagare.signature.imageUrl ?? null,
        signedAt: pagare.signature.signedAt ?? new Date().toISOString(),
      } as LibranzaSignature;
    }

    if (!deudorSigner) return undefined;
    return signatures.find((s) => s.signerId === deudorSigner.id);
  }, [pagare?.signature, deudorSigner, signatures]);

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

      const response = await publicApiNew.post(`/users/contracts/pagare/${token}/sign`, {
        type,
        ...(type === "TYPED" ? { typedValue: value } : { imageUrl: value }),
      });

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
      setTimeout(()=>{location.reload()},500)
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
      <div className="rounded-2xl border border-border-soft bg-white px-13 py-10">
        <p className="m-0 text-center text-sm ">
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

  const ciudadFirma = safeText(
    pagare.ciudadFirma || fallbackData?.ciudad
  );

  const fechaSuscripcionTexto = pagare.fechaSuscripcion
    ? formatDateTimeText(pagare.fechaSuscripcion)
    : formatDateText(fallbackData?.fecha);

  const fechaPrimeraCuota = safeText(
    pagare.fechaPrimeraCuota || fallbackData?.mesCobro
  );

  const showReadonlyMode = isSigned;

  return (
    <section className="rounded-2xl border border-border-soft bg-white px-6 py-8 shadow-sm md:px-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">
          PAGARÉ
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Documento de obligación de pago
        </p>
      </header>

      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800 md:grid-cols-2">
        <p>
          <span className="font-semibold">Pagaré No.:</span>{" "}
          {pagare.number}
        </p>
        <p>
          <span className="font-semibold">Lugar y fecha de suscripción:</span>{" "}
          {ciudadFirma}, {fechaSuscripcionTexto}
        </p>
        <p>
          <span className="font-semibold">Valor total:</span> {valorTotalLetras} (
          {formatCurrency(valorTotal)})
        </p>
        <p>
          <span className="font-semibold">Plazo:</span> {numeroCuotas} cuotas
          mensuales
        </p>
        <p>
          <span className="font-semibold">Interés corriente:</span>{" "}
          {interesCorriente}
        </p>
        <p>
          <span className="font-semibold">Interés de mora:</span> {interesMora}
        </p>
        <p>
          <span className="font-semibold">Acreedor:</span> {acreedorNombre}
        </p>
        <p>
          <span className="font-semibold">NIT acreedor:</span> {acreedorNit}
        </p>
        <p className="md:col-span-2">
          <span className="font-semibold">Lugar de pago:</span> {ciudadPago}
        </p>
      </div>

      <article className="mt-8 space-y-5 text-justify text-[15px] leading-7 text-neutral-900">
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
          <strong>PRIMERO. OBJETO:</strong> Que pagaré incondicionalmente, de
          manera indivisible y a la orden de <strong>{acreedorNombre}</strong>, o
          de quien represente sus derechos, o de quien en el futuro ostente
          legítimamente la calidad de acreedor, la suma de{" "}
          <strong>{valorTotalLetras}</strong> ({formatCurrency(valorTotal)}),
          junto con los intereses corrientes y moratorios a que haya lugar, de
          conformidad con las condiciones aquí pactadas.
        </p>

        <p>
          <strong>SEGUNDO. INTERESES:</strong> Sobre la suma adeudada reconoceré
          intereses corrientes a la tasa de <strong>{interesCorriente}</strong>,
          sin que exceda la tasa máxima legal permitida. En caso de mora en el
          pago total o parcial de cualquiera de las cuotas pactadas, reconoceré
          intereses moratorios a la tasa de <strong>{interesMora}</strong>,
          liquidados sobre las sumas vencidas y no pagadas.
        </p>

        <p>
          <strong>TERCERO. PLAZO Y FORMA DE PAGO:</strong> La obligación
          contenida en este pagaré será pagada en <strong>{numeroCuotas}</strong>{" "}
          cuotas mensuales, iguales y sucesivas, cada una por valor de{" "}
          <strong>{valorCuotaLetras}</strong> ({formatCurrency(valorCuota)}). La
          primera cuota deberá pagarse a partir del mes de{" "}
          <strong>{fechaPrimeraCuota}</strong> y las demás en forma mensual y
          consecutiva hasta la cancelación total de la obligación.
        </p>

        <p>
          <strong>CUARTO. RELACIÓN CON LA LIBRANZA:</strong> El presente pagaré
          respalda las obligaciones derivadas de la libranza y/o autorización de
          descuento suscrita por el deudor a favor de{" "}
          <strong>{acreedorNombre}</strong>. En consecuencia, el deudor reconoce
          que los pagos podrán ser recaudados mediante descuento de nómina
          conforme a la autorización otorgada de manera separada. La existencia de
          la libranza no limita, modifica ni reemplaza la fuerza ejecutiva del
          presente pagaré.
        </p>

        <p>
          <strong>QUINTO. MORA:</strong> El simple retardo en el pago de
          cualquiera de las cuotas pactadas constituirá en mora al deudor, sin
          necesidad de requerimiento judicial o extrajudicial, ni constitución en
          mora previa.
        </p>

        <p>
          <strong>SEXTO. CLÁUSULA ACELERATORIA:</strong> El tenedor legítimo de
          este pagaré podrá declarar vencido anticipadamente el plazo de todas las
          cuotas pendientes y exigir de inmediato el pago total de la obligación,
          judicial o extrajudicialmente, en cualquiera de los siguientes casos: a)
          cuando el deudor incurra en mora en el pago de una o más cuotas; b)
          cuando el deudor incumpla cualquiera de las obligaciones contenidas en
          este pagaré o en la libranza relacionada; c) cuando termine, se suspenda
          o se modifique la relación laboral o contractual que sirve de base al
          descuento por nómina; d) cuando los descuentos de nómina no puedan
          realizarse por cualquier causa; e) cuando se inicie proceso de
          insolvencia, embargo o persecución judicial de bienes del deudor; f) en
          los demás casos previstos en la ley.
        </p>

        <p>
          <strong>SÉPTIMO. PAGO DIRECTO EN AUSENCIA DE DESCUENTO:</strong> En caso
          de que por cualquier motivo no sea posible efectuar el descuento por
          nómina, el deudor se obliga a pagar directamente las cuotas pendientes
          en las fechas pactadas, sin que ello implique novación de la obligación
          ni modificación de las condiciones del presente pagaré.
        </p>

        <p>
          <strong>OCTAVO. GASTOS DE COBRANZA:</strong> Serán a cargo del deudor
          todos los gastos y costos que ocasione el cobro judicial o extrajudicial
          de la obligación, incluidos honorarios de abogado, costas, agencias en
          derecho, impuestos y demás erogaciones legalmente procedentes.
        </p>

        <p>
          <strong>NOVENO. CESIÓN Y ENDOSO:</strong> El acreedor queda expresamente
          facultado para ceder, negociar, endosar, transferir o enajenar a
          cualquier título el presente pagaré y los derechos incorporados en él,
          sin necesidad de notificación previa al deudor.
        </p>

        <p>
          <strong>DÉCIMO. AUTORIZACIÓN DE CONSULTA Y REPORTE:</strong> El deudor
          autoriza de manera expresa, previa, informada e irrevocable a{" "}
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
          <strong>DÉCIMO PRIMERO. LUGAR DE CUMPLIMIENTO:</strong> Para todos los
          efectos legales, el lugar de cumplimiento de las obligaciones derivadas
          del presente pagaré será la ciudad de <strong>{ciudadPago}</strong>.
        </p>

        <p>
          <strong>DÉCIMO SEGUNDO. MÉRITO EJECUTIVO:</strong> El deudor reconoce
          expresamente que el presente documento presta mérito ejecutivo y contiene
          una obligación clara, expresa y exigible.
        </p>

        <p>
          <strong>DÉCIMO TERCERO. ACEPTACIÓN:</strong> Declaro que he leído,
          entendido y aceptado integralmente el contenido del presente pagaré, y
          que lo suscribo de manera libre y voluntaria.
        </p>

        <p>
          En constancia, se suscribe en <strong>{ciudadFirma}</strong> el día{" "}
          <strong>{fechaSuscripcionTexto}</strong>.
        </p>
      </article>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            El deudor
          </h3>
          <SignatureBlock signer={deudorSigner} signature={deudorSignature} />
          <div className="mt-3 text-sm text-neutral-700">
            <p>
              <span className="font-medium">Nombre:</span> {deudorNombre}
            </p>
            <p>
              <span className="font-medium">C.C.:</span> {deudorDocumento} de{" "}
              {deudorDocumentoDe}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
            El acreedor
          </h3>
          <SignatureBlock signer={acreedorSigner} signature={acreedorSignature} />
          <div className="mt-3 text-sm text-neutral-700">
            <p>
              <span className="font-medium">Razón social:</span> {acreedorNombre}
            </p>
            <p>
              <span className="font-medium">NIT:</span> {acreedorNit}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border-soft bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="h-1 bg-linear-to-r from-gold to-gold-dark" />

        <div className="relative px-8 py-7">
          {saving && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm">
              <svg
                className="h-8 w-8 animate-spin text-gold"
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
              <p className="text-[13px] font-semibold text-ink">
                Guardando firma del pagaré...
              </p>
            </div>
          )}

          {showReadonlyMode ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2d6a4f"
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
                  <h3 className="m-0 font-serif text-[17px] text-ink">
                    {mode === "view"
                      ? "Pagaré firmado"
                      : "¡Pagaré firmado correctamente!"}
                  </h3>
                  <p className="mt-1 mb-0 text-[13px]">
                    {mode === "view"
                      ? "Este pagaré ya fue firmado y se muestra en modo solo lectura."
                      : "Tu firma ha sido registrada correctamente."}
                  </p>

                  <p className="mt-2 mb-0 text-[12px] ">
                    Número de pagaré:{" "}
                    <span className="font-semibold text-ink">
                      {pagare.number}
                    </span>
                  </p>

                  {pagare.signedAt ? (
                    <p className="mt-1 mb-0 text-[12px] ">
                      Fecha de firma:{" "}
                      <span className="font-semibold text-ink">
                        {formatDateTimeText(pagare.signedAt)}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 mb-0 text-[12px] ">
                      Estado:{" "}
                      <span className="font-semibold text-ink">
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
                className={`flex flex-wrap items-center justify-between gap-4 ${
                  showPad ? "mb-5" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">✍️</span>
                  <div>
                    <h2 className="m-0 font-serif text-[19px] text-ink">
                      Firmar Pagaré
                    </h2>
                    <p className="mt-0.75 mb-0 text-[13px]">
                      Pagaré No. {pagare.number} listo para firma
                    </p>
                  </div>
                </div>

                {!showPad && (
                  <button
                    onClick={() => setShowPad(true)}
                    className="cursor-pointer rounded-lg border-none bg-ink px-6 py-2.5 text-[13px] font-semibold text-gold"
                  >
                    ✍️ Firmar ahora
                  </button>
                )}
              </div>

              {showPad && (
                <div>
                  <div className="rounded-xl border border-border-soft bg-[#fcfcfc] p-4">
                    <SignaturePad onSave={handleSign} disabled={saving} />
                  </div>

                  {error && (
                    <p className="mt-3 text-[13px] font-medium text-[#8b3a3a]">
                      ⚠ {error}
                    </p>
                  )}

                  <div className="mt-3 flex justify-start">
                    <button
                      onClick={() => {
                        setShowPad(false);
                        setError("");
                      }}
                      className="cursor-pointer rounded-lg border border-border-soft bg-red-500 px-4 py-1.5 text-xs text-white"
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