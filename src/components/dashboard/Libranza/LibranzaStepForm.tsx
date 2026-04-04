'use client';

import { useState } from 'react';
import { ProductoItem, LibranzaForm, ReferenceItem } from '@/types/libranza';
import { useLibranzaStore } from '@/store/libranzaStore';
import ReferencesSection from './form/references/References';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { libranzaFormSchema } from "@/schemas/libranza.schema";
import { toast } from 'sonner';
import { empresaConfig, getEmpresaFromPath } from '@/config/bussiness';
import { buildLibranzaPayload } from '@/lib/utils/buildLibranzaPayload';
import api from '@/lib/axiosClient';
import { useRouter } from 'next/navigation';

const inputClass =
  'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-gray-500 focus:border-blue-100 focus:ring-4 focus:ring-blue-50';

const inputErrorClass =
  'border-red-500 focus:border-red-500 focus:ring-red-100';

const labelClass =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[1px] text-main';

const sectionClass =
  'mb-6 rounded-xl border bg-white p-7';

const errorTextClass = 'mt-1 text-xs text-red-600';

type FormErrors = Record<string, string>;

export default function LibranzaStepForm() {
  const { data: session } = useSession();
  const form = useLibranzaStore((state) => state.form);
  const setForm = useLibranzaStore((state) => state.setForm);
  const nextStep = useLibranzaStore((state) => state.nextStep);
  const router = useRouter()
  const [errors, setErrors] = useState<FormErrors>({});

  const [referencias, setReferencias] = useState<ReferenceItem[]>(
    form.references ?? []
  );

  const [productos, setProductos] = useState<ProductoItem[]>(
    form.productos?.length ? form.productos : [{ codigo: '', descripcion: '', valor: '' }]
  );

  const [formaPago, setFormaPago] = useState<LibranzaForm['formaPago']>(form.formaPago || '');

  const totalCompra = productos.reduce((sum, p) => {
    const value = parseFloat((p.valor || '').replace(/[^0-9.]/g, '')) || 0;
    return sum + value;
  }, 0);

  function setFieldErrorClear(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function getInputClass(field: string) {
    return `${inputClass} ${errors[field] ? inputErrorClass : ''}`;
  }

  function renderError(field: string) {
    if (!errors[field]) return null;
    return <p className={errorTextClass}>{errors[field]}</p>;
  }

  function addProducto() {
    setProductos((prev) => [...prev, { codigo: '', descripcion: '', valor: '' }]);
    setFieldErrorClear('productos');
  }

  function removeProducto(index: number) {
    setProductos((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
    setFieldErrorClear('productos');
  }

  function updateProducto(index: number, patch: Partial<ProductoItem>) {
    setProductos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
    setFieldErrorClear('productos');
  }

  const today = new Date().toISOString().split('T')[0];
  const pathname = usePathname();
  const empresa = getEmpresaFromPath(pathname);
  const config = empresaConfig[empresa];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const asesor =
      session?.user.role === "OPERATOR"
        ? String(session.user.name || "")
        : String(fd.get("asesor") || "");

    const data: LibranzaForm = {
      ciudad: String(fd.get("ciudad") || ""),
      asesor,
      fecha: String(fd.get("fecha") || ""),

      clienteNombre: String(fd.get("clienteNombre") || ""),
      clienteCC: String(fd.get("clienteCC") || ""),
      clienteCCDe: String(fd.get("clienteCCDe") || ""),
      clienteDireccion: String(fd.get("clienteDireccion") || ""),
      clienteTelefono: String(fd.get("clienteTelefono") || ""),
      clienteEmail: String(fd.get("clienteEmail") || ""),
      clienteFuncionario: String(fd.get("clienteFuncionario") || ""),
      clienteDesdeHace: String(fd.get("clienteDesdeHace") || ""),

      clienteFechaNacimiento: String(fd.get("clienteFechaNacimiento") || ""),
      clienteFechaExpedicionCC: String(fd.get("clienteFechaExpedicionCC") || ""),

      references: referencias.map((ref) => ({
        ...ref,
        email: ref.email?.trim() ? ref.email.trim() : undefined,
      })),

      municipioTrabajo: String(fd.get("municipioTrabajo") || ""),
      empresaTrabajo: String(fd.get("empresaTrabajo") || ""),
      departamento: String(fd.get("departamento") || ""),

      pagaduriaNombre: String(fd.get("pagaduriaNombre") || ""),
      pagaduriaMunicipio: String(fd.get("pagaduriaMunicipio") || ""),
      pagaduriaDepartamento: String(fd.get("pagaduriaDepartamento") || ""),
      tipoContrato: (fd.get("tipoContrato") || "") as LibranzaForm["tipoContrato"],

      sumaTotal: String(fd.get("sumaTotal") || ""),
      numeroCuotas: String(fd.get("numeroCuotas") || ""),
      valorCuota: String(fd.get("valorCuota") || ""),
      mesCobro: String(fd.get("mesCobro") || ""),

      tipoCuenta: (fd.get("tipoCuenta") || "") as LibranzaForm["tipoCuenta"],
      numeroCuenta: String(fd.get("numeroCuenta") || ""),
      banco: String(fd.get("banco") || ""),

      productos,
      formaPago,

      destinatarioEmail: String(fd.get("destinatarioEmail") || ""),
      destinatarioNombre: String(fd.get("destinatarioNombre") || ""),

      templateKey: config.id,
    };

    const result = libranzaFormSchema.safeParse(data);

    if (!result.success) {
      const formatted: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const key = issue.path.join(".");
        if (!formatted[key]) {
          formatted[key] = issue.message;
        }
      });

      setErrors(formatted);
      toast.error("Hay errores en el formulario");
      return;
    }

    try {
      const draftContract = await api.post("/contracts", buildLibranzaPayload(result.data));

      if (draftContract.status === 201) {
        toast.success("Borrador de libranza creado, serás redirigido para adjuntar documentos")
        setTimeout(() => {
          router.push(`/dashboard/upload-documents/${draftContract.data.contractId}`)
        }, 200)
      }

      setErrors({});
      setForm(result.data);
      toast.success("Borrador guardado");
      // nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("No se pudo guardar el borrador");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">🏢</span>
          <h2 className="m-0 font-serif text-lg text-ink">Encabezado del Documento</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Ciudad</label>
            <input
              name="ciudad"
              className={getInputClass('ciudad')}
              placeholder="Cartagena"
              defaultValue={form.ciudad}
              onChange={() => setFieldErrorClear('ciudad')}
              required
              type="text"
            />
            {renderError('ciudad')}
          </div>

          {session?.user.role === "ADMIN" && (
            <div>
              <label className={labelClass}>Asesor</label>
              <input
                name="asesor"
                className={getInputClass('asesor')}
                placeholder="Nombre del asesor"
                defaultValue={form.asesor}
                onChange={() => setFieldErrorClear('asesor')}
                required
                type="text"
              />
              {renderError('asesor')}
            </div>
          )}

          {session?.user.role === "OPERATOR" && (
            <div>
              <label className={labelClass}>Asesor</label>
              <div className={`${inputClass} bg-slate-100 cursor-not-allowed`}>
                {session.user.name}
              </div>
              {renderError('asesor')}
            </div>
          )}

          <div>
            <label className={labelClass}>Fecha</label>
            <input
              name="fecha"
              type="date"
              className={`${getInputClass('fecha')} bg-slate-100 cursor-not-allowed`}
              value={today}
              readOnly
            />
            {renderError('fecha')}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex items-center justify-center rounded-lg text-base">👤</span>
          <h2 className="m-0 font-serif text-lg text-ink">Datos del Cliente</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre Completo</label>
            <input
              name="clienteNombre"
              className={getInputClass('clienteNombre')}
              placeholder="Nombres y apellidos completos"
              defaultValue={form.clienteNombre}
              onChange={() => setFieldErrorClear('clienteNombre')}
              required
              type="text"
            />
            {renderError('clienteNombre')}
          </div>

          <div>
            <label className={labelClass}>Cédula de Ciudadanía (C.C.)</label>
            <input
              name="clienteCC"
              className={getInputClass('clienteCC')}
              placeholder="Número de cédula"
              defaultValue={form.clienteCC}
              onChange={() => setFieldErrorClear('clienteCC')}
              required
              type="number"
              min={0}
            />
            {renderError('clienteCC')}
          </div>

          <div>
            <label className={labelClass}>Expedida en (ciudad)</label>
            <input
              name="clienteCCDe"
              className={getInputClass('clienteCCDe')}
              placeholder="Ciudad de expedición"
              defaultValue={form.clienteCCDe}
              onChange={() => setFieldErrorClear('clienteCCDe')}
              required
              type="text"
            />
            {renderError('clienteCCDe')}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Dirección de Residencia</label>
            <input
              name="clienteDireccion"
              className={getInputClass('clienteDireccion')}
              placeholder="Dirección completa"
              defaultValue={form.clienteDireccion}
              onChange={() => setFieldErrorClear('clienteDireccion')}
              required
              type="text"
            />
            {renderError('clienteDireccion')}
          </div>

          <div>
            <label className={labelClass}>Teléfono / Celular</label>
            <input
              name="clienteTelefono"
              type="tel"
              className={getInputClass('clienteTelefono')}
              placeholder="+57 300 000 0000"
              defaultValue={form.clienteTelefono}
              onChange={() => setFieldErrorClear('clienteTelefono')}
              required
            />
            {renderError('clienteTelefono')}
          </div>

          <div>
            <label className={labelClass}>Correo Electrónico</label>
            <input
              name="clienteEmail"
              type="email"
              className={getInputClass('clienteEmail')}
              placeholder="correo@ejemplo.com"
              defaultValue={form.clienteEmail}
              onChange={() => setFieldErrorClear('clienteEmail')}
              required
            />
            {renderError('clienteEmail')}
          </div>

          <div>
            <label className={labelClass}>Funcionario de (empresa)</label>
            <input
              name="clienteFuncionario"
              className={getInputClass('clienteFuncionario')}
              placeholder="Nombre de la empresa"
              defaultValue={form.clienteFuncionario}
              onChange={() => setFieldErrorClear('clienteFuncionario')}
              required
              type="text"
            />
            {renderError('clienteFuncionario')}
          </div>

          <div>
            <label className={labelClass}>Desde hace</label>
            <input
              name="clienteDesdeHace"
              className={getInputClass('clienteDesdeHace')}
              placeholder="Ej: 2 años, 6 meses"
              defaultValue={form.clienteDesdeHace}
              onChange={() => setFieldErrorClear('clienteDesdeHace')}
              required
            />
            {renderError('clienteDesdeHace')}
          </div>

          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input
              name="clienteFechaNacimiento"
              type="date"
              className={getInputClass('clienteFechaNacimiento')}
              defaultValue={form.clienteFechaNacimiento}
              onChange={() => setFieldErrorClear('clienteFechaNacimiento')}
              required
            />
            {renderError('clienteFechaNacimiento')}
          </div>

          <div>
            <label className={labelClass}>Fecha de expedición del documento</label>
            <input
              name="clienteFechaExpedicionCC"
              type="date"
              className={getInputClass('clienteFechaExpedicionCC')}
              defaultValue={form.clienteFechaExpedicionCC}
              onChange={() => setFieldErrorClear('clienteFechaExpedicionCC')}
              required
            />
            {renderError('clienteFechaExpedicionCC')}
          </div>
        </div>
      </section>

      <div className={sectionClass}>
        <ReferencesSection
          value={referencias}
          onChange={(value) => {
            setReferencias(value);

            setFieldErrorClear('references');
            setFieldErrorClear('references.0.name');
            setFieldErrorClear('references.0.phone');
            setFieldErrorClear('references.0.email');
            setFieldErrorClear('references.0.relationShip');

            setFieldErrorClear('references.1.name');
            setFieldErrorClear('references.1.phone');
            setFieldErrorClear('references.1.email');
            setFieldErrorClear('references.1.company');
            setFieldErrorClear('references.1.position');
          }}
          errors={errors}
        />

        {renderError('references')}
      </div>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">🏗️</span>
          <h2 className="m-0 font-serif text-lg text-ink">Datos Laborales</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Municipio donde trabaja</label>
            <input
              name="municipioTrabajo"
              className={getInputClass('municipioTrabajo')}
              placeholder="Municipio"
              defaultValue={form.municipioTrabajo}
              onChange={() => setFieldErrorClear('municipioTrabajo')}
              required
            />
            {renderError('municipioTrabajo')}
          </div>

          <div>
            <label className={labelClass}>Empresa / Entidad</label>
            <input
              name="empresaTrabajo"
              className={getInputClass('empresaTrabajo')}
              placeholder="Nombre de la entidad"
              defaultValue={form.empresaTrabajo}
              onChange={() => setFieldErrorClear('empresaTrabajo')}
              required
            />
            {renderError('empresaTrabajo')}
          </div>

          <div>
            <label className={labelClass}>Departamento</label>
            <input
              name="departamento"
              className={getInputClass('departamento')}
              placeholder="Departamento"
              defaultValue={form.departamento}
              onChange={() => setFieldErrorClear('departamento')}
              required
            />
            {renderError('departamento')}
          </div>

          <div>
            <label className={labelClass}>Pagaduría</label>
            <input
              name="pagaduriaNombre"
              className={getInputClass('pagaduriaNombre')}
              placeholder="Nombre de la pagaduría"
              defaultValue={form.pagaduriaNombre}
              onChange={() => setFieldErrorClear('pagaduriaNombre')}
              required
            />
            {renderError('pagaduriaNombre')}
          </div>

          <div>
            <label className={labelClass}>Municipio de pagaduría</label>
            <input
              name="pagaduriaMunicipio"
              className={getInputClass('pagaduriaMunicipio')}
              placeholder="Municipio"
              defaultValue={form.pagaduriaMunicipio}
              onChange={() => setFieldErrorClear('pagaduriaMunicipio')}
              required
            />
            {renderError('pagaduriaMunicipio')}
          </div>

          <div>
            <label className={labelClass}>Departamento de pagaduría</label>
            <input
              name="pagaduriaDepartamento"
              className={getInputClass('pagaduriaDepartamento')}
              placeholder="Departamento"
              defaultValue={form.pagaduriaDepartamento}
              onChange={() => setFieldErrorClear('pagaduriaDepartamento')}
              required
            />
            {renderError('pagaduriaDepartamento')}
          </div>

          <div>
            <label className={labelClass}>Tipo de contrato</label>
            <select
              name="tipoContrato"
              className={getInputClass('tipoContrato')}
              defaultValue={form.tipoContrato}
              onChange={() => setFieldErrorClear('tipoContrato')}
              required
            >
              <option value="">Seleccionar…</option>
              <option value="PROVISIONAL">Provisional</option>
              <option value="TEMPORAL">Temporal</option>
              <option value="PROVISIONAL_VACANTE_DEFINITIVA">
                Provisional vacante definitiva
              </option>
              <option value="CARRERA_ADMINISTRATIVA">
                Carrera administrativa
              </option>
              <option value="PENSIONADO">Pensionado</option>
            </select>
            {renderError('tipoContrato')}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">💰</span>
          <h2 className="m-0 font-serif text-lg text-ink">Autorización de Descuento</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Suma Total Autorizada ($)</label>
            <input
              name="sumaTotal"
              className={getInputClass('sumaTotal')}
              placeholder="0.00"
              defaultValue={form.sumaTotal}
              onChange={() => setFieldErrorClear('sumaTotal')}
              required
              type="number"
              min={0}
            />
            {renderError('sumaTotal')}
          </div>

          <div>
            <label className={labelClass}>Número de Cuotas</label>
            <input
              name="numeroCuotas"
              className={getInputClass('numeroCuotas')}
              placeholder="Ej: 12"
              defaultValue={form.numeroCuotas}
              onChange={() => setFieldErrorClear('numeroCuotas')}
              required
              type="number"
              min={0}
            />
            {renderError('numeroCuotas')}
          </div>

          <div>
            <label className={labelClass}>Valor de Cada Cuota ($)</label>
            <input
              name="valorCuota"
              className={getInputClass('valorCuota')}
              placeholder="0.00"
              defaultValue={form.valorCuota}
              onChange={() => setFieldErrorClear('valorCuota')}
              required
              type="number"
              min={0}
            />
            {renderError('valorCuota')}
          </div>

          <div>
            <label className={labelClass}>A partir del mes de</label>
            <input
              name="mesCobro"
              className={getInputClass('mesCobro')}
              placeholder="Ej: Enero 2025"
              defaultValue={form.mesCobro}
              onChange={() => setFieldErrorClear('mesCobro')}
              required
            />
            {renderError('mesCobro')}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">🏦</span>
          <h2 className="m-0 font-serif text-lg text-ink">Datos Bancarios</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className={labelClass}>Tipo de Cuenta</label>
            <select
              name="tipoCuenta"
              className={getInputClass('tipoCuenta')}
              defaultValue={form.tipoCuenta}
              onChange={() => setFieldErrorClear('tipoCuenta')}
              required
            >
              <option value="">Seleccionar…</option>
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>
            {renderError('tipoCuenta')}
          </div>

          <div>
            <label className={labelClass}>Número de Cuenta</label>
            <input
              name="numeroCuenta"
              className={getInputClass('numeroCuenta')}
              placeholder="Número de cuenta"
              defaultValue={form.numeroCuenta}
              onChange={() => setFieldErrorClear('numeroCuenta')}
              required
              type="number"
              min={0}
            />
            {renderError('numeroCuenta')}
          </div>

          <div>
            <label className={labelClass}>Banco</label>
            <input
              name="banco"
              className={getInputClass('banco')}
              placeholder="Nombre del banco"
              defaultValue={form.banco}
              onChange={() => setFieldErrorClear('banco')}
              required
            />
            {renderError('banco')}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">📦</span>
          <h2 className="m-0 font-serif text-lg text-ink">Descripción de Productos / Servicios</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[80px_1fr_130px_36px] gap-2 border-b pb-2">
            {['CÓDIGO', 'DESCRIPCIÓN', 'VALOR', ''].map((h) => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-[1px] text-ink">
                {h}
              </span>
            ))}
          </div>

          {productos.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_1fr_130px_36px] items-center gap-2"
            >
              <input
                className={getInputClass('productos')}
                placeholder="Cód."
                value={p.codigo}
                onChange={(e) => updateProducto(i, { codigo: e.target.value })}
                required
              />
              <input
                className={getInputClass('productos')}
                placeholder="Descripción del producto o servicio"
                value={p.descripcion}
                onChange={(e) => updateProducto(i, { descripcion: e.target.value })}
                required
                type="text"
              />
              <input
                className={getInputClass('productos')}
                placeholder="$ 0.00"
                value={p.valor}
                onChange={(e) => updateProducto(i, { valor: e.target.value })}
                required
                type="number"
                min={0}
              />
              <button
                type="button"
                onClick={() => removeProducto(i)}
                disabled={productos.length <= 1}
                className="flex h-8 w-8 items-center bg-red-700 justify-center rounded-lg border border-[#fecaca] text-xl text-white disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>
          ))}

          {renderError('productos')}

          <button
            type="button"
            onClick={addProducto}
            className="w-full rounded-[10px] border border-dashed border-green-500 bg-transparent px-4 py-2.5 text-xs font-semibold text-ink cursor-pointer"
          >
            + Agregar producto
          </button>

          <div className="mt-2 flex justify-end border-t pt-3">
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
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">💳</span>
          <h2 className="m-0 font-serif text-lg text-ink">Forma de Pago</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['NOMINA', 'EFECTY 110520', 'PSE', 'BANCO'] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => {
                setFormaPago(op);
                setFieldErrorClear('formaPago');
              }}
              className={[
                'rounded-lg border px-5 cursor-pointer py-2.5 text-xs font-semibold uppercase tracking-[1px] transition-all hover:bg-ink hover:border-main hover:text-main duration-200',
                formaPago === op
                  ? 'border-main bg-ink text-main'
                  : 'bg-white text-black',
                errors.formaPago ? 'border-red-500' : '',
              ].join(' ')}
            >
              <span>{op}</span>
            </button>
          ))}
        </div>
        {renderError('formaPago')}
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-2 border-b pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">📧</span>
          <h2 className="m-0 font-serif text-lg text-ink">Envío al Cliente</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Nombre del destinatario</label>
            <input
              name="destinatarioNombre"
              className={getInputClass('destinatarioNombre')}
              placeholder="Nombre completo del cliente"
              defaultValue={form.destinatarioNombre}
              onChange={() => setFieldErrorClear('destinatarioNombre')}
              required
            />
            {renderError('destinatarioNombre')}
          </div>

          <div>
            <label className={labelClass}>Correo electrónico *</label>
            <input
              name="destinatarioEmail"
              type="email"
              className={getInputClass('destinatarioEmail')}
              placeholder="correo@ejemplo.com"
              defaultValue={form.destinatarioEmail}
              onChange={() => setFieldErrorClear('destinatarioEmail')}
              required
            />
            {renderError('destinatarioEmail')}
          </div>
        </div>

        <p className="mt-3 text-x text-red-700">
          Se enviará un enlace de firma a este correo. El cliente podrá ver la libranza completa y firmar en línea.
        </p>
      </section>

      <div className="mt-9 flex justify-end border-t pt-6">
        <button
          type="submit"
          className="rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-main cursor-pointer"
        >
          Vista Previa y Enviar →
        </button>
      </div>
    </form>
  );
}