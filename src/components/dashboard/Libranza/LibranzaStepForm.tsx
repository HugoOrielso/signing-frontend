'use client';

import { useState } from 'react';
import { ProductoItem, LibranzaForm, ReferenceItem } from '@/types/libranza';
import { useLibranzaStore } from '@/store/libranzaStore';
import ReferencesSection from './form/references/References';

const inputClass =
  'w-full rounded-md border border-border-soft bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-[#c0b8ac] focus:border-gold focus:ring-4 focus:ring-[rgba(201,168,76,0.12)]';

const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[1px]  text-ink';

const sectionClass =
  'mb-6 rounded-xl border border-border-soft bg-white p-7';

export default function LibranzaStepForm() {
  const form = useLibranzaStore((state) => state.form);
  const setForm = useLibranzaStore((state) => state.setForm);
  const nextStep = useLibranzaStore((state) => state.nextStep);
  const [referencias, setReferencias] = useState<ReferenceItem[]>(
    (form as { referencias?: ReferenceItem[] }).referencias ?? []
  );
  const [productos, setProductos] = useState<ProductoItem[]>(
    form.productos?.length ? form.productos : [{ codigo: '', descripcion: '', valor: '' }]
  );

  const [formaPago, setFormaPago] = useState<LibranzaForm['formaPago']>(form.formaPago || '');

  const totalCompra = productos.reduce((sum, p) => {
    const value = parseFloat((p.valor || '').replace(/[^0-9.]/g, '')) || 0;
    return sum + value;
  }, 0);

  function addProducto() {
    setProductos((prev) => [...prev, { codigo: '', descripcion: '', valor: '' }]);
  }

  function removeProducto(index: number) {
    setProductos((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
  }

  function updateProducto(index: number, patch: Partial<ProductoItem>) {
    setProductos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const data: LibranzaForm = {
      ciudad: String(fd.get('ciudad') || ''),
      asesor: String(fd.get('asesor') || ''),
      fecha: String(fd.get('fecha') || ''),

      clienteNombre: String(fd.get('clienteNombre') || ''),
      clienteCC: String(fd.get('clienteCC') || ''),
      clienteCCDe: String(fd.get('clienteCCDe') || ''),
      clienteDireccion: String(fd.get('clienteDireccion') || ''),
      clienteTelefono: String(fd.get('clienteTelefono') || ''),
      clienteEmail: String(fd.get('clienteEmail') || ''),
      clienteFuncionario: String(fd.get('clienteFuncionario') || ''),
      clienteDesdeHace: String(fd.get('clienteDesdeHace') || ''),

      municipioTrabajo: String(fd.get('municipioTrabajo') || ''),
      empresaTrabajo: String(fd.get('empresaTrabajo') || ''),
      departamento: String(fd.get('departamento') || ''),

      sumaTotal: String(fd.get('sumaTotal') || ''),
      numeroCuotas: String(fd.get('numeroCuotas') || ''),
      valorCuota: String(fd.get('valorCuota') || ''),
      mesCobro: String(fd.get('mesCobro') || ''),

      tipoCuenta: (fd.get('tipoCuenta') || '') as LibranzaForm['tipoCuenta'],
      numeroCuenta: String(fd.get('numeroCuenta') || ''),
      banco: String(fd.get('banco') || ''),

      productos,

      formaPago,

      destinatarioEmail: String(fd.get('destinatarioEmail') || ''),
      destinatarioNombre: String(fd.get('destinatarioNombre') || ''),

      references: referencias,

    };

    setForm(data);
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <form onSubmit={handleSubmit} >
      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">🏢</span>
          <h2 className="m-0 font-serif text-lg text-ink">Encabezado del Documento</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>  Ciudad</label>
            <input
              name="ciudad"
              className={inputClass}
              placeholder="Cartagena"
              defaultValue={form.ciudad}
              required
              type='text'
            />
          </div>

          <div>
            <label className={labelClass}>Asesor</label>
            <input
              name="asesor"
              className={inputClass}
              placeholder="Nombre del asesor"
              defaultValue={form.asesor}
              required
              type='text'
            />
          </div>

          <div>
            <label className={labelClass}>Fecha</label>
            <input
              name="fecha"
              type="date"
              className={inputClass}
              defaultValue={
                form.fecha.includes('/') ? form.fecha.split('/').reverse().join('-') : form.fecha
              }
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">👤</span>
          <h2 className="m-0 font-serif text-lg text-ink">Datos del Cliente</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre Completo</label>
            <input
              name="clienteNombre"
              className={inputClass}
              placeholder="Nombres y apellidos completos"
              defaultValue={form.clienteNombre}
              required
              type='text'
            />
          </div>

          <div>
            <label className={labelClass}>Cédula de Ciudadanía (C.C.)</label>
            <input
              name="clienteCC"
              className={inputClass}
              placeholder="Número de cédula"
              defaultValue={form.clienteCC}
              required
              type='number' min={0}
            />
          </div>

          <div>
            <label className={labelClass}>Expedida en (ciudad)</label>
            <input name="clienteCCDe" className={inputClass} placeholder="Ciudad de expedición" defaultValue={form.clienteCCDe} required type='text'
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Dirección de Residencia</label>
            <input name="clienteDireccion" className={inputClass} placeholder="Dirección completa" defaultValue={form.clienteDireccion} required type='text'
            />
          </div>

          <div>
            <label className={labelClass}>Teléfono / Celular</label>
            <input name="clienteTelefono" type="tel" className={inputClass} placeholder="+57 300 000 0000" defaultValue={form.clienteTelefono} required
            />
          </div>

          <div>
            <label className={labelClass}>Correo Electrónico</label>
            <input name="clienteEmail" type="email" className={inputClass} placeholder="correo@ejemplo.com" defaultValue={form.clienteEmail} required
            />
          </div>

          <div>
            <label className={labelClass}>Funcionario de (empresa)</label>
            <input name="clienteFuncionario" className={inputClass} placeholder="Nombre de la empresa" defaultValue={form.clienteFuncionario} required type='text'
            />
          </div>

          <div>
            <label className={labelClass}>Desde hace</label>
            <input name="clienteDesdeHace" className={inputClass} placeholder="Ej: 2 años, 6 meses" defaultValue={form.clienteDesdeHace} required />
          </div>
        </div>
      </section>

      <ReferencesSection value={referencias} onChange={setReferencias} />


      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">🏗️</span>
          <h2 className="m-0 font-serif text-lg text-ink">Datos Laborales</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Municipio donde trabaja</label>
            <input name="municipioTrabajo" className={inputClass} placeholder="Municipio" defaultValue={form.municipioTrabajo} required
            />
          </div>

          <div>
            <label className={labelClass}>Empresa / Entidad</label>
            <input name="empresaTrabajo" className={inputClass} placeholder="Nombre de la entidad" defaultValue={form.empresaTrabajo} required
            />
          </div>

          <div>
            <label className={labelClass}>Departamento</label>
            <input name="departamento" className={inputClass} placeholder="Departamento" defaultValue={form.departamento} required
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">💰</span>
          <h2 className="m-0 font-serif text-lg text-ink">Autorización de Descuento</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Suma Total Autorizada ($)</label>
            <input name="sumaTotal" className={inputClass} placeholder="0.00" defaultValue={form.sumaTotal} required type='number' min={0} />
          </div>

          <div>
            <label className={labelClass}>Número de Cuotas</label>
            <input name="numeroCuotas" className={inputClass} placeholder="Ej: 12" defaultValue={form.numeroCuotas} required type='number' min={0}
            />
          </div>

          <div>
            <label className={labelClass}>Valor de Cada Cuota ($)</label>
            <input name="valorCuota" className={inputClass} placeholder="0.00" defaultValue={form.valorCuota} required type='number' min={0}
            />
          </div>

          <div>
            <label className={labelClass}>A partir del mes de</label>
            <input name="mesCobro" className={inputClass} placeholder="Ej: Enero 2025" defaultValue={form.mesCobro} required
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">🏦</span>
          <h2 className="m-0 font-serif text-lg text-ink">Datos Bancarios</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Tipo de Cuenta</label>
            <select
              name="tipoCuenta"
              className={inputClass}
              defaultValue={form.tipoCuenta}
              required
            >
              <option value="">Seleccionar…</option>
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Número de Cuenta</label>
            <input name="numeroCuenta" className={inputClass} placeholder="Número de cuenta" defaultValue={form.numeroCuenta} required type='number' min={0}
            />
          </div>

          <div>
            <label className={labelClass}>Banco</label>
            <input name="banco" className={inputClass} placeholder="Nombre del banco" defaultValue={form.banco} required
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">📦</span>
          <h2 className="m-0 font-serif text-lg text-ink">Descripción de Productos / Servicios</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[80px_1fr_130px_36px] gap-2.5 border-b border-border-soft pb-2">
            {['CÓDIGO', 'DESCRIPCIÓN', 'VALOR', ''].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-[1px] text-ink">
                {h}
              </span>
            ))}
          </div>

          {productos.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_1fr_130px_36px] items-center gap-2.5"
            >
              <input
                className={inputClass}
                placeholder="Cód."
                value={p.codigo}
                onChange={(e) => updateProducto(i, { codigo: e.target.value })}
                required min={0}
              />
              <input
                className={inputClass}
                placeholder="Descripción del producto o servicio"
                value={p.descripcion}
                onChange={(e) => updateProducto(i, { descripcion: e.target.value })}
                min={0}
                required type='text'
              />
              <input
                className={inputClass}
                placeholder="$ 0.00"
                value={p.valor}
                onChange={(e) => updateProducto(i, { valor: e.target.value })}
                required type='number'
                min={0}
              />
              <button
                type="button"
                onClick={() => removeProducto(i)}
                disabled={productos.length <= 1}
                className="flex h-8 w-8 items-center bg-red-700 justify-center rounded-lg border border-[#fecaca]  text-xl text-white disabled:cursor-not-allowed "
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addProducto}
            className="w-full rounded-[10px] border border-dashed border-green-500 bg-transparent px-4 py-2.5 text-xs font-semibold text-ink cursor-pointer"
          >
            + Agregar producto
          </button>

          <div className="mt-2 flex justify-end border-t border-border-soft pt-3">
            <div className="text-right">
              <div className="mb-1 text-[11px] uppercase tracking-[1px] font-bold">
                Total Compra
              </div>
              <div className="text-xl font-semibold text-ink">
                $
                {totalCompra.toLocaleString('es-CO', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">💳</span>
          <h2 className="m-0 font-serif text-lg text-ink">Forma de Pago</h2>
        </div>

        <div className="flex flex-wrap gap-2.5 ">
          {(['NOMINA', 'EFECTY 110520', 'PSE', 'BANCO'] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setFormaPago(op)}
              className={[
                'rounded-lg border px-5 cursor-pointer py-2.5 text-xs font-semibold uppercase tracking-[1px] transition-all hover:bg-ink hover:border-gold hover:text-gold duration-200 ',
                formaPago === op
                  ? 'border-gold bg-ink text-gold'
                  : 'border-border-soft bg-white text-muted',
              ].join(' ')}
            >
              <span className={[' hover:text-gold', formaPago === op ? ' text-gold' : 'text-ink'].join(' ')}>
                {op}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2.5 border-b border-border-soft pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-base">📧</span>
          <h2 className="m-0 font-serif text-lg text-ink">Envío al Cliente</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nombre del destinatario</label>
            <input name="destinatarioNombre" className={inputClass} placeholder="Nombre completo del cliente" defaultValue={form.destinatarioNombre} required
            />
          </div>

          <div>
            <label className={labelClass}>Correo electrónico *</label>
            <input name="destinatarioEmail" type="email" className={inputClass} placeholder="correo@ejemplo.com" defaultValue={form.destinatarioEmail} required
            />
          </div>
        </div>

        <p className="mt-3 text-x text-red-700">
          Se enviará un enlace de firma a este correo. El cliente podrá ver la libranza completa y firmar en línea.
        </p>
      </section>

      <div className="mt-9 flex justify-end border-t border-border-soft pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-gold cursor-pointer"
        >
          Vista Previa y Enviar →
        </button>
      </div>
    </form>
  );
} 