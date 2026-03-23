'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Contract } from '@/types/libranza';

import { ContractStatusBadge } from './statusBadge';
import { clientCC, clientName, clientPhone, contractValue, displayStatus, fmtDate, signedCount } from '@/lib/utils/libranzaHelper';
import Link from 'next/link';

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
      header: 'N° / Tipo',
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="space-y-1">
            <div className="w-fit rounded bg-muted px-2 py-0.5 font-mono text-[10px]">
              {c.contractNumber ?? 'S/N'}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              {c.contractType ?? 'Contrato'}
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
            {cc !== '—' && <p className="font-mono text-[11px] text-muted-foreground">CC {cc}</p>}
            {phone && <p className="text-[11px] text-muted-foreground">{phone}</p>}
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
                {parseFloat(ld.valorCuota.replace(/[^0-9.]/g, '') || '0').toLocaleString('es-CO')}
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
            <p className="text-xs text-muted-foreground">{fmtDate(c.createdAt)}</p>
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
      cell: ({ row }) => <ContractStatusBadge status={displayStatus(row.original)} />,
    },
    {
      id: 'firmas',
      header: 'Firmas',
      cell: ({ row }) => {
        const [signed, total] = signedCount(row.original);
        const allSigned = total > 0 && signed === total;
        return (
          <div className="text-center">
            <p className={allSigned ? 'text-[12px] font-bold text-emerald-700' : 'text-[12px] font-bold text-muted-foreground'}>
              {signed}/{total}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">firmas</p>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ViewButton id={row.original.id} />,
    },
  ];
}

function ViewButton({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/manage-contracts/${id}`}
      className="rounded-md border border-border-soft px-3 py-1 text-xs font-medium   transition-colors cursor-pointer"
    >
      Ver
    </Link>
  );
}