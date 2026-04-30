'use client';

import { useEffect, useState } from 'react';
import { ProductoItem, ReferenceItem, ReviewedLibranzaDetail, ReviewedLibranzaForm } from '@/types/libranza';
import { useLibranzaStore } from '@/store/libranzaStore';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { buildLibranzaPayloadToEdit } from '@/lib/utils/buildLibranzaPayload';
import api from '@/lib/axiosClient';
import { useSessionStore } from '@/store/adminSession';
import ReferencesSection from '../dashboard/Libranza/form/references/References';
import type { AxiosError } from "axios";
import { libranzaReviewSchema } from '@/schemas/libranzaReview.schema';

type ValidationErrorResponse = {
    ok: false;
    message: string;
    errors?: {
        formErrors?: string[];
        fieldErrors?: Record<string, string[]>;
    };
};

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

export default function EditLibranzaData() {

    const params = useParams();
    const id = params.id as string;
    const user = useSessionStore((s) => s.user);
    const form = useLibranzaStore((state) => state.reviewForm);
    const setForm = useLibranzaStore((state) => state.setReviewForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [referencias, setReferencias] = useState<ReferenceItem[]>(
        form.references ?? []
    );
    const [formaPago, setFormaPago] = useState<ReviewedLibranzaForm['formaPago']>(form.formaPago || '');
    const hydrateRejectedForm = useLibranzaStore((s) => s.hydrateRejectedForm);
    const [productos, setProductos] = useState<ProductoItem[]>(
        form.productos?.length ? form.productos : [{ codigo: '', descripcion: '', valor: '' }]
    );
    useEffect(() => {
        if (!id) return;

        const getLibranza = async () => {
            try {
                const { data } = await api.get<{ ok: boolean; data: ReviewedLibranzaDetail[] }>(
                    `/contracts/contract/${id}/getData`
                );

                const contract = data.data[0];
                if (!contract) return;

                const references = (contract.libranzaData?.references ?? []).map((ref) => ({
                    ...ref,
                    name: ref.name ?? "",
                    phone: ref.phone ?? "",
                    email: ref.email ?? "",
                    relationShip: ref.relationShip ?? "",
                    company: ref.company ?? "",
                    position: ref.position ?? "",
                }));
                hydrateRejectedForm({
                    form: {
                        ...contract.libranzaData,
                        references,
                    },
                    dataReviewStatus: contract.dataReviewStatus,
                    dataReviewNotes: contract.dataReviewNotes,
                });

                setProductos(contract.libranzaData.productos)
                setReferencias(contract.libranzaData.references)
                setFormaPago(contract.libranzaData.formaPago)
            } catch (error) {
                console.error(error);
            }
        };

        getLibranza();
    }, [id, hydrateRejectedForm]);
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
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const fd = new FormData(e.currentTarget);

        const asesor =
            user?.role === "OPERATOR"
                ? String(user?.name || "").trim()
                : String(fd.get("asesor") || "").trim();

        const rawData = {
            ciudad: String(fd.get("ciudad") || "").trim(),
            asesor,
            fecha: String(fd.get("fecha") || "").trim(),

            clienteNombre: String(fd.get("clienteNombre") || "").trim(),
            clienteCC: String(fd.get("clienteCC") || "").trim(),
            clienteCCDe: String(fd.get("clienteCCDe") || "").trim(),
            clienteDireccion: String(fd.get("clienteDireccion") || "").trim(),
            clienteTelefono: String(fd.get("clienteTelefono") || "").trim(),
            clienteEmail: String(fd.get("clienteEmail") || "").trim(),
            clienteFuncionario: String(fd.get("clienteFuncionario") || "").trim(),
            clienteDesdeHace: String(fd.get("clienteDesdeHace") || "").trim(),

            clienteFechaNacimiento: String(fd.get("clienteFechaNacimiento") || "").trim(),
            clienteFechaExpedicionCC: String(fd.get("clienteFechaExpedicionCC") || "").trim(),

            references: referencias.map((ref) => ({
                ...ref,
                name: ref.name?.trim() || "",
                phone: ref.phone?.trim() || "",
                email: ref.email?.trim() ? ref.email.trim() : undefined,
                company: ref.company?.trim() ? ref.company.trim() : undefined,
                position: ref.position?.trim() ? ref.position.trim() : undefined,
                relationShip: ref.relationShip?.trim()
                    ? ref.relationShip.trim()
                    : undefined,
            })),

            municipioTrabajo: String(fd.get("municipioTrabajo") || "").trim(),
            empresaTrabajo: String(fd.get("empresaTrabajo") || "").trim(),
            departamento: String(fd.get("departamento") || "").trim(),

            pagaduriaNombre: String(fd.get("pagaduriaNombre") || "").trim(),
            pagaduriaMunicipio: String(fd.get("pagaduriaMunicipio") || "").trim(),
            pagaduriaDepartamento: String(fd.get("pagaduriaDepartamento") || "").trim(),
            tipoContrato: fd.get("tipoContrato") || undefined,

            sumaTotal: String(fd.get("sumaTotal") || "").trim(),
            numeroCuotas: String(fd.get("numeroCuotas") || "").trim(),
            valorCuota: String(fd.get("valorCuota") || "").trim(),
            mesCobro: String(fd.get("mesCobro") || "").trim(),

            tipoCuenta: fd.get("tipoCuenta") || undefined,
            numeroCuenta: String(fd.get("numeroCuenta") || "").trim(),
            banco: String(fd.get("banco") || "").trim(),

            productos,
            formaPago,

            destinatarioEmail: null,
            destinatarioNombre: null,
            dataReviewStatus: fd.get("dataReviewStatus") || undefined,
            dataReviewNotes: String(fd.get("dataReviewNotes") || "").trim(),
        };
        const result = libranzaReviewSchema.safeParse(rawData);
        console.log(result)
        if (!result.success) {
            const formatted: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const key = issue.path.join(".");
                if (!formatted[key]) {
                    formatted[key] = issue.message;
                }
            });
            console.log(formatted)

            setErrors(formatted);
            toast.error("Hay errores en el formulario");
            return;
        }
        try {
            setErrors({});

            const payload = buildLibranzaPayloadToEdit(result.data);

            await api.patch(
                `/contracts/contract/${id}/edit`,
                payload
            );


            toast.success("Libranza editada correctamente");

            window.scrollTo({ top: 0, behavior: "smooth" });


        } catch (error: unknown) {
            console.log(error)
            const axiosError = error as AxiosError<ValidationErrorResponse>;

            const backendErrors = axiosError.response?.data?.errors?.fieldErrors;

            if (backendErrors) {
                const formatted: Record<string, string> = {};

                Object.entries(backendErrors).forEach(([key, value]) => {
                    if (Array.isArray(value) && value.length > 0) {
                        formatted[key] = value[0];
                    }
                });

                setErrors(formatted);
            }

            toast.error(
                axiosError.response?.data?.message || "No se pudo editar la información"
            );
        }
    }
    return (
        <div className='h-full flex '>

            <div>
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

                            {user?.role === "ADMIN" || user?.role === "CREDIT_ANALYST" && (
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
                                        readOnly
                                    />
                                    {renderError('asesor')}
                                </div>
                            )}

                            {user?.role === "OPERATOR" && (
                                <div>
                                    <label className={labelClass}>Asesor</label>
                                    <div className={`${inputClass} bg-slate-100 cursor-not-allowed`}>
                                        {user?.name}
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
                                    defaultValue={
                                        form.clienteFechaNacimiento
                                            ? form.clienteFechaNacimiento.split("T")[0]
                                            : ""
                                    }
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
                                    defaultValue={
                                        form.clienteFechaExpedicionCC
                                            ? form.clienteFechaExpedicionCC.split("T")[0]
                                            : ""
                                    }
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
                                    value={form.tipoContrato || ''}
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
                                    className={getInputClass("sumaTotal")}
                                    placeholder="0.00"
                                    value={form.sumaTotal ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setForm({
                                            ...form,
                                            sumaTotal: (value),
                                        });

                                        setFieldErrorClear("sumaTotal");
                                    }}
                                    required
                                    type="text"
                                    inputMode="decimal"
                                />
                                {renderError('sumaTotal')}
                            </div>

                            <div>
                                <label className={labelClass}>Número de Cuotas</label>
                                <input
                                    name="numeroCuotas"
                                    className={getInputClass("numeroCuotas")}
                                    placeholder="Ej: 12"
                                    value={form.numeroCuotas ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Solo números enteros (sin decimales)
                                        if (!/^\d*$/.test(value)) return;

                                        setForm({
                                            ...form,
                                            numeroCuotas: (value),
                                        });

                                        setFieldErrorClear("numeroCuotas");
                                    }}
                                    required
                                    type="text"
                                    inputMode="numeric"
                                />
                                {renderError('numeroCuotas')}
                            </div>

                            <div>
                                <label className={labelClass}>Valor de Cada Cuota ($)</label>

                                <input
                                    name="valorCuota"
                                    className={getInputClass("valorCuota")}
                                    placeholder="0.00"
                                    value={form.valorCuota ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setForm({
                                            ...form,
                                            valorCuota: (value),
                                        });

                                        setFieldErrorClear("valorCuota");
                                    }}
                                    required
                                    type="text"
                                    inputMode="numeric"
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
                                    value={form.tipoCuenta}
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
                            {(['NOMINA'] as const).map((op) => (
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
                    <div className="mt-9 flex justify-end border-t pt-6">
                        <button
                            type="submit"
                            className="rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-main cursor-pointer"
                        >
                            Editar datos →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}