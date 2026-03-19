'use client';

import api from '@/lib/axiosClient';
import { LibranzaForm } from '@/types/libranza';
import { useState } from 'react';
import { toast } from 'sonner';
import { LibranzaDocument } from './LibranzaDocument/LibranzaDocumentTest';
import { AxiosError } from 'axios';

const INK = '#1a1a2e';
const GOLD = '#c9a84c';
const BORDER = '#d4c9b0';
const MUTED = '#7a6e5f';

interface Props { form: LibranzaForm; onPrev: () => void; }

function buildLibranzaPayload(f: LibranzaForm) {
  return {
    title: `Libranza Dimcultura - ${f.clienteNombre}`,
    contractType: 'LIBRANZA',
    subject: `Autorización de descuento por nómina · ${f.clienteNombre}`,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: f.sumaTotal ? parseFloat(f.sumaTotal.replace(/[^0-9.]/g, '')) : undefined,
    currency: 'COP',
    paymentMethod: f.formaPago || undefined,
    ciudad: f.ciudad, asesor: f.asesor, fecha: f.fecha,
    clienteCC: f.clienteCC, clienteCCDe: f.clienteCCDe,
    clienteDireccion: f.clienteDireccion, clienteTelefono: f.clienteTelefono,
    clienteEmail: f.clienteEmail, clienteFuncionario: f.clienteFuncionario,
    clienteDesdeHace: f.clienteDesdeHace, municipioTrabajo: f.municipioTrabajo,
    empresaTrabajo: f.empresaTrabajo, departamento: f.departamento,
    sumaTotal: f.sumaTotal, numeroCuotas: f.numeroCuotas,
    valorCuota: f.valorCuota, mesCobro: f.mesCobro,
    tipoCuenta: f.tipoCuenta, numeroCuenta: f.numeroCuenta, banco: f.banco,
    productos: f.productos, formaPago: f.formaPago,
    parties: [
      { role: 'CONTRACTOR', name: 'Dimcultura S.A.S.', identification: '900.585.322-4', email: 'servicioalcliente@dimcultura.com' },
      { role: 'CONTRACTED', name: f.clienteNombre, identification: f.clienteCC, email: f.clienteEmail || f.destinatarioEmail, phone: f.clienteTelefono, address: f.clienteDireccion },
    ],
    signers: [{
      partyRole: 'CONTRACTED', name: f.destinatarioNombre || f.clienteNombre,
      email: f.destinatarioEmail, phone: f.clienteTelefono, roleTitle: 'Contratado', signerOrder: 1,
    }],
  };
}

export default function LibranzaStepPreview({ form, onPrev }: Props) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const libranzaData = {
    ciudad: form.ciudad, asesor: form.asesor, fecha: form.fecha,
    clienteNombre: form.clienteNombre, clienteCC: form.clienteCC,
    clienteCCDe: form.clienteCCDe, clienteDireccion: form.clienteDireccion,
    clienteTelefono: form.clienteTelefono, clienteEmail: form.clienteEmail,
    clienteFuncionario: form.clienteFuncionario, clienteDesdeHace: form.clienteDesdeHace,
    municipioTrabajo: form.municipioTrabajo, empresaTrabajo: form.empresaTrabajo,
    departamento: form.departamento, sumaTotal: form.sumaTotal,
    numeroCuotas: form.numeroCuotas, valorCuota: form.valorCuota,
    mesCobro: form.mesCobro, tipoCuenta: form.tipoCuenta,
    numeroCuenta: form.numeroCuenta, banco: form.banco,
    productos: form.productos, formaPago: form.formaPago,
  };

  async function handleSend() {
    if (!form.destinatarioEmail) { toast.error('Debes ingresar el correo del destinatario'); return; }
    setSending(true);
    try {
      await api.post('/contracts', buildLibranzaPayload(form));
      setSent(true);
      toast.success('Libranza creada y enviada correctamente');
    } catch (err: any) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "No se pudo enviar la libranza");
    } finally { setSending(false); }
  }

  if (sent) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '80px 0', textAlign: 'center', gap: 20
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#e8f5ee',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, color: INK, margin: 0 }}>
            ¡Libranza enviada!
          </h2>
          <p style={{ marginTop: 8, fontSize: 14, color: MUTED }}>
            Enlace de firma enviado a <strong>{form.destinatarioEmail}</strong>
          </p>
        </div>
        <a href="/dashboard" style={{
          padding: '12px 28px', borderRadius: 8,
          background: INK, color: GOLD, fontSize: 13, fontWeight: 600, textDecoration: 'none'
        }}>
          Volver al panel →
        </a>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: INK, marginBottom: 4 }}>
          Vista Previa
        </h1>
        <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>
          Revisa el documento antes de enviarlo al cliente.
        </p>
      </div>

      {/* Banner de envío */}
      <div style={{
        marginBottom: 24, padding: 20, borderRadius: 12,
        border: `1.5px solid ${GOLD}`, background: '#fffdf5',
        display: 'flex', alignItems: 'center', gap: 16
      }}>
        <span style={{ fontSize: 24 }}>📧</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: '0 0 4px' }}>
            Enviar a: <span style={{ color: GOLD }}>{form.destinatarioEmail || '(sin correo)'}</span>
          </p>
          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
            El cliente recibirá un enlace para revisar y firmar la libranza.
          </p>
        </div>
        <button onClick={handleSend} disabled={sending || !form.destinatarioEmail} style={{
          padding: '12px 24px', borderRadius: 8, border: 'none',
          background: '#2d6a4f', color: 'white', fontSize: 13, fontWeight: 600,
          cursor: sending || !form.destinatarioEmail ? 'not-allowed' : 'pointer',
          opacity: !form.destinatarioEmail ? 0.4 : 1, whiteSpace: 'nowrap',
        }}>
          {sending ? 'Enviando…' : '✓ Enviar al cliente'}
        </button>
      </div>

      {/* Documento — solo vista previa, sin firma ni uploads */}
      <div style={{ background: '#f0ece4', padding: 20, borderRadius: 12, overflowX: 'auto' }}>
        <LibranzaDocument
          data={libranzaData}
          showSignatureZone={false}
        />
      </div>

      {/* Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 36, paddingTop: 24, borderTop: `1px solid ${BORDER}`
      }}>
        <button onClick={onPrev} style={{
          padding: '12px 24px', borderRadius: 8,
          border: `1.5px solid ${BORDER}`, background: 'transparent', color: INK,
          fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>
          ← Editar datos
        </button>
        <button onClick={handleSend} disabled={sending || !form.destinatarioEmail} style={{
          padding: '12px 28px', borderRadius: 8, border: 'none',
          background: '#2d6a4f', color: 'white', fontSize: 13, fontWeight: 600,
          cursor: sending || !form.destinatarioEmail ? 'not-allowed' : 'pointer',
          opacity: !form.destinatarioEmail ? 0.4 : 1,
        }}>
          {sending ? 'Enviando…' : '✓ Enviar al cliente'}
        </button>
      </div>
    </div>
  );
}