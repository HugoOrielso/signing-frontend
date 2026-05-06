"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});
const empresaNombre: Record<string, string> = {
  dimcultura: "DIMCULTURA S.A.S.",
  gruculcol: "GRUCULCOL",
};

interface Props {
  data: LibranzaDataPreview;
  signatures?: LibranzaSignature[];
  signers?: LibranzaSigner[];
  showSignatureZone: boolean;
}

export function LibranzaSignatureSection({
  signatures = [],
  signers = [],
  showSignatureZone,
}: Props) {
  const pathname = usePathname();
  const segment = pathname.split("/").pop()?.toLowerCase() ?? "dimcultura";
  const nombre = empresaNombre[segment] ?? "DIMCULTURA S.A.S.";

  const contractedSigner = signers.find((s) => s.partyRole === "DEUDOR");
  const contractedSig = signatures.find((sig) => sig.signerId === contractedSigner?.id);
  const alreadySigned = !!contractedSig;

  return (
    <div className="my-1 grid grid-cols-2 gap-3">

      {/* BLOQUE IZQUIERDO */}
      {/* BLOQUE IZQUIERDO */}
      <div className="flex min-h-28 flex-col rounded-sm border border-neutral-400 p-1 text-[9.5px] text-ink">

        <p className="mb-2 text-[7px] leading-[1.45] text-justify font-semibold text-ink">
          He recibido en perfecto estado y a mi entera conformidad, los libros
          aquí descritos, manifestando tener conocimiento de que la empresa{" "}
          <span className="font-bold">{nombre}</span> no permitirá la anulación
          o devolución después de firmada esta libranza. Toda devolución genera
          una indemnización del 37% del valor de la misma.
        </p>

        {/* 👉 CUADRO DE FIRMA */}
        <div className="mt-auto flex flex-col items-center gap-1">

          <div className="flex h-12 w-full items-center justify-center border rounded bg-white">
            {alreadySigned ? (
              contractedSig.type === "DRAWN" && contractedSig.imageUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={contractedSig.imageUrl}
                    alt="Firma del cliente"
                    fill
                    unoptimized
                    className="object-contain opacity-80"
                  />
                </div>
              ) : (
                <span
                  className={`text-lg leading-none text-ink ${greatVibes.className}`}
                >
                  {contractedSig.typedValue}
                </span>
              )
            ) : (
              <span className="text-[7px] text-neutral-500 text-center px-1">
                Firma cliente
              </span>
            )}
          </div>

          {/* 👉 TEXTO ABAJO (como pediste) */}
          <p className="text-[7px] font-bold uppercase tracking-[0.05em] text-ink text-center">
            Acepto el descuento y recibo en conformidad
          </p>
        </div>
      </div>

      {/* BLOQUE DERECHO (ORIGINAL) */}
      <div
        className="flex min-h-28 flex-col rounded-sm p-1 text-[9.5px]"
        style={{
          border: alreadySigned
            ? "2px solid #2d6a4f"
            : showSignatureZone
              ? "2px solid var(--color-gold)"
              : "1px solid var(--color-border-soft)",
        }}
      >
        <p className="text-[7px] font-bold uppercase leading-tight tracking-[0.03em] text-ink">
          Aprobada la autorización
          <br />
          para descuento respectivo
        </p>

        <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.04em] text-gold-dark">
          Firma
        </p>

        <div className="mt-2 flex flex-1 items-center justify-center rounded-sm border">

        </div>
      </div>
    </div>
  );
}