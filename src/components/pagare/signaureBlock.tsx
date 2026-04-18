import { LibranzaSignature, LibranzaSigner } from "@/types/libranza";

export function SignatureBlock({
  signer,
  signature,
}: {
  signer?: LibranzaSigner;
  signature?: LibranzaSignature;
}) {
  return (
    <div className="flex min-h-30 flex-col justify-end border-t border-neutral-300 pt-3">
      <div className="min-h-14">
        {signature?.type === "DRAWN" && signature.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={signature.imageUrl}
            alt={`Firma de ${signer?.name ?? "firmante"}`}
            className="max-h-14 object-contain"
          />
        ) : signature?.type === "TYPED" && signature.typedValue ? (
          <p className="text-xl italic text-neutral-900">{signature.typedValue}</p>
        ) : (
          <div className="h-14" />
        )}
      </div>

      <p className="text-sm font-semibold text-neutral-900">
        {signer?.name ?? "________________"}
      </p>
      <p className="text-xs text-neutral-600">
        {signer?.roleTitle || signer?.partyRole || ""}
      </p>

      {signature?.signedAt ? (
        <p className="mt-1 text-[11px] text-neutral-500">
          Firmado: {new Date(signature.signedAt).toLocaleString("es-CO")}
        </p>
      ) : null}
    </div>
  );
}