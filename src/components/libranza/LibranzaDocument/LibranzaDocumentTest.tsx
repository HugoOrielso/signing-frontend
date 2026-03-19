import { LibranzaData, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { LibranzaHeader } from "./LibranzaHeader";
import { LibranzaBody } from "./LibranzaBody";
import { LibranzaSignatureSection } from "./LibranzaSignatureSection";
import { LibranzaProductsTable } from "./LibranzaProductsTable";
import { LibranzaPaymentSection } from "./LibranzaPaymentSection";

interface Props {
  data: LibranzaData;
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
  return (
    <div
      style={{
        fontFamily: "Arial,sans-serif",
        fontSize: 9,
        color: "#000",
        background: "white",
        width: "100%",
        padding: "5px",
        lineHeight: 1.45,
      }}
    >
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