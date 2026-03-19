'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import publicApi from '@/lib/axiosPublicClient';
import type { Contract } from '@/types/libranza';
import StatsBar from './StatsBar';
import StatusBadge from './StatusBadge';
import api from '@/lib/axiosClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
function docProxyUrl(token: string | null | undefined, docId: string) {
  return `${API_BASE}/contracts/public/${token}/documents/${docId}/view`;
}

const INK    = '#1a1a2e';
const GOLD   = '#c9a84c';
const GOLD_D = '#a07830';
const CREAM  = '#f5f0e8';
const BORDER = '#d4c9b0';
const MUTED  = '#7a6e5f';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'Todos',       value: 'ALL'              },
  { label: 'Enviados',    value: 'SENT_VIEWED'      },
  { label: 'Pend. firma', value: 'PARTIALLY_SIGNED' },
  { label: 'Firmados',    value: 'SIGNED'           },
  { label: 'Expirados',   value: 'EXPIRED'          },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDate(d?: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-CO', { day:'numeric', month:'short', year:'numeric' });
}
function fmtMoney(v?: number | null, currency?: string | null) {
  if (!v) return '—';
  return `$${v.toLocaleString('es-CO', { minimumFractionDigits:0 })} ${currency ?? 'COP'}`;
}
function clientName(c: Contract): string {
  return c.libranzaData?.clienteNombre
    ?? c.parties.find(p => p.role === 'CONTRACTED')?.name
    ?? '—';
}
function clientCC(c: Contract): string {
  return c.libranzaData?.clienteCC
    ?? c.parties.find(p => p.role === 'CONTRACTED')?.identification
    ?? '—';
}
function clientPhone(c: Contract): string | null {
  return c.libranzaData?.clienteTelefono
    ?? c.parties.find(p => p.role === 'CONTRACTED')?.phone
    ?? null;
}
function contractValue(c: Contract): string {
  const ld = c.libranzaData;
  if (ld?.sumaTotal?.trim()) {
    const n = parseFloat(ld.sumaTotal.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? ld.sumaTotal : `$${n.toLocaleString('es-CO')}`;
  }
  return fmtMoney(c.amount, c.currency);
}
function signedCount(c: Contract): [number, number] {
  const total  = c.signers.length;
  // Cross-reference signatures array — ContractSigner doesn't have signedAt
  const signed = c.signers.filter(s =>
    c.signatures.some(sig => sig.signerId === s.id)
  ).length;
  return [signed, total];
}

function signerSignedAt(c: Contract, signerId: string): string | null {
  return c.signatures.find(sig => sig.signerId === signerId)?.signedAt ?? null;
}

function signerIsSigned(c: Contract, signerId: string): boolean {
  return c.signatures.some(sig => sig.signerId === signerId);
}

// Derive a display status that's more precise than what the DB stores
function displayStatus(c: Contract): string {
  const [signed, total] = signedCount(c);
  if (c.status === 'SIGNED' || (total > 0 && signed === total)) return 'SIGNED';
  if (c.status === 'PARTIALLY_SIGNED' || (total > 0 && signed > 0)) return 'PARTIALLY_SIGNED';
  if (c.status === 'SENT' || c.status === 'VIEWED') return 'PENDING_SIGN';
  return c.status;
}

function publicUrl(token?: string | null): string | null {
  if (!token) return null;
  const base = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/contracts/sign/${token}`;
}

// ── ContractRow ────────────────────────────────────────────────────────────
function ContractRow({ c, onClick }: { c: Contract; onClick: () => void }) {
  const ld = c.libranzaData;
  const [signed, total] = signedCount(c);
  const allSigned = total > 0 && signed === total;

  return (
    <div onClick={onClick}
      className="grid items-center px-5 py-4 gap-4 cursor-pointer border-b last:border-0 transition-colors hover:bg-[#fffdf9]"
      style={{ gridTemplateColumns:'1fr 1.7fr 0.9fr 0.8fr 1.1fr 0.7fr auto', borderColor:CREAM }}>

      {/* N° / Tipo */}
      <div>
        <div className="text-[10px] font-mono px-2 py-0.5 rounded w-fit mb-1"
          style={{ background:CREAM, color:MUTED }}>
          {c.contractNumber ?? 'S/N'}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color:GOLD_D }}>
          {c.contractType ?? 'Contrato'}
        </div>
      </div>

      {/* Cliente */}
      <div className="min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color:INK }}>{clientName(c)}</p>
        {clientCC(c) !== '—' && (
          <p className="text-[11px] font-mono" style={{ color:MUTED }}>CC {clientCC(c)}</p>
        )}
        {clientPhone(c) && (
          <p className="text-[11px]" style={{ color:MUTED }}>{clientPhone(c)}</p>
        )}
      </div>

      {/* Valor */}
      <div>
        <p className="text-sm font-semibold" style={{ color:INK }}>{contractValue(c)}</p>
        {ld?.numeroCuotas && ld?.valorCuota && (
          <p className="text-[10px]" style={{ color:MUTED }}>
            {ld.numeroCuotas}x ${parseFloat(ld.valorCuota.replace(/[^0-9.]/g,'')).toLocaleString('es-CO')}
          </p>
        )}
      </div>

      {/* Fecha / Asesor */}
      <div>
        <p className="text-xs" style={{ color:MUTED }}>{fmtDate(c.createdAt)}</p>
        {ld?.asesor && (
          <p className="text-[10px] truncate" style={{ color:MUTED }}>
            👤 {ld.asesor}
          </p>
        )}
      </div>

      {/* Estado */}
      <StatusBadge status={displayStatus(c)} />

      {/* Firmas */}
      <div className="text-center">
        <p className="text-[12px] font-bold" style={{ color: allSigned ? '#065f46' : MUTED }}>
          {signed}/{total}
        </p>
        <p className="text-[9px] uppercase tracking-wider" style={{ color:BORDER }}>firmas</p>
      </div>

      {/* Ver */}
      <button onClick={e => { e.stopPropagation(); onClick(); }}
        className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg border-[1.5px] transition-all whitespace-nowrap"
        style={{ borderColor:BORDER, color:MUTED, background:'white' }}>
        Ver
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}



function Section({ title }: { title: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest mt-5 mb-2 pt-4 border-t"
      style={{ color:MUTED, borderColor:CREAM }}>
      {title}
    </p>
  );
}

interface ContractDocumentItem {
  id: string; type: string; label: string; url: string;
  mimeType?: string; uploadedAt: string;
}

const DOC_TYPE_ICON: Record<string, string> = {
  CEDULA_FRENTE:  '🪪', CEDULA_REVERSO: '🪪',
  SELFIE:         '🤳', PDF_ADICIONAL:  '📄', IMAGEN_GENERAL: '🖼️',
};

function ContractDetail({ c, onClose }: { c: Contract; onClose: () => void }) {
  const ld = c.libranzaData;
  const contractedParty = c.parties.find(p => p.role === 'CONTRACTED');
  const [docs,        setDocs]        = useState<ContractDocumentItem[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);

  useEffect(() => {
    if (!c.token) return;
    setDocsLoading(true);
    publicApi.get(`/contracts/public/${c.token}/documents`)
      .then(res => setDocs(res.data.documents ?? []))
      .catch(() => {/* sin documentos */})
      .finally(() => setDocsLoading(false));
  }, [c.token]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4"
      style={{ background:'rgba(26,26,46,0.55)', backdropFilter:'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl max-h-[88vh] flex flex-col"
        style={{ background:'white' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background:INK, borderBottom:`2px solid ${GOLD}` }}>
          <div>
            <p style={{ fontFamily:'Playfair Display, serif', fontSize:17, color:GOLD, margin:0 }}>
              {c.title}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color:'#5a5a7a' }}>
              {c.contractNumber ?? 'Sin número'} · {c.contractType ?? 'Contrato'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={displayStatus(c)} />
            <button onClick={onClose}
              style={{ color:'#5a5a7a', background:'transparent', border:'none', cursor:'pointer', fontSize:18, lineHeight:1 }}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">

          {/* General */}
          <Section title="General" />
          <DetailRow label="Fecha creación" value={fmtDate(c.createdAt)} />
          <DetailRow label="Estado">
            <StatusBadge status={displayStatus(c)} />
          </DetailRow>
          <DetailRow label="URL firma"
            value={publicUrl(c.token) ?? '—'}
          />
          <DetailRow label="Ciudad"         value={ld?.ciudad} />
          <DetailRow label="Asesor"         value={ld?.asesor} />
          <DetailRow label="Fecha libranza" value={ld?.fecha} />

          {/* Cliente */}
          <Section title="Datos del Cliente" />
          <DetailRow label="Nombre"       value={ld?.clienteNombre       ?? contractedParty?.name} />
          <DetailRow label="Cédula"       value={ld?.clienteCC           ?? contractedParty?.identification} />
          <DetailRow label="Expedida en"  value={ld?.clienteCCDe} />
          <DetailRow label="Dirección"    value={ld?.clienteDireccion    ?? contractedParty?.address} />
          <DetailRow label="Teléfono"     value={ld?.clienteTelefono     ?? contractedParty?.phone} />
          <DetailRow label="Correo"       value={ld?.clienteEmail        ?? contractedParty?.email} />
          <DetailRow label="Funcionario"  value={ld?.clienteFuncionario} />
          <DetailRow label="Desde hace"   value={ld?.clienteDesdeHace} />

          {/* Laboral */}
          <Section title="Datos Laborales" />
          <DetailRow label="Municipio"    value={ld?.municipioTrabajo} />
          <DetailRow label="Empresa"      value={ld?.empresaTrabajo} />
          <DetailRow label="Departamento" value={ld?.departamento} />

          {/* Financiero */}
          <Section title="Autorización de Descuento" />
          <DetailRow label="Suma total"   value={ld?.sumaTotal   ?? fmtMoney(c.amount, c.currency)} />
          <DetailRow label="N° cuotas"    value={ld?.numeroCuotas} />
          <DetailRow label="Valor cuota"  value={ld?.valorCuota} />
          <DetailRow label="Desde mes"    value={ld?.mesCobro} />
          <DetailRow label="Tipo cuenta"  value={ld?.tipoCuenta} />
          <DetailRow label="N° cuenta"    value={ld?.numeroCuenta} />
          <DetailRow label="Banco"        value={ld?.banco} />
          <DetailRow label="Forma pago"   value={ld?.formaPago} />

          {/* Firmantes */}
          {c.signers.length > 0 && (
            <>
              <Section title="Firmantes" />
              {c.signers.map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg mb-2"
                  style={{ background:CREAM, border:`1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: signerIsSigned(c, s.id) ? `linear-gradient(135deg,${GOLD},${GOLD_D})` : '#e8e4da',
                        color:      signerIsSigned(c, s.id) ? 'white' : MUTED,
                      }}>
                      {s.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color:INK }}>{s.name}</p>
                      <p className="text-[10px]" style={{ color:MUTED }}>{s.partyRole ?? s.roleTitle}</p>
                    </div>
                  </div>
                  {signerIsSigned(c, s.id) ? (
                    <span className="text-[10px] font-semibold" style={{ color:'#065f46' }}>
                      ✓ {fmtDate(signerSignedAt(c, s.id))}
                    </span>
                  ) : (
                    <span className="text-[10px]" style={{ color:BORDER }}>Pendiente</span>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Productos */}
          {ld?.productos && ld.productos.length > 0 && (
            <>
              <Section title="Productos" />
              {ld.productos.map((p, i) => (
                <div key={i} className="flex justify-between py-2 border-b text-sm"
                  style={{ borderColor:CREAM, color:INK }}>
                  <span>
                    {p.codigo && (
                      <span className="font-mono text-[10px] mr-2" style={{ color:MUTED }}>{p.codigo}</span>
                    )}
                    {p.descripcion || '—'}
                  </span>
                  <span className="font-semibold ml-4 shrink-0">{p.valor}</span>
                </div>
              ))}
            </>
          )}
        </div>

          {/* Documentos adjuntos */}
          <Section title="Documentos Adjuntos" />
          {docsLoading ? (
            <p style={{ fontSize:12, color:MUTED }}>Cargando documentos…</p>
          ) : docs.length === 0 ? (
            <p style={{ fontSize:12, color:BORDER }}>Sin documentos adjuntos</p>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {docs.map(doc => {
                const isPdf = doc.mimeType?.includes('pdf') || doc.url?.includes('.pdf');
                return (
                  <div key={doc.id}
                    onClick={() => !isPdf && setPreviewUrl(docProxyUrl(c.token, doc.id))}
                    style={{ border:`1px solid ${BORDER}`, borderRadius:10, overflow:'hidden',
                      cursor: isPdf ? 'default' : 'zoom-in', background:CREAM }}>
                    {isPdf ? (
                      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px' }}>
                        <span style={{ fontSize:22 }}>📄</span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:11, fontWeight:600, color:INK, margin:0 }}>{doc.label}</p>
                          <div style={{ display:'flex', gap:12, marginTop:4 }}>
                            <a href={docProxyUrl(c.token, doc.id)} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize:10, color:MUTED, textDecoration:'underline' }}>
                              Ver →
                            </a>
                            <a href={doc.url} 
                              style={{ fontSize:10, color:GOLD_D, textDecoration:'underline', fontWeight:600 }}>
                              Descargar PDF ↓
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={docProxyUrl(c.token, doc.id)} alt={doc.label}
                          style={{ width:'100%', height:80, objectFit:'cover', display:'block' }} />
                        <div style={{ padding:'6px 10px' }}>
                          <p style={{ fontSize:10, fontWeight:600, color:INK, margin:0 }}>
                            {DOC_TYPE_ICON[doc.type] ?? '📎'} {doc.label}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Preview imagen */}
          {previewUrl && (
            <div onClick={() => setPreviewUrl(null)}
              style={{ position:'fixed', inset:0, zIndex:100,
                background:'rgba(26,26,46,0.85)', display:'flex',
                alignItems:'center', justifyContent:'center', padding:24 }}>
              <div style={{ position:'relative', maxWidth:600, width:'100%' }}
                onClick={e => e.stopPropagation()}>
                <button onClick={() => setPreviewUrl(null)}
                  style={{ position:'absolute', top:-36, right:0, background:'none',
                    border:'none', color:'white', fontSize:16, cursor:'pointer' }}>
                  ✕ Cerrar
                </button>
                <img src={previewUrl} alt="preview"
                  style={{ width:'100%', borderRadius:12 }} />
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 flex justify-end gap-3 border-t"
          style={{ borderColor:BORDER }}>
          <button onClick={onClose}
            style={{ padding:'10px 20px', borderRadius:8, border:`1.5px solid ${BORDER}`,
              background:'white', color:INK, fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DetailRow overload para ReactNode ─────────────────────────────────────
function DetailRow({ label, value, children }: {
  label: string; value?: string | null; children?: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 py-2 border-b last:border-0"
      style={{ gridTemplateColumns:'160px 1fr', borderColor:CREAM }}>
      <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color:MUTED }}>
        {label}
      </span>
      {children ? (
        <div>{children}</div>
      ) : (
        <span className="text-sm break-all" style={{ color: value && value !== '—' ? INK : BORDER }}>
          {value ?? '—'}
        </span>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ContractsList() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('ALL');
  const [search,    setSearch]    = useState('');
  const [selected,  setSelected]  = useState<Contract | null>(null);

  useEffect(() => {
    api.get('/contracts')
      .then(res => {
        const data = res.data?.data ?? res.data?.contracts ?? [];
        setContracts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = contracts.filter(c => {
    const matchStatus =
      filter === 'ALL'
      || (filter === 'SENT_VIEWED' && ['SENT','VIEWED'].includes(c.status))
      || c.status === filter;
    if (!matchStatus) return false;
    if (!search.trim()) return true;

    const q  = search.toLowerCase();
    const ld = c.libranzaData;
    const cp = c.parties.find(p => p.role === 'CONTRACTED');

    return [
      c.contractNumber,
      c.title,
      ld?.clienteNombre    ?? cp?.name,
      ld?.clienteCC        ?? cp?.identification,
      ld?.clienteTelefono  ?? cp?.phone,
      ld?.clienteEmail     ?? cp?.email,
      ld?.asesor,
      ld?.empresaTrabajo,
    ].some(v => v?.toLowerCase().includes(q));
  });

  return (
    <div>
      <StatsBar contracts={contracts} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background:CREAM }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.value} onClick={() => setFilter(tab.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border-none cursor-pointer"
              style={{
                background: filter === tab.value ? INK  : 'transparent',
                color:      filter === tab.value ? GOLD : MUTED,
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
            style={{ color:MUTED }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Buscar por nombre, cédula, teléfono…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-8 py-2 text-xs rounded-lg focus:outline-none transition-all w-72"
            style={{ border:`1.5px solid ${search ? GOLD : BORDER}`, color:INK, background:'white' }} />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color:MUTED, background:'transparent', border:'none', cursor:'pointer', fontSize:13 }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background:'white', borderRadius:12, border:`1.5px solid ${BORDER}`, overflow:'hidden' }}>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 rounded-full border-2 animate-spin"
              style={{ borderColor:BORDER, borderTopColor:GOLD }} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasContracts={contracts.length > 0} search={search} />
        ) : (
          <>
            <div className="grid items-center px-5 py-3 gap-4 border-b"
              style={{ borderColor:CREAM, gridTemplateColumns:'1fr 1.7fr 0.9fr 0.8fr 1.1fr 0.7fr auto' }}>
              {['N° / Tipo','Cliente','Valor','Fecha','Estado','Firmas',''].map(h => (
                <span key={h} className="text-[10px] font-semibold uppercase tracking-widest" style={{ color:MUTED }}>
                  {h}
                </span>
              ))}
            </div>
            {filtered.map(c => (
              <ContractRow key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs mt-3 text-right" style={{ color:MUTED }}>
          {filtered.length} contrato{filtered.length !== 1 ? 's' : ''}
          {filter !== 'ALL' && ' · filtrado'}
          {search && ` · "${search}"`}
        </p>
      )}

      {selected && (
        <ContractDetail c={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function EmptyState({ hasContracts, search }: { hasContracts: boolean; search: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3">
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:CREAM }}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color:MUTED }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <p style={{ fontFamily:'Playfair Display, serif', fontSize:16, color:INK }}>
        {search ? `Sin resultados para "${search}"` : hasContracts ? 'Sin resultados para este filtro' : 'Aún no tienes libranzas'}
      </p>
      {!hasContracts && !search && (
        <Link href="/dashboard/new"
          className="mt-1 px-5 py-2 rounded-lg text-xs font-semibold no-underline"
          style={{ background:INK, color:GOLD }}>
          Crear primera libranza
        </Link>
      )}
    </div>
  );
}