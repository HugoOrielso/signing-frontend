import { useMemo } from 'react'
import {
  Building2,
  ExternalLink,
  FileText,
  ImageIcon,
  Link2,
  User,
  Wallet,
} from 'lucide-react'

import { DetailRow, InfoCard, ProductsCard, Section } from './atoms'
import { displayStatus, fmtDate, fmtMoney, publicUrl } from '@/lib/utils/libranzaHelper'
import { Contract, ContractDocumentItem } from '@/types/libranza'
import { docProxyUrl } from './proxyUrl'
import { ContractStatusBadge } from '../statusBadge'

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
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Columna principal */}
        <div className="space-y-6 xl:col-span-4">
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
                      className="inline-flex items-center gap-2 rounded-md border p-2 text-xs font-semibold transition hover:bg-muted"
                    >
                      <Link2 className="h-3 w-3" />
                      Abrir enlace
                    </a>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </DetailRow>
              <DetailRow label="Ciudad" value={ld?.ciudad} />
              <DetailRow label="Asesor" value={ld?.asesor} />
              <DetailRow label="Fecha libranza" value={ld?.fecha ? fmtDate(ld.fecha) : '—'} />
            </div>
          </InfoCard>

          <InfoCard>
            <Section title="Datos del Cliente" icon={<User className="h-4 w-4 text-muted-foreground" />} />
            <div className="mt-3">
              <DetailRow label="Nombre" value={ld?.clienteNombre ?? contractedParty?.name} />
              <DetailRow label="Cédula" value={ld?.clienteCC ?? contractedParty?.identification} />
              <DetailRow label="Expedida en" value={ld?.clienteCCDe} />
              <DetailRow label="Dirección" value={ld?.clienteDireccion ?? contractedParty?.address} />
              <DetailRow label="Teléfono" value={ld?.clienteTelefono ?? contractedParty?.phone} />
              <DetailRow label="Correo" value={ld?.clienteEmail ?? contractedParty?.email} />
              <DetailRow label="Funcionario" value={ld?.clienteFuncionario} />
              <DetailRow label="Desde hace" value={ld?.clienteDesdeHace} />
            </div>
          </InfoCard>


        </div>
        <div className="space-y-6 xl:col-span-4">
          <div className="grid grid-cols-1 gap-6 ">
            <InfoCard>
              <Section title="Datos Laborales" icon={<Building2 className="h-4 w-4 text-muted-foreground" />} />
              <div className="mt-3">
                <DetailRow label="Municipio" value={ld?.municipioTrabajo} />
                <DetailRow label="Empresa" value={ld?.empresaTrabajo} />
                <DetailRow label="Departamento" value={ld?.departamento} />
              </div>
            </InfoCard>

            <InfoCard>
              <Section title="Autorización de Descuento" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} />
              <div className="mt-3">
                <DetailRow label="Suma total" value={ld?.sumaTotal ?? fmtMoney(contract.amount, contract.currency)} />
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
        </div>
        {/* Columna lateral: cards pequeñas apiladas */}
        <div className="space-y-6 xl:col-span-4">
          {/* <SignerCard contract={contract} /> */}

          <ProductsCard contract={contract} />

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
                      <div key={doc.id} className="rounded-xl border bg-muted/20 p-2">
                        <div className="mb-3 flex items-start gap-3">
                          <div className="rounded-lg bg-background p-2">
                            {isPdf ? (
                              <FileText className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <ImageIcon className="h-3 w-3 text-muted-foreground" />
                            )}
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
                            <ExternalLink className="h-3 w-3" />
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
                              onClick={() => onPreview(proxy)}
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
          <InfoCard>
            <Section
              title="Referencias"
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            />

            {contract.libranzaData?.references?.length ? (
              <div className="space-y-3">
                {contract.libranzaData.references.map((ref) => (
                  <div
                    key={ref.email}
                    className="border rounded-lg p-3 mt-2 bg-muted/20 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{ref.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {ref.type === "LABORAL" ? "Laboral" : "Personal"}
                      </span>
                    </div>

                    {ref.phone && (
                      <div className="text-muted-foreground">Tel: {ref.phone}</div>
                    )}

                    {ref.email && (
                      <div className="text-muted-foreground">Email: {ref.email}</div>
                    )}

                    {ref.company && (
                      <div className="text-muted-foreground">Empresa: {ref.company}</div>
                    )}

                    {ref.position && (
                      <div className="text-muted-foreground">Cargo: {ref.position}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay referencias registradas
              </p>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  )
}  