import React, { useMemo } from 'react'
import { Building2, Copy, ExternalLink, FileText, ImageIcon, Link2, MapPin, User, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { DetailRow, InfoCard, ProductsCard, Section, SignerCard } from './atoms';
import { displayStatus, fmtDate, fmtMoney, publicUrl } from '@/lib/utils/libranzaHelper';
import { Contract, ContractDocumentItem } from '@/types/libranza';
import { docProxyUrl } from './proxyUrl';
import { ContractStatusBadge } from '../statusBadge';

// ── Props ─────────────────────────────────────────────────────────────────────

interface DetailsDialogBodyProps {
    contract: Contract
    docs: ContractDocumentItem[]
    docsLoading: boolean
    onPreview: (url: string) => void   // le dice al padre qué url abrir
}

// ── Component ─────────────────────────────────────────────────────────────────

export const DetailsDialogBody = ({
    contract,
    docs,
    docsLoading,
    onPreview,
}: DetailsDialogBodyProps) => {
    const link = useMemo(() => publicUrl(contract.token), [contract.token])
    const ld = contract.libranzaData
    const contractedParty = contract.parties.find((p) => p.role === 'CONTRACTED')

    return (
        <div className="h-full overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">

                {/* ── Columna izquierda ── */}
                <div className="space-y-6">
                    <InfoCard>
                        <Section title="General" icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
                        <div className="mt-3">
                            <DetailRow label="Fecha creación" value={fmtDate(contract.createdAt)} />
                            <DetailRow label="Estado">
                                <div className="flex items-center">
                                    <ContractStatusBadge status={displayStatus(contract)} />
                                </div>
                            </DetailRow>
                            <DetailRow label="URL firma">
                                {link ? (
                                    <div className="flex flex-wrap gap-2">
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                                        >
                                            <Link2 className="h-3.5 w-3.5" />
                                            Abrir enlace
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(link)
                                                toast.success('Enlace copiado')
                                            }}
                                            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                                        >
                                            <Copy className="h-3.5 w-3.5" />
                                            Copiar enlace
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                )}
                            </DetailRow>
                            <DetailRow label="Ciudad"         value={ld?.ciudad} />
                            <DetailRow label="Asesor"         value={ld?.asesor} />
                            <DetailRow label="Fecha libranza" value={ld?.fecha ? fmtDate(ld.fecha) : '—'} />
                        </div>
                    </InfoCard>

                    <InfoCard>
                        <Section title="Datos del Cliente" icon={<User className="h-4 w-4 text-muted-foreground" />} />
                        <div className="mt-3">
                            <DetailRow label="Nombre"      value={ld?.clienteNombre   ?? contractedParty?.name} />
                            <DetailRow label="Cédula"      value={ld?.clienteCC       ?? contractedParty?.identification} />
                            <DetailRow label="Expedida en" value={ld?.clienteCCDe} />
                            <DetailRow label="Dirección"   value={ld?.clienteDireccion ?? contractedParty?.address} />
                            <DetailRow label="Teléfono"    value={ld?.clienteTelefono ?? contractedParty?.phone} />
                            <DetailRow label="Correo"      value={ld?.clienteEmail    ?? contractedParty?.email} />
                            <DetailRow label="Funcionario" value={ld?.clienteFuncionario} />
                            <DetailRow label="Desde hace"  value={ld?.clienteDesdeHace} />
                        </div>
                    </InfoCard>

                    <InfoCard>
                        <Section title="Datos Laborales" icon={<Building2 className="h-4 w-4 text-muted-foreground" />} />
                        <div className="mt-3">
                            <DetailRow label="Municipio"   value={ld?.municipioTrabajo} />
                            <DetailRow label="Empresa"     value={ld?.empresaTrabajo} />
                            <DetailRow label="Departamento" value={ld?.departamento} />
                        </div>
                    </InfoCard>

                    <InfoCard>
                        <Section title="Autorización de Descuento" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} />
                        <div className="mt-3">
                            <DetailRow label="Suma total"  value={ld?.sumaTotal   ?? fmtMoney(contract.amount, contract.currency)} />
                            <DetailRow label="N° cuotas"   value={ld?.numeroCuotas} />
                            <DetailRow label="Valor cuota" value={ld?.valorCuota} />
                            <DetailRow label="Desde mes"   value={ld?.mesCobro} />
                            <DetailRow label="Tipo cuenta" value={ld?.tipoCuenta} />
                            <DetailRow label="N° cuenta"   value={ld?.numeroCuenta} />
                            <DetailRow label="Banco"       value={ld?.banco} />
                            <DetailRow label="Forma pago"  value={ld?.formaPago} />
                        </div>
                    </InfoCard>
                </div>

                {/* ── Columna derecha ── */}
                <div className="space-y-6">
                    <SignerCard contract={contract} />
                    <ProductsCard contract={contract} />

                    {/* Documentos */}
                    <InfoCard>
                        <Section title="Documentos Adjuntos" icon={<FileText className="h-4 w-4 text-muted-foreground" />} />
                        <div className="mt-4">
                            {docsLoading ? (
                                <p className="text-sm text-muted-foreground">Cargando documentos…</p>
                            ) : docs.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sin documentos adjuntos</p>
                            ) : (
                                <div className="grid gap-3">
                                    {docs.map((doc) => {
                                        const isPdf = doc.mimeType?.includes('pdf') || doc.url?.includes('.pdf')
                                        const proxy = docProxyUrl(contract.token, doc.id)
                                        return (
                                            <div key={doc.id} className="rounded-xl border bg-muted/20 p-3">
                                                <div className="mb-3 flex items-start gap-3">
                                                    <div className="rounded-lg bg-background p-2">
                                                        {isPdf
                                                            ? <FileText  className="h-4 w-4 text-muted-foreground" />
                                                            : <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="wrap-break-word text-sm font-semibold">{doc.label}</p>
                                                        <p className="text-[11px] text-muted-foreground">{doc.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <a
                                                        href={proxy}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                        Ver
                                                    </a>
                                                    {isPdf ? (
                                                        <a
                                                            href={doc.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                                                        >
                                                            <FileText className="h-3.5 w-3.5" />
                                                            Descargar PDF
                                                        </a>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => onPreview(proxy)}  // ← sube al padre
                                                            className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                                                        >
                                                            <ImageIcon className="h-3.5 w-3.5" />
                                                            Previsualizar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </InfoCard>

                    {/* Resumen rápido */}
                    <InfoCard className="bg-muted/20">
                        <Section title="Resumen rápido" icon={<MapPin className="h-4 w-4 text-muted-foreground" />} />
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {[
                                { label: 'Cliente', value: ld?.clienteNombre ?? contractedParty?.name ?? '—' },
                                { label: 'Valor',   value: ld?.sumaTotal ?? fmtMoney(contract.amount, contract.currency) },
                                { label: 'Asesor',  value: ld?.asesor  || '—' },
                                { label: 'Ciudad',  value: ld?.ciudad  || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-lg border bg-background p-3">
                                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                                    <p className="mt-1 wrap-break-word text-sm font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    )
}