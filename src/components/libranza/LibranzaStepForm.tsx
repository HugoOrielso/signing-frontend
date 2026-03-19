'use client';

import { LibranzaForm, ProductoItem } from "@/types/libranza";


const INK    = '#1a1a2e';
const GOLD   = '#c9a84c';
const CREAM  = '#f5f0e8';
const BORDER = '#d4c9b0';
const MUTED  = '#7a6e5f';

const inp = "w-full bg-white border-[1.5px] border-[#d4c9b0] rounded-[6px] px-[14px] py-[11px] text-[14px] text-[#1a1a2e] outline-none transition-all focus:border-[#c9a84c] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)] placeholder:text-[#c0b8ac]";

function Field({ label, children, span2 = false }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? 'col-span-2 flex flex-col gap-1.5' : 'flex flex-col gap-1.5'}>
      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: MUTED }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Card({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ width: 32, height: 32, background: CREAM, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</span>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: INK, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface Props { form: LibranzaForm; set: (k: keyof LibranzaForm, v: any) => void; onNext: () => void; }

export default function LibranzaStepForm({ form, set, onNext }: Props) {
  function setProducto(i: number, patch: Partial<ProductoItem>) {
    set('productos', form.productos.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: INK, marginBottom: 6 }}>Nueva Libranza</h1>
        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Completa los datos del cliente. Nosotros generamos la plantilla y la enviamos para firma.</p>
      </div>

      <Card icon="🏢" title="Encabezado del Documento">
        <div className="grid grid-cols-3 gap-5">
          <Field label="Ciudad"><input className={inp} placeholder="Cartagena" value={form.ciudad} onChange={e => set('ciudad', e.target.value)} /></Field>
          <Field label="Asesor"><input className={inp} placeholder="Nombre del asesor" value={form.asesor} onChange={e => set('asesor', e.target.value)} /></Field>
          <Field label="Fecha">
            <input type="date" className={inp}
              value={form.fecha.includes('/') ? form.fecha.split('/').reverse().join('-') : form.fecha}
              onChange={e => { const [y,m,d] = e.target.value.split('-'); set('fecha', `${d}/${m}/${y}`); }} />
          </Field>
        </div>
      </Card>

      <Card icon="👤" title="Datos del Cliente">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Nombre Completo" span2><input className={inp} placeholder="Nombres y apellidos completos" value={form.clienteNombre} onChange={e => set('clienteNombre', e.target.value)} /></Field>
          <Field label="Cédula de Ciudadanía (C.C.)"><input className={inp} placeholder="Número de cédula" value={form.clienteCC} onChange={e => set('clienteCC', e.target.value)} /></Field>
          <Field label="Expedida en (ciudad)"><input className={inp} placeholder="Ciudad de expedición" value={form.clienteCCDe} onChange={e => set('clienteCCDe', e.target.value)} /></Field>
          <Field label="Dirección de Residencia" span2><input className={inp} placeholder="Dirección completa" value={form.clienteDireccion} onChange={e => set('clienteDireccion', e.target.value)} /></Field>
          <Field label="Teléfono / Celular"><input type="tel" className={inp} placeholder="+57 300 000 0000" value={form.clienteTelefono} onChange={e => set('clienteTelefono', e.target.value)} /></Field>
          <Field label="Correo Electrónico"><input type="email" className={inp} placeholder="correo@ejemplo.com" value={form.clienteEmail} onChange={e => set('clienteEmail', e.target.value)} /></Field>
          <Field label="Funcionario de (empresa)"><input className={inp} placeholder="Nombre de la empresa" value={form.clienteFuncionario} onChange={e => set('clienteFuncionario', e.target.value)} /></Field>
          <Field label="Desde hace"><input className={inp} placeholder="Ej: 2 años, 6 meses" value={form.clienteDesdeHace} onChange={e => set('clienteDesdeHace', e.target.value)} /></Field>
        </div>
      </Card>

      <Card icon="🏗️" title="Datos Laborales">
        <div className="grid grid-cols-3 gap-5">
          <Field label="Municipio donde trabaja"><input className={inp} placeholder="Municipio" value={form.municipioTrabajo} onChange={e => set('municipioTrabajo', e.target.value)} /></Field>
          <Field label="Empresa / Entidad"><input className={inp} placeholder="Nombre de la entidad" value={form.empresaTrabajo} onChange={e => set('empresaTrabajo', e.target.value)} /></Field>
          <Field label="Departamento"><input className={inp} placeholder="Departamento" value={form.departamento} onChange={e => set('departamento', e.target.value)} /></Field>
        </div>
      </Card>

      <Card icon="💰" title="Autorización de Descuento">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Suma Total Autorizada ($)"><input className={inp} placeholder="0.00" value={form.sumaTotal} onChange={e => set('sumaTotal', e.target.value)} /></Field>
          <Field label="Número de Cuotas"><input className={inp} placeholder="Ej: 12" value={form.numeroCuotas} onChange={e => set('numeroCuotas', e.target.value)} /></Field>
          <Field label="Valor de Cada Cuota ($)"><input className={inp} placeholder="0.00" value={form.valorCuota} onChange={e => set('valorCuota', e.target.value)} /></Field>
          <Field label="A partir del mes de"><input className={inp} placeholder="Ej: Enero 2025" value={form.mesCobro} onChange={e => set('mesCobro', e.target.value)} /></Field>
        </div>
      </Card>

      <Card icon="🏦" title="Datos Bancarios">
        <div className="grid grid-cols-3 gap-5">
          <Field label="Tipo de Cuenta">
            <select className={inp} value={form.tipoCuenta} onChange={e => set('tipoCuenta', e.target.value as any)}>
              <option value="">Seleccionar…</option>
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>
          </Field>
          <Field label="Número de Cuenta"><input className={inp} placeholder="Número de cuenta" value={form.numeroCuenta} onChange={e => set('numeroCuenta', e.target.value)} /></Field>
          <Field label="Banco"><input className={inp} placeholder="Nombre del banco" value={form.banco} onChange={e => set('banco', e.target.value)} /></Field>
        </div>
      </Card>

      <Card icon="📦" title="Descripción de Productos / Servicios">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 130px 36px', gap: 10, paddingBottom: 8, borderBottom: `1px solid ${BORDER}` }}>
            {['CÓDIGO','DESCRIPCIÓN','VALOR',''].map(h => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: MUTED }}>{h}</span>
            ))}
          </div>
          {form.productos.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 130px 36px', gap: 10, alignItems: 'center' }}>
              <input className={inp} placeholder="Cód." value={p.codigo} onChange={e => setProducto(i, { codigo: e.target.value })} style={{ padding: '8px 10px' }} />
              <input className={inp} placeholder="Descripción del producto o servicio" value={p.descripcion} onChange={e => setProducto(i, { descripcion: e.target.value })} style={{ padding: '8px 10px' }} />
              <input className={inp} placeholder="$ 0.00" value={p.valor} onChange={e => setProducto(i, { valor: e.target.value })} style={{ padding: '8px 10px' }} />
              <button onClick={() => form.productos.length > 1 && set('productos', form.productos.filter((_,idx) => idx !== i))}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5', color: '#8b3a3a', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: form.productos.length <= 1 ? 0.3 : 1 }}>
                ×
              </button>
            </div>
          ))}
          <button onClick={() => set('productos', [...form.productos, { codigo: '', descripcion: '', valor: '' }])}
            style={{ width: '100%', padding: 10, borderRadius: 10, border: `1.5px dashed ${BORDER}`, background: 'transparent', color: MUTED, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            + Agregar producto
          </button>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: MUTED, marginBottom: 4 }}>Total Compra</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: INK }}>
                ${form.productos.reduce((sum, p) => sum + (parseFloat(p.valor.replace(/[^0-9.]/g,'')) || 0), 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card icon="💳" title="Forma de Pago">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(['NOMINA','EFECTY 110520','PSE','BANCO'] as const).map(op => (
            <button key={op} onClick={() => set('formaPago', op)} style={{
              padding: '10px 20px', borderRadius: 8, border: `1.5px solid ${form.formaPago === op ? GOLD : BORDER}`,
              background: form.formaPago === op ? INK : 'white', color: form.formaPago === op ? GOLD : MUTED,
              fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer',
            }}>{op}</button>
          ))}
        </div>
      </Card>

      <Card icon="📧" title="Envío al Cliente">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Nombre del destinatario"><input className={inp} placeholder="Nombre completo del cliente" value={form.destinatarioNombre} onChange={e => set('destinatarioNombre', e.target.value)} /></Field>
          <Field label="Correo electrónico *"><input type="email" className={inp} placeholder="correo@ejemplo.com" value={form.destinatarioEmail} onChange={e => set('destinatarioEmail', e.target.value)} /></Field>
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: MUTED }}>Se enviará un enlace de firma a este correo. El cliente podrá ver la libranza completa y firmar en línea.</p>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 36, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
        <button onClick={onNext} style={{ padding: '12px 28px', borderRadius: 8, border: 'none', background: INK, color: GOLD, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Vista Previa y Enviar →
        </button>
      </div>
    </div>
  );
}