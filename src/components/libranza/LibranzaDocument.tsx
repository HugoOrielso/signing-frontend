import { LibranzaDataPreview, LibranzaSignature, LibranzaSigner } from "@/types/libranza";
import { LibranzaHeader } from "./LibranzaDocument/LibranzaHeader";
import { LibranzaBody } from "./LibranzaDocument/LibranzaBody";
import { LibranzaSignatureSection } from "./LibranzaDocument/LibranzaSignatureSection";

interface Props {
  data: LibranzaDataPreview;
  signatures?: LibranzaSignature[];
  signers?: LibranzaSigner[];
  showSignatureZone: boolean;
  templateKey?: string
}

export function LibranzaDocument({
  data,
  signatures = [],
  signers = [],
  showSignatureZone,
  templateKey
}: Props) {
  console.log(data)
  return (
    <div className="w-full bg-white p-6 text-[11px] text-black">
      <LibranzaHeader data={data} templateKey={templateKey} />
      <LibranzaBody data={data} templateKey={templateKey ?? ''} />
      <LibranzaSignatureSection
        data={data}
        signatures={signatures}
        signers={signers}
        showSignatureZone={showSignatureZone}
      />
    </div>
  );
}