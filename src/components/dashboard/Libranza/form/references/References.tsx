'use client';

import { ReferenceItem, ReferenceType } from "@/types/libranza";

const inputClass =
  'w-full rounded-md border border-border-soft bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-[#c0b8ac] focus:border-gold focus:ring-4 focus:ring-[rgba(201,168,76,0.12)]';
const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[1px] text-ink';


export function emptyReference(type: ReferenceType = 'PERSONAL'): ReferenceItem {
  return { type, name: '', phone: '', email: '', company: '', position: '', relation: '' };
}

interface Props {
  value:    ReferenceItem[];
  onChange: (refs: ReferenceItem[]) => void;
}

export default function ReferencesSection({ value, onChange }: Props) {

  function add(type: ReferenceType) {
    onChange([...value, emptyReference(type)]);
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function update(i: number, patch: Partial<ReferenceItem>) {
    onChange(value.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  }

  return (
    <section className="mb-6 rounded-xl border border-border-soft bg-white p-7">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-border-soft pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">
            👥
          </span>
          <h2 className="m-0 font-serif text-lg text-ink">Referencias</h2>
        </div>

        {/* Botones agregar */}
        <div className="flex gap-2">
          <button type="button" onClick={() => add('PERSONAL')}
            className="rounded-lg border border-border-soft bg-cream px-3 py-1.5 text-xs font-semibold text-ink cursor-pointer hover:border-gold transition-colors">
            + Personal
          </button>
          <button type="button" onClick={() => add('LABORAL')}
            className="rounded-lg border border-border-soft bg-cream px-3 py-1.5 text-xs font-semibold text-ink cursor-pointer hover:border-gold transition-colors">
            + Laboral
          </button>
        </div>
      </div>

      {/* Lista de referencias */}
      {value.length === 0 ? (
        <p className="text-center  py-1">
          Sin referencias — agrega una personal o laboral
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {value.map((ref, i) => (
            <div key={i} className="rounded-lg border border-border-soft p-4 relative">

              {/* Badge tipo + botón eliminar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={[
                    'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
                    ref.type === 'PERSONAL'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200',
                  ].join(' ')}>
                    {ref.type === 'PERSONAL' ? '👤 Personal' : '🏢 Laboral'}
                  </span>

                  {/* Selector de tipo */}
                  <button type="button"
                    onClick={() => update(i, {
                      type: ref.type === 'PERSONAL' ? 'LABORAL' : 'PERSONAL',
                      company: '', position: '', relation: '',
                    })}
                    className="text-[10px] text-muted underline cursor-pointer bg-transparent border-none">
                    Cambiar tipo
                  </button>
                </div>

                <button type="button" onClick={() => remove(i)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-700 text-white text-lg cursor-pointer border-none">
                  ×
                </button>
              </div>

              {/* Campos comunes */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nombre completo *</label>
                  <input className={inputClass} placeholder="Nombre de la referencia"
                    value={ref.name} onChange={e => update(i, { name: e.target.value })}
                    required type="text" />
                </div>

                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input className={inputClass} placeholder="+57 300 000 0000"
                    value={ref.phone} onChange={e => update(i, { phone: e.target.value })}
                    type="tel" />
                </div>

                <div>
                  <label className={labelClass}>Correo electrónico</label>
                  <input className={inputClass} placeholder="correo@ejemplo.com"
                    value={ref.email} onChange={e => update(i, { email: e.target.value })}
                    type="email" />
                </div>

                {/* Campos específicos PERSONAL */}
                {ref.type === 'PERSONAL' && (
                  <div>
                    <label className={labelClass}>Parentesco / Relación</label>
                    <input className={inputClass} placeholder="Ej: Familiar, Amigo, Vecino"
                      value={ref.relation} onChange={e => update(i, { relation: e.target.value })}
                      type="text" />
                  </div>
                )}

                {/* Campos específicos LABORAL */}
                {ref.type === 'LABORAL' && (
                  <>
                    <div>
                      <label className={labelClass}>Empresa</label>
                      <input className={inputClass} placeholder="Nombre de la empresa"
                        value={ref.company} onChange={e => update(i, { company: e.target.value })}
                        type="text" />
                    </div>
                    <div>
                      <label className={labelClass}>Cargo</label>
                      <input className={inputClass} placeholder="Cargo que desempeña"
                        value={ref.position} onChange={e => update(i, { position: e.target.value })}
                        type="text" />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}