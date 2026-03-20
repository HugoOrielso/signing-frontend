import Image from "next/image";
import { LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";

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
  const contractedSigner = signers.find((s) => s.partyRole === "CONTRACTED");
  const contractedSig = signatures.find((sig) => sig.signerId === contractedSigner?.id);
  const alreadySigned = !!contractedSig;

  return (
    <div className="my-1 grid grid-cols-2 gap-3">
      <div className="flex min-h-28 flex-col rounded-sm border border-neutral-400 p-1 text-[9.5px] text-ink">
        <p className="mb-2 text-[7px] leading-[1.45] text-justify font-semibold text-ink">
          He recibido en perfecto estado y a mi entera conformidad, los libros
          aquí descritos, manifestando tener conocimiento de que la empresa
          DIMCULTURA S.A.S. no permitirá la anulación o devolución después de
          firmada esta libranza. Toda devolución genera una indemnización del
          37% del valor de la misma.
        </p>

        <p className="mt-auto font-bold uppercase tracking-[0.03em] text-ink">
          Acepto el descuento y recibo en conformidad
        </p>

        <div className="mt-3 border-b border-ink" />
      </div>

      <div
        className="flex min-h-28 flex-col rounded-sm  p-1 text-[9.5px]"
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

        <div className="mt-2 flex flex-1 items-center justify-center rounded-sm bg-cream">
          {alreadySigned ? (
            contractedSig.type === "DRAWN" && contractedSig.imageUrl ? (
              <div className="relative h-11.5 w-full">
                <Image
                  src={contractedSig.imageUrl}
                  alt="Firma del cliente"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ) : (
              <span
                className="leading-none text-ink"
                style={{
                  fontFamily: '"Dancing Script", cursive',
                  fontSize: 22,
                }}
              >
                {contractedSig.typedValue}
              </span>
            )
          ) : showSignatureZone ? (
            <span
              className="rounded-sm border border-dashed px-2 py-1 text-[6.5px] tracking-[0.12em] text-gold"
              style={{ borderColor: "var(--color-gold)" }}
            >
              PENDIENTE DE FIRMA
            </span>
          ) : (
            <span className="text-[6.5px] text-black tracking-[0.12em] ">
              FIRMA DEL CLIENTE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}