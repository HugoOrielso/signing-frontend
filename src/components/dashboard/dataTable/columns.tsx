'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Contract, ContractStatus } from '@/types/libranza';

import { ContractStatusBadge } from './statusBadge';
import {
  clientCC,
  clientName,
  clientPhone,
  contractValue,
  displayStatus,
  fmtDate,
  signedCount,
} from '@/lib/utils/libranzaHelper';
import Link from 'next/link';
import { useSessionStore } from '@/store/adminSession';

function canReviewDocuments(status: ContractStatus) {
  return (
    status === 'PENDING_DOCUMENTS'
  );
}

export function getContractsColumns(): ColumnDef<Contract>[] {
  return [
    {
      id: 'search',
      accessorFn: (row) => {
        const ld = row.libranzaData;
        const contracted = row.parties.find((p) => p.role === 'CONTRACTED');
        return [
          row.contractNumber,
          row.title,
          ld?.clienteNombre ?? contracted?.name,
          ld?.clienteCC ?? contracted?.identification,
          ld?.clienteTelefono ?? contracted?.phone,
          ld?.clienteEmail ?? contracted?.email,
          ld?.asesor,
          ld?.empresaTrabajo,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
      },
      header: () => null,
      cell: () => null,
      enableHiding: true,
    },
    {
      accessorKey: 'contractNumber',
      header: 'Consecutivo',
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="space-y-1">
            <div className="w-fit rounded bg-muted px-2 py-0.5 font-mono text-[10px]">
              {c.consecutivo ?? 'S/N'}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              {c.templateKey ?? 'Contrato'}
            </div>
          </div>
        );
      },
    },
    {
      id: 'cliente',
      header: 'Cliente',
      cell: ({ row }) => {
        const c = row.original;
        const phone = clientPhone(c);
        const cc = clientCC(c);
        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{clientName(c)}</p>
            {cc !== '—' && (
              <p className="font-mono text-[11px] text-muted-foreground">
                CC {cc}
              </p>
            )}
            {phone && (
              <p className="text-[11px] text-muted-foreground">{phone}</p>
            )}
          </div>
        );
      },
    },
    {
      id: 'asesor',
      header: 'Asesor',
      cell: ({ row }) => {
        const asesor = row.original.libranzaData?.asesor;

        return (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{asesor || '—'}</p>
          </div>
        );
      },
    },
    {
      id: 'valor',
      header: 'Valor',
      cell: ({ row }) => {
        const c = row.original;
        const ld = c.libranzaData;
        return (
          <div>
            <p className="text-sm font-semibold">{contractValue(c)}</p>
            {ld?.numeroCuotas && ld?.valorCuota && (
              <p className="text-[10px] text-muted-foreground">
                {ld.numeroCuotas}x $
                {parseFloat(
                  ld.valorCuota.toString() || '0'
                ).toLocaleString('es-CO')}
              </p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div>
            <p className="text-xs text-muted-foreground">
              {fmtDate(c.createdAt)}
            </p>
            {c.libranzaData?.asesor && (
              <p className="truncate text-[10px] text-muted-foreground">
                👤 {c.libranzaData.asesor}
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <ContractStatusBadge status={displayStatus(row.original)} />
      ),
    },
    {
      id: 'firmas',
      header: 'Firmas',
      cell: ({ row }) => {
        const [signed, total] = signedCount(row.original);
        const allSigned = total > 0 && signed === total;

        return (
          <div className="text-center">
            <p
              className={
                allSigned
                  ? 'text-[12px] font-bold text-emerald-700'
                  : 'text-[12px] font-bold text-muted-foreground'
              }
            >
              {signed}/{total}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              firmas
            </p>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ActionsCell contract={row.original} />,
    },
  ];
}

function ActionsCell({ contract }: { contract: Contract }) {
  const contratDataAproved = contract.dataReviewStatus === "APPROVED";
  const contratDataRejected = contract.dataReviewStatus === "REJECTED";
  const contratDataPending = contract.dataReviewStatus === "PENDING";
  const showReviewDocuments = canReviewDocuments(contract.status) && contratDataAproved && contratDataPending
  const user = useSessionStore((s) => s.user);
  return (
    <div className="flex items-center justify-end gap-2">
      {showReviewDocuments && (
        <Link
          href={`/dashboard/upload-documents/${contract.id}`}
          className="rounded-md border border-border-soft px-3 py-1 text-xs font-medium transition-colors cursor-pointer hover:bg-muted"
        >
          Revisar documentos
        </Link>
      )}

      {contract.status === "PENDING_VERIFICATION" && contratDataPending && (
        <div
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Verificar datos del usuario
        </div>
      )}


      {contratDataRejected && user?.role === "CREDIT_ANALYST" && (
        <div
          className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Se deben volver a enviar los datos
        </div>
      )}

      {contratDataRejected && (user?.role === "OPERATOR" || user?.role === "ADMIN") && (
        <Link href={`/dashboard/review/${contract.id}`}
          className="rounded-md border border-red-500 bg-red-50 text-red-700 px-3 py-1 text-xs font-medium transition-colors cursor-pointer "
        >
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Revisar documento rechazado
        </Link>
      )}

      <Link
        href={`/dashboard/manage-contracts/${contract.id}`}
        className="rounded-md border border-border-soft px-3 py-1 text-xs font-medium transition-colors cursor-pointer hover:bg-muted"
      >
        Ver
      </Link>
    </div>
  );
}