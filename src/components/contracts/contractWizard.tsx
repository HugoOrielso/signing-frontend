"use client";

import { useContractStore } from "@/store/contractStore";
import ContractStepGeneral from "./contractStepGeneral";
import ContractStepClauses from "./contractStepClausules";
import ContractStepSigners from "./contractStepSigner";
import ContractStepReview from "./contractStepReview";

const INK    = "#1a1a2e";
const GOLD   = "#c9a84c";
const GOLD_D = "#a07830";
const CREAM  = "#f5f0e8";
const BORDER = "#d4c9b0";

const STEPS = [
  { n: 1, label: "Datos"     },
  { n: 2, label: "Cláusulas" },
  { n: 3, label: "Firmas"    },
  { n: 4, label: "Revisión"  },
];

export default function ContractWizard() {
  const step    = useContractStore((s) => s.step);
  const setStep = useContractStore((s) => s.setStep);

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif" }}>

      {/* ── Step indicator ── */}
      <div className="flex items-center mb-10">
        {STEPS.map(({ n, label }, i) => {
          const done   = n < step;
          const active = n === step;

          return (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => done && setStep(n)}
                disabled={!done}
                className="flex flex-col items-center gap-1.5"
                style={{ cursor: done ? "pointer" : "default", background: "none", border: "none", padding: 0 }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: active
                      ? INK
                      : done
                      ? `linear-gradient(135deg, ${GOLD}, ${GOLD_D})`
                      : CREAM,
                    color:     active ? GOLD : done ? "white" : BORDER,
                    border:    active ? `2px solid ${INK}` : done ? "none" : `2px solid ${BORDER}`,
                    boxShadow: active ? `0 0 0 4px rgba(201,168,76,0.15)` : "none",
                  }}
                >
                  {done ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : n}
                </div>
                <span
                  className="text-[11px] font-semibold uppercase tracking-widest hidden sm:block"
                  style={{ color: active ? INK : done ? GOLD_D : BORDER }}
                >
                  {label}
                </span>
              </button>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-2 h-px" style={{
                  background: done ? `linear-gradient(90deg, ${GOLD}, ${GOLD_D})` : BORDER,
                  marginBottom: 20,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {step === 1 && <ContractStepGeneral />}
      {step === 2 && <ContractStepClauses />}
      {step === 3 && <ContractStepSigners />}
      {step === 4 && <ContractStepReview />}
    </div>
  );
}