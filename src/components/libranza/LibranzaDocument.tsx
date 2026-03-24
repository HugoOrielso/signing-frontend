import {  LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { LibranzaHeader } from "./LibranzaDocument/LibranzaHeader";
import { LibranzaBody } from "./LibranzaDocument/LibranzaBody";
import { LibranzaSignatureSection } from "./LibranzaDocument/LibranzaSignatureSection";
import { LibranzaProductsTable } from "./LibranzaDocument/LibranzaProductsTable";
import { LibranzaPaymentSection } from "./LibranzaDocument/LibranzaPaymentSection";

interface Props {
  data: LibranzaDataPreview;
  signatures?: LibranzaSignature[];
  signers?: LibranzaSigner[];
  showSignatureZone: boolean;
}

export function LibranzaDocument({
  data,
  signatures = [],
  signers = [],
  showSignatureZone,
}: Props) {
  console.log(data)
  return (
    <div className="text-[11px] text-white w-full p-1 bg-white">
      <LibranzaHeader data={data} />
      <LibranzaBody data={data} />
      <LibranzaSignatureSection
        data={data}
        signatures={signatures}
        signers={signers}
        showSignatureZone={showSignatureZone}
      />
      <LibranzaProductsTable productos={data.productos ?? []} />
      <LibranzaPaymentSection data={data} />
    </div>
  );
}