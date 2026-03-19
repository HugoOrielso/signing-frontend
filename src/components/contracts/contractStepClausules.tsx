"use client";

import { useContractStore } from "@/store/contractStore";
import { ContractClauseItem } from "@/types/contract";

// ── Design tokens ─────────────────────────────────────────────────────────────
const INK    = "#1a1a2e";
const GOLD   = "#c9a84c";
const GOLD_D = "#a07830";
const CREAM  = "#f5f0e8";
const BORDER = "#d4c9b0";
const MUTED  = "#7a6e5f";

// ── Main component ─────────────────────────────────────────────────────────────
export default function ContractStepClauses() {
  const clauses      = useContractStore((s) => s.clauses);
  const addClause    = useContractStore((s) => s.addClause);
  const updateClause = useContractStore((s) => s.updateClause);
  const removeClause = useContractStore((s) => s.removeClause);
  const nextStep     = useContractStore((s) => s.nextStep);
  const prevStep     = useContractStore((s) => s.prevStep);

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif" }}>

      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 32, color: INK, marginBottom: 4 }}>
          Cláusulas del Contrato
        </h1>
        <p className="text-[15px] font-light" style={{ color: MUTED }}>
          Agrega y personaliza las cláusulas del contrato
        </p>
      </div>

      {/* ── Card ── */}
      <div className="bg-white border-[1.5px] rounded-xl p-7 mb-6" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2.5 pb-3 mb-5 border-b" style={{ borderColor: BORDER }}>
          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: CREAM }}>
            📋
          </span>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: 18, color: INK, margin: 0 }}>
            Cláusulas
          </h2>
        </div>

        {/* Clause list */}
        <div className="space-y-3">
          {clauses.map((clause, index) => (
            <ClauseItem
              key={clause.id}
              clause={clause}
              index={index}
              canRemove={clauses.length > 1}
              onUpdate={(content) => updateClause(clause.id, content)}
              onRemove={() => removeClause(clause.id)}
            />
          ))}
        </div>

        {/* Add clause */}
        <button
          type="button"
          onClick={addClause}
          className="w-full mt-4 py-3.5 rounded-xl border-2 border-dashed text-[13px] font-medium
            flex items-center justify-center gap-2 transition-all cursor-pointer"
          style={{ borderColor: BORDER, color: MUTED, background: "transparent" }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = GOLD;
            e.currentTarget.style.color       = GOLD_D;
            e.currentTarget.style.background  = CREAM;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.color       = MUTED;
            e.currentTarget.style.background  = "transparent";
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar cláusula
        </button>
      </div>

      {/* ── Nav ── */}
      <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: BORDER }}>
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2.75 rounded-lg text-[13px] font-semibold border-[1.5px] transition-all cursor-pointer"
          style={{ borderColor: BORDER, color: INK, background: "transparent" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD_D; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = INK; }}
        >
          ← Anterior
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2.75 rounded-lg text-[13px] font-semibold border-2 transition-all
            cursor-pointer hover:opacity-90 hover:-translate-y-px"
          style={{ background: INK, color: GOLD, borderColor: INK }}
        >
          Siguiente: Firmantes →
        </button>
      </div>
    </div>
  );
}

// ── Clause item ───────────────────────────────────────────────────────────────
function ClauseItem({
  clause, index, canRemove, onUpdate, onRemove,
}: {
  clause: ContractClauseItem;
  index: number;
  canRemove: boolean;
  onUpdate: (content: string) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4 transition-all"
      style={{ background: CREAM, borderColor: BORDER }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
    >
      {/* Number badge */}
      <span
        className="min-w-6.5 h-6.5 rounded-full flex items-center justify-center
          text-[11px] font-bold shrink-0 mt-0.5"
        style={{ background: INK, color: "white" }}
      >
        {index + 1}
      </span>

      {/* Textarea */}
      <textarea
        value={clause.content}
        onChange={e => onUpdate(e.target.value)}
        rows={3}
        placeholder="Escribe aquí el texto de la cláusula..."
        className="flex-1 bg-transparent border-0 outline-none resize-none text-[13px] leading-relaxed"
        style={{ color: "#2d2d4e", fontFamily: "DM Sans, sans-serif" }}
        onInput={e => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
        }}
      />

      {/* Remove */}
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0
            text-sm mt-0.5 cursor-pointer transition-all hover:bg-red-50 hover:border-red-300 hover:text-red-500"
          style={{ borderColor: BORDER, background: "white", color: MUTED }}
        >
          ×
        </button>
      )}
    </div>
  );
}