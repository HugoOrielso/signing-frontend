'use client';

import { ReferenceItem } from "@/types/libranza";

const inputClass =
  'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-black outline-none transition-all placeholder:text-gray-500 focus:border-blue-100 focus:ring-4 focus:ring-blue-50';

const inputErrorClass =
  'border-red-500 focus:border-red-500 focus:ring-red-100';

const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[1px] text-main';

export function buildDefaultReferences(): ReferenceItem[] {
  return [
    {
      type: 'PERSONAL',
      name: '',
      phone: '',
      email: '',
      company: '',
      position: '',
      relationShip: '',
    },
    {
      type: 'LABORAL',
      name: '',
      phone: '',
      email: '',
      company: '',
      position: '',
      relationShip: '',
    },
  ];
}

interface Props {
  value: ReferenceItem[];
  onChange: (refs: ReferenceItem[]) => void;
  errors?: Record<string, string>;
}

function ensureReferences(value: ReferenceItem[]): ReferenceItem[] {
  const personal =
    value.find((ref) => ref.type === 'PERSONAL') ?? {
      type: 'PERSONAL' as const,
      name: '',
      phone: '',
      email: '',
      company: '',
      position: '',
      relationShip: '',
    };

  const laboral =
    value.find((ref) => ref.type === 'LABORAL') ?? {
      type: 'LABORAL' as const,
      name: '',
      phone: '',
      email: '',
      company: '',
      position: '',
      relationShip: '',
    };

  return [personal, laboral];
}

export default function ReferencesSection({
  value,
  onChange,
  errors = {},
}: Props) {
  const references = ensureReferences(value);

  function update(type: 'PERSONAL' | 'LABORAL', patch: Partial<ReferenceItem>) {
    const updated = references.map((ref) =>
      ref.type === type ? { ...ref, ...patch } : ref
    );
    onChange(updated);
  }

  function getInputClass(field: string) {
    return `${inputClass} ${errors[field] ? inputErrorClass : ''}`;
  }

  function renderError(field: string) {
    if (!errors[field]) return null;
    return <p className="mt-1 text-xs text-red-600">{errors[field]}</p>;
  }

  const personal = references[0];
  const laboral = references[1];

  return (
    <section >
      <div className="mb-5 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center rounded-lg text-base">
            👥
          </span>
          <h2 className="m-0 font-serif text-lg text-ink">Referencias</h2>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* REFERENCIA PERSONAL */}
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              👤 Referencia personal
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre completo *</label>
              <input
                className={getInputClass('references.0.name')}
                placeholder="Nombre de la referencia"
                value={personal.name}
                onChange={(e) => update('PERSONAL', { name: e.target.value })}
                required
                type="text"
              />
              {renderError('references.0.name')}
            </div>

            <div>
              <label className={labelClass}>Teléfono *</label>
              <input
                className={getInputClass('references.0.phone')}
                placeholder="+57 300 000 0000"
                value={personal.phone}
                onChange={(e) => update('PERSONAL', { phone: e.target.value })}
                required
                type="tel"
              />
              {renderError('references.0.phone')}
            </div>

            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                className={getInputClass('references.0.email')}
                placeholder="correo@ejemplo.com"
                value={personal.email}
                onChange={(e) => update('PERSONAL', { email: e.target.value })}
                type="email"
              />
              {renderError('references.0.email')}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Parentesco / Relación *</label>
              <input
                className={getInputClass('references.0.relationShip')}
                placeholder="Ej: Familiar, Amigo, Vecino"
                value={personal.relationShip}
                onChange={(e) =>
                  update('PERSONAL', { relationShip: e.target.value })
                }
                type="text"
              />
              {renderError('references.0.relationShip')}
            </div>
          </div>
        </div>

        {/* REFERENCIA LABORAL */}
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              🏢 Referencia laboral
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre completo *</label>
              <input
                className={getInputClass('references.1.name')}
                placeholder="Nombre de la referencia"
                value={laboral.name}
                onChange={(e) => update('LABORAL', { name: e.target.value })}
                required
                type="text"
              />
              {renderError('references.1.name')}
            </div>

            <div>
              <label className={labelClass}>Teléfono *</label>
              <input
                className={getInputClass('references.1.phone')}
                placeholder="+57 300 000 0000"
                value={laboral.phone}
                onChange={(e) => update('LABORAL', { phone: e.target.value })}
                required
                type="tel"
              />
              {renderError('references.1.phone')}
            </div>

            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                className={getInputClass('references.1.email')}
                placeholder="correo@ejemplo.com"
                value={laboral.email}
                onChange={(e) => update('LABORAL', { email: e.target.value })}
                type="email"
              />
              {renderError('references.1.email')}
            </div>

            <div>
              <label className={labelClass}>Empresa</label>
              <input
                className={getInputClass('references.1.company')}
                placeholder="Nombre de la empresa"
                value={laboral.company}
                onChange={(e) => update('LABORAL', { company: e.target.value })}
                type="text"
              />
              {renderError('references.1.company')}
            </div>

            <div>
              <label className={labelClass}>Cargo</label>
              <input
                className={getInputClass('references.1.position')}
                placeholder="Cargo que desempeña"
                value={laboral.position}
                onChange={(e) => update('LABORAL', { position: e.target.value })}
                type="text"
              />
              {renderError('references.1.position')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}