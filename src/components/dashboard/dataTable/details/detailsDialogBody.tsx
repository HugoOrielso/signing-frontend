import { useMemo } from 'react'
import {
  Building2,
  FileText,
  Link2,
  ShieldCheck,
  User,
  Wallet,
} from 'lucide-react'

import { DetailRow, InfoCard, ProductsCard, Section } from './atoms'
import { fmtDate, fmtMoney, publicUrl } from '@/lib/utils/libranzaHelper'
import { Contract, ContractDocumentItem } from '@/types/libranza'
import { DocumentComplianceCard } from './DocumentCard'

interface DetailsDialogBodyProps {
  contract: Contract
  docs: ContractDocumentItem[]
  docsLoading: boolean
  onPreview: (url: string) => void
}

export const DetailsDialogBody = ({
  contract,
  docs,
  docsLoading,
  onPreview,
}: DetailsDialogBodyProps) => {
  const link = useMemo(() => publicUrl(contract.token), [contract.token])
  const ld = contract.libranzaData
  const contractedParty = contract.parties.find((p) => p.role === 'CONTRACTED')

  const approvedCount = docs.filter((d) => d.status === 'APPROVED').length
  const pendingCount = docs.filter((d) => !d.status || d.status === 'PENDING').length
  const rejectedCount = docs.filter((d) => d.status === 'REJECTED').length

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6">
        {/* FILA 1 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <InfoCard>
            <Section
              title="Resumen General"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />
            <div className="mt-3">
              <DetailRow label="Fecha creación" value={fmtDate(contract.createdAt)} />
              <DetailRow label="Ciudad" value={ld?.ciudad} />
              <DetailRow label="Asesor" value={ld?.asesor} />
              <DetailRow label="Fecha libranza" value={ld?.fecha ? fmtDate(ld.fecha) : '—'} />

              <DetailRow label="Enlace de firma">
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-muted"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Abrir enlace público
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </DetailRow>
            </div>
          </InfoCard>

          <InfoCard>
            <Section
              title="Cliente"
              icon={<User className="h-4 w-4 text-muted-foreground" />}
            />
            <div className="mt-3">
              <DetailRow label="Nombre" value={ld?.clienteNombre ?? contractedParty?.name} />
              <DetailRow label="Cédula" value={ld?.clienteCC ?? contractedParty?.identification} />
              <DetailRow label="Expedida en" value={ld?.clienteCCDe} />
              <DetailRow
                label="Dirección"
                value={ld?.clienteDireccion ?? contractedParty?.address}
              />
              <DetailRow
                label="Teléfono"
                value={ld?.clienteTelefono ?? contractedParty?.phone}
              />
              <DetailRow label="Correo" value={ld?.clienteEmail ?? contractedParty?.email} />
              <DetailRow label="Funcionario" value={ld?.clienteFuncionario} />
              <DetailRow label="Desde hace" value={ld?.clienteDesdeHace} />
            </div>
          </InfoCard>

          <InfoCard>
            <Section
              title="Autorización de Descuento"
              icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            />
            <div className="mt-3">
              <DetailRow
                label="Suma total"
                value={ld?.sumaTotal ?? fmtMoney(contract.amount, contract.currency)}
              />
              <DetailRow label="N° cuotas" value={ld?.numeroCuotas} />
              <DetailRow label="Valor cuota" value={ld?.valorCuota} />
              <DetailRow label="Desde mes" value={ld?.mesCobro} />
              <DetailRow label="Tipo cuenta" value={ld?.tipoCuenta} />
              <DetailRow label="N° cuenta" value={ld?.numeroCuenta} />
              <DetailRow label="Banco" value={ld?.banco} />
              <DetailRow label="Forma pago" value={ld?.formaPago} />
            </div>
          </InfoCard>
        </div>

        {/* FILA 2 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <InfoCard>
            <Section
              title="Datos Laborales"
              icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
            />
            <div className="mt-3">
              <DetailRow label="Municipio" value={ld?.municipioTrabajo} />
              <DetailRow label="Empresa" value={ld?.empresaTrabajo} />
              <DetailRow label="Departamento" value={ld?.departamento} />
            </div>
          </InfoCard>

          <InfoCard>
            <Section
              title="Referencias"
              icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
            />

            {contract.libranzaData?.references?.length ? (
              <div className="mt-3 space-y-3">
                {contract.libranzaData.references.map((ref, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-muted/10 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">{ref.name}</span>
                      <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                        {ref.type === 'LABORAL' ? 'Laboral' : 'Personal'}
                      </span>
                    </div>

                    <div className="grid gap-1 text-xs text-muted-foreground">
                      {ref.phone && (
                        <p>
                          <span className="font-medium text-foreground">Tel:</span> {ref.phone}
                        </p>
                      )}
                      {ref.email && (
                        <p>
                          <span className="font-medium text-foreground">Email:</span> {ref.email}
                        </p>
                      )}
                      {ref.company && (
                        <p>
                          <span className="font-medium text-foreground">Empresa:</span> {ref.company}
                        </p>
                      )}
                      {ref.position && (
                        <p>
                          <span className="font-medium text-foreground">Cargo:</span> {ref.position}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No hay referencias registradas
              </p>
            )}
          </InfoCard>

          <ProductsCard contract={contract} />
        </div>

        {/* FILA 3 */}
        <div>
          <InfoCard>
            <Section
              title="Documentación del expediente"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border bg-muted/10 p-3 text-center">
                <p className="text-lg font-semibold">{docs.length}</p>
                <p className="text-[11px] text-muted-foreground">Documentos</p>
              </div>
              <div className="rounded-xl border bg-emerald-50 p-3 text-center">
                <p className="text-lg font-semibold text-emerald-700">{approvedCount}</p>
                <p className="text-[11px] text-emerald-700/80">Aprobados</p>
              </div>
              <div className="rounded-xl border bg-amber-50 p-3 text-center">
                <p className="text-lg font-semibold text-amber-700">
                  {pendingCount + rejectedCount}
                </p>
                <p className="text-[11px] text-amber-700/80">Por revisar</p>
              </div>
            </div>

            <div className="mt-4">
              {docsLoading ? (
                <p className="text-sm text-muted-foreground">Cargando documentos…</p>
              ) : docs.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-muted/10 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No hay documentos registrados para este contrato.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 grid gap-2 grid-cols-1 lg:grid-cols-2">
                  {docs.map((doc) => (
                    <DocumentComplianceCard
                      key={doc.id}
                      doc={doc}
                      onPreview={onPreview}
                    />
                  ))}
                </div>
              )}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}