"use client";

import { useState } from "react";

type ConfirmSignModalProps = {
  signerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirming: boolean;
};

export function ConfirmSignModal({
  onConfirm,
  onCancel,
  confirming,
}: ConfirmSignModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
        <div className="h-1.5 shrink-0 bg-linear-to-r from-blue-500 via-blue-700 to-ink" />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="shrink-0 rounded-full">
              <span className="text-[22px]">✍️</span>
            </div>

            <div>
              <h2 className="m-0 font-serif text-[18px] text-ink sm:text-[19px]">
                Confirmar Firma
              </h2>
              <p className="mb-0 mt-1 text-xs text-muted">
                Revisa y acepta los términos antes de firmar
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border-soft bg-neutral-50 p-4 text-[11px] leading-relaxed text-neutral-700 sm:text-xs">
            <p className="mb-2 font-medium text-neutral-800">
              Consentimiento y validez jurídica de la firma electrónica
            </p>

            <p className="mb-2">
              De conformidad con la Ley 527 de 1999 y el Decreto 2364 de
              2012 de la República de Colombia, las partes reconocen y aceptan
              que la firma electrónica realizada mediante este sistema tiene
              plena validez jurídica, fuerza probatoria y efectos vinculantes
              equivalentes a una firma manuscrita.
            </p>

            <p className="mb-2">
              El firmante declara que los datos suministrados son auténticos,
              que actúa en nombre propio y que manifiesta de manera libre,
              expresa e informada su consentimiento para suscribir
              electrónicamente el presente documento.
            </p>

            <p className="mb-2">
              La aceptación electrónica podrá realizarse mediante mecanismos de
              autenticación como códigos OTP, validación de identidad, correo
              electrónico, dirección IP, biometría, registros de trazabilidad y
              demás métodos técnicamente válidos conforme a la legislación
              colombiana.
            </p>

            <p>
              El firmante reconoce que el documento electrónico y los registros
              asociados podrán ser utilizados como medio de prueba ante cualquier
              autoridad administrativa o judicial competente.
            </p>
          </div>

          <label className="mt-4 flex cursor-pointer select-none items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="sr-only"
            />

            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-2 transition-all duration-150 ${
                accepted ? "border-gold bg-ink" : "border-border-soft bg-white"
              }`}
            >
              {accepted && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="#c9a84c"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            <span className="text-xs leading-relaxed text-ink sm:text-sm">
              He leído y acepto los términos anteriores. Autorizo el uso de
              mecanismos de firma electrónica y reconozco que esta firma tiene
              plena validez legal y efectos vinculantes conforme a la
              legislación colombiana.
            </span>
          </label>
        </div>

        <div className="shrink-0 border-t border-border-soft bg-white px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              disabled={confirming}
              className="w-full rounded-[10px] border border-border-soft bg-red-500 px-4 py-3 text-xs font-semibold text-muted transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={!accepted || confirming}
              className={`flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-3 text-xs font-semibold transition-all duration-200 sm:flex-[2] ${
                accepted && !confirming
                  ? "cursor-pointer bg-ink text-gold"
                  : "cursor-not-allowed bg-[#e8e4da] text-muted"
              }`}
            >
              {confirming ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
                  Registrando firma…
                </>
              ) : (
                <>✍️ Confirmar y Firmar</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}