"use client"
import { useState } from "react";

export function ConfirmSignModal({ signerName, onConfirm, onCancel, confirming }: {
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
        <div className="h-1.25 bg-linear-to-r from-gold via-gold-dark to-ink" />

        <div className="px-8 pt-7">

          {/* Title row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-cream flex items-center justify-center shrink-0">
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

          {/* Signer name */}
          {/* <div className="bg-cream rounded-[10px] px-4 py-3 mb-4 border border-border-soft">
            <p className="text-[11px] mb-0.75 uppercase tracking-widest font-semibold">
              Firmante
            </p>
            <p className="text-[15px] font-bold text-ink m-0">
              {signerName}
            </p>
          </div> */}

          {/* Legal text */}
          <div className="bg-[#fafafa] rounded-[10px] px-4 py-3.5 mb-5 border border-border-soft max-h-50 overflow-y-auto text-[11px] text-[#4a4a6a] leading-[1.7]">
            <p className="font-bold text-ink mb-2 text-xs mt-0">
              Declaración de Firma Electrónica
            </p>
            <p className="mb-2 mt-0">
              Al firmar este documento, yo <strong>{signerName}</strong>, declaro bajo la gravedad
              de juramento que:
            </p>
            <ul className="mb-2 mt-0 pl-4.5">
              <li className="mb-1">He leído y entendido completamente el contenido de
                esta Libranza de Autorización de Descuento.</li>
              <li className="mb-1">Acepto voluntariamente los términos y condiciones
                establecidos en el documento, incluyendo la autorización de descuento por nómina
                a favor de <strong>DIMCULTURA S.A.S.</strong></li>
              <li className="mb-1">Autorizo el descuento de las cuotas pactadas de mi
                salario o cualquier otro concepto laboral.</li>
              <li className="mb-1">Comprendo que esta firma electrónica tiene plena
                validez legal conforme a la <strong>Ley 527 de 1999</strong> (Comercio Electrónico
                en Colombia) y el <strong>Decreto 2364 de 2012</strong> sobre firma electrónica.</li>
              <li className="mb-1">La presente autorización es irrevocable una vez firmada,
                salvo acuerdo escrito entre las partes.</li>
            </ul>
            <p className="mb-2 mt-0 text-[10.5px] ">
              Esta firma electrónica genera los mismos efectos jurídicos que una firma manuscrita,
              de acuerdo con la normatividad colombiana vigente. Se registrará la fecha, hora,
              dirección IP y agente de usuario del dispositivo utilizado para firmar.
            </p>
            <p className="m-0 text-[10.5px] ">
              Al confirmar, acepta también la <strong>Política de Tratamiento de Datos Personales
              </strong> de DIMCULTURA S.A.S. conforme a la Ley 1581 de 2012.
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-6 select-none">
            <div
              onClick={() => setAccepted(a => !a)}
              className={`w-5 h-5 rounded-[5px] shrink-0 mt-px border-2 flex items-center justify-center transition-all duration-150 cursor-pointer
                ${accepted ? "border-gold bg-ink" : "border-border-soft bg-white"}`}
            >
              {accepted && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#c9a84c" strokeWidth={2}
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-xs text-ink leading-relaxed">
              He leído y acepto los términos anteriores. Entiendo que esta firma electrónica
              tiene validez legal y es vinculante para las partes involucradas.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-7 flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirming}
            className="flex-1 py-3 rounded-[10px] border border-border-soft  text-muted text-[13px] font-semibold cursor-pointer bg-red-500 "
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!accepted || confirming}
            className={`flex-2 py-3 rounded-[10px] border-none text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${accepted && !confirming
                ? "bg-ink text-gold cursor-pointer"
                : "bg-[#e8e4da] text-muted cursor-not-allowed"
              }`}
          >
            {confirming ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gold border-t-transparent animate-spin" />
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