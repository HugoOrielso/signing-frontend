'use client';
// LibranzaWizard.tsx — 2-step wizard: Form → Preview+Send

import { useState, useCallback } from 'react';
import LibranzaStepForm    from './LibranzaStepForm';
import LibranzaStepPreview from './LibranzaStepPreview';
import { emptyLibranza, LibranzaForm } from '@/types/libranza';

const INK  = '#1a1a2e';
const GOLD = '#c9a84c';

const STEPS = [
  { n: 1, label: 'Datos'      },
  { n: 2, label: 'Vista Previa y Envío' },
];

export default function LibranzaWizard() {
  const [form,  setForm]  = useState<LibranzaForm>(emptyLibranza);
  const [step,  setStep]  = useState(1);

  const set = useCallback(<K extends keyof LibranzaForm>(key: K, val: LibranzaForm[K]) => {
    setForm(prev => ({ ...prev, [key]: val }));
  }, []);

  const goStep = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#faf8f3', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-10 border-b-2"
        style={{ background: INK, borderColor: GOLD, height: 64 }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: GOLD, letterSpacing: 1 }}>
          Contract<em style={{ color: 'white' }}>Sign</em>
          <span style={{ color: '#5a5a7a', fontSize: 13, marginLeft: 10, fontStyle: 'normal' }}>
            / Nueva Libranza
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done   = step > s.n;
            const active = step === s.n;
            return (
              <div key={s.n} className="flex items-center gap-2">
                <button
                  onClick={() => done && goStep(s.n)}
                  disabled={!done}
                  className="flex items-center gap-2 transition-all"
                  style={{ background: 'transparent', border: 'none', cursor: done ? 'pointer' : 'default' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    background: done ? `linear-gradient(135deg, ${GOLD}, #a07830)` : active ? INK : '#2d2d4e',
                    color:      done ? INK : active ? GOLD : '#5a5a7a',
                    border:     active ? `2px solid ${GOLD}` : '2px solid transparent',
                  }}>
                    {done ? '✓' : s.n}
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    color: active ? GOLD : done ? '#a07830' : '#5a5a7a',
                  }}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 32, height: 2,
                    background: done
                      ? `linear-gradient(90deg, ${GOLD}, #a07830)`
                      : '#2d2d4e',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-215 mx-auto px-5 py-10">
        {step === 1 && (
          <LibranzaStepForm
            form={form}
            set={set}
            onNext={() => goStep(2)}
          />
        )}
        {step === 2 && (
          <LibranzaStepPreview
            form={form}
            onPrev={() => goStep(1)}
          />
        )}
      </main>
    </div>
  );
}