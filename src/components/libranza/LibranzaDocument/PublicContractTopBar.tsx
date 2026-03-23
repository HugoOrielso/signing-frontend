import { getStatusMeta } from "./contractStatus";

interface Props {
  isAdmin: boolean;
  clientEmail: string | null;
  status: string;
}

export function PublicContractTopBar({ isAdmin, clientEmail, status }: Props) {
  const st = getStatusMeta(status);

  return (
    <div className="bg-white border-b border-border-soft px-6 py-3.5 flex items-center justify-between">

      <div className="font-serif text-[17px] text-ink font-bold">
        Dimcultura <em className="text-gold-dark">S.A.S</em>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#1e1b4b] text-[#a5b4fc] uppercase tracking-widest">
            Vista admin
          </span>
        )}

        {!isAdmin && clientEmail && (
          <span className="text-[11px] text-muted">✓ {clientEmail}</span>
        )}

        <span
          className="text-[11px] font-semibold px-3 py-1.25 rounded-full uppercase tracking-widest"
          style={{ background: st.bg, color: st.color }}
        >
          {st.label}
        </span>
      </div>
    </div>
  );
}