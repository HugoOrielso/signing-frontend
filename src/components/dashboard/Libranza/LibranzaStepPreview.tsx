'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { useLibranzaStore } from '@/store/libranzaStore';
import { LibranzaDocument } from '@/components/libranza/LibranzaDocument';
import { ScaledDocumentViewer } from '@/components/libranza/viewer/ScaledDocument';
import { useParams, usePathname } from 'next/navigation';
import { empresaConfig, getEmpresaFromPath } from '@/config/bussiness';



export default function LibranzaStepPreview() {
  const form = useLibranzaStore((state) => state.form);
  const prevStep = useLibranzaStore((state) => state.prevStep);
  const params = useParams()
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const pathname = usePathname();
  const templateKey = params.id
  const empresa = getEmpresaFromPath(pathname);
  const config = empresaConfig[empresa];

  const libranzaData = {
    ciudad: form.ciudad,
    asesor: form.asesor,
    fecha: form.fecha,

    clienteNombre: form.clienteNombre,
    clienteCC: form.clienteCC,
    clienteCCDe: form.clienteCCDe,
    clienteFechaNacimiento: form.clienteFechaNacimiento,
    clienteFechaExpedicionCC: form.clienteFechaExpedicionCC,
    clienteDireccion: form.clienteDireccion,
    clienteTelefono: form.clienteTelefono,
    clienteEmail: form.clienteEmail,
    clienteFuncionario: form.clienteFuncionario,
    clienteDesdeHace: form.clienteDesdeHace,

    pagaduriaNombre: form.pagaduriaNombre,
    pagaduriaMunicipio: form.pagaduriaMunicipio,
    pagaduriaDepartamento: form.pagaduriaDepartamento,

    municipioTrabajo: form.municipioTrabajo,
    empresaTrabajo: form.empresaTrabajo,
    departamento: form.departamento,

    tipoContrato: form.tipoContrato,

    sumaTotal: form.sumaTotal,
    numeroCuotas: form.numeroCuotas,
    valorCuota: form.valorCuota,
    mesCobro: form.mesCobro,

    tipoCuenta: form.tipoCuenta,
    numeroCuenta: form.numeroCuenta,
    banco: form.banco,

    productos: form.productos,
    formaPago: form.formaPago,
    references: form.references,
    templateKey: config.nombre,
  };

  async function handleSend() {
    if (!form.clienteEmail) {
      toast.error('Debes ingresar el correo del destinatario');
      return;
    }

    setSending(true);

    try {
      setSent(true);
      toast.success('Libranza creada y enviada correctamente');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? 'No se pudo enviar la libranza');
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-5 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5ee]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2d6a4f"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <div>
          <h2 className="m-0 font-serif text-2xl text-ink">¡Libranza enviada!</h2>
          <p className="mt-2 text-sm ">
            Enlace de firma enviado a <strong>{form.clienteEmail}</strong>
          </p>
        </div>

        <a
          href="/dashboard"
          className="rounded-lg bg-ink px-7 py-3 text-sm font-semibold text-gold no-underline"
        >
          Volver al panel →
        </a>
      </div>
    );
  }

  return (
    <div className='max-w-215 mx-auto'>
      <div className="mb-6">
        <h1 className="mb-1 font-serif text-[22px] ">Vista Previa</h1>
        <p className="m-0 text-sm ">
          Revisa el documento antes de enviarlo al cliente.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-5 md:flex-row md:items-center">
        <span className="text-2xl">📧</span>

        <div className="flex-1">
          <p className="mb-1 text-sm font-semibold ">
            Enviar a:{' '}
            <span >
              {form.clienteEmail || '(sin correo)'}
            </span>
          </p>
          <p className="m-0 text-xs ">
            El cliente recibirá un enlace para revisar y firmar la libranza.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !form.clienteEmail}
          className="whitespace-nowrap rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer hover:bg-green-600 transition-all duration-200"
        >
          {sending ? 'Enviando…' : '✓ Enviar al cliente'}
        </button>
      </div>

      <ScaledDocumentViewer>
        <LibranzaDocument data={libranzaData} showSignatureZone={false} templateKey={templateKey?.toString() ?? 'dimcultura'} />
      </ScaledDocumentViewer>

      <div className="mt-9 flex flex-col justify-between gap-3 border-t  pt-6 md:flex-row md:items-center">
        <button
          type="button"
          onClick={() => {
            prevStep();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="rounded-lg cursor-pointer hover:bg-zinc-200  border border-blue-200 bg-transparent px-6 py-3 text-sm font-semibold text-ink transition duration-200"
        >
          ← Editar datos
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !form.clienteEmail}
          className="whitespace-nowrap rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer hover:bg-green-600 transition-all duration-200"
        >
          {sending ? 'Enviando…' : '✓ Enviar al cliente'}
        </button>
      </div>
    </div>
  );
}