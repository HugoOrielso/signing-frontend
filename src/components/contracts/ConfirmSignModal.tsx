"use client"
import { useState } from "react";

export function ConfirmSignModal({ onConfirm, onCancel, confirming }: {
  signerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirming: boolean;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-200 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="bg-white rounded-[20px] w-full max-w-130 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.25)]">

        {/* Top gradient bar */}
        <div className="h-1.25 bg-linear-to-r from-blue-500 via-blue-700 to-ink" />

        <div className="p-3">

          {/* Title row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-full flex items-center justify-center shrink-0">
              <span className="text-[22px]">✍️</span>
            </div>
            <div>
              <h2 className="font-serif text-[19px] text-ink m-0">
                Confirmar Firma
              </h2>
              <p className="text-xs mt-0.75 mb-0">
                Revisa y acepta los términos antes de firmar
              </p>
            </div>
          </div>

          {/* Legal text */}
          {/* Consentimiento legal */}
          <div className="rounded-2xl border border-border-soft bg-neutral-50 p-4 text-[11px] leading-relaxed ">
            <p className="mb-2 font-medium text-neutral-800">
              Consentimiento y validez jurídica de la firma electrónica
            </p>

            <p className="mb-2">
              De conformidad con la Ley 527 de 1999 y el Decreto 2364 de 2012 de la
              República de Colombia, las partes reconocen y aceptan que la firma
              electrónica realizada mediante este sistema tiene plena validez jurídica,
              fuerza probatoria y efectos vinculantes equivalentes a una firma manuscrita.
            </p>

            <p className="mb-2">
              El firmante declara que los datos suministrados son auténticos, que actúa
              en nombre propio y que manifiesta de manera libre, expresa e informada su
              consentimiento para suscribir electrónicamente el presente documento.
            </p>

            <p className="mb-2">
              La aceptación electrónica podrá realizarse mediante mecanismos de
              autenticación como códigos OTP, validación de identidad, correo electrónico,
              dirección IP, biometría, registros de trazabilidad y demás métodos
              técnicamente válidos conforme a la legislación colombiana.
            </p>

            <p>
              El firmante reconoce que el documento electrónico y los registros asociados
              podrán ser utilizados como medio de prueba ante cualquier autoridad
              administrativa o judicial competente.
            </p>
          </div>

          {/* Checkbox */}
          <label
            className="flex items-start gap-3 cursor-pointer mt-2 select-none"
            onClick={() => setAccepted((a) => !a)}
          >
            <div
              className={`w-5 h-5 rounded-[5px] shrink-0 mt-px border-2 flex items-center justify-center transition-all duration-150
      ${accepted ? "border-gold bg-ink" : "border-border-soft bg-white"}`}
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
            </div>

            <span className="text-xs text-ink leading-relaxed">
              He leído y acepto los términos anteriores. Autorizo el uso de mecanismos
              de firma electrónica y reconozco que esta firma tiene plena validez legal
              y efectos vinculantes conforme a la legislación colombiana.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-7 flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="flex-1 py-3 rounded-[10px] border border-border-soft  text-muted text-[10px] font-semibold cursor-pointer bg-red-500 "
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!accepted || confirming}
            className={`flex-2 py-3 rounded-[10px] border-none text-[10px] font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${accepted && !confirming
                ? "bg-ink text-gold cursor-pointer"
                : "bg-[#e8e4da] text-muted cursor-not-allowed"
              }`}
          >
            {confirming ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full  border border-t-transparent animate-spin" />
                Registrando firma…
              </>
            ) : (
              <>✍️ Confirmar y Firmar</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}