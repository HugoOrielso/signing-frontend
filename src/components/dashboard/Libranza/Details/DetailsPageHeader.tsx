'use client';

import { displayStatus, fmtDate, publicUrlAdmin } from '@/lib/utils/libranzaHelper';
import { Contract } from '@/types/libranza';
import { BadgeCheck, CalendarDays, Copy, FileText, History, PencilLine } from 'lucide-react';
import { useMemo } from 'react';
import { ContractStatusBadge } from '@/components/dashboard/dataTable/statusBadge';
import { useParams } from 'next/navigation';
import CancelLibranza from '../cancelLibranza';
import { TakeLibranzaButton } from '../takeLibranza';
import { useSessionStore } from '@/store/adminSession';

export function DetailsPageHeader({ contract }: { contract: Contract }) {
  const params = useParams()
  const user = useSessionStore((s) => s.user);
  const link = useMemo(() => publicUrlAdmin(contract.token), [contract.token]);

  const isSignedOrCancelled =
    contract.status === "SIGNED" || contract.status === "CANCELLED";

  const canTake =
    !contract.assignedToId &&
    (user?.role === "CREDIT_ANALYST" || user?.role === "ADMIN") &&
    !isSignedOrCancelled;

  const isTakenByMe = contract.assignedToId === user?.id;


  const canCancel =
    !isSignedOrCancelled &&
    (user?.role === "ADMIN" || isTakenByMe);

  return (
    <div className="bg-muted/30 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div className="min-w-0">
          <h1 className="text-left text-2xl font-bold leading-tight">
            <span className='uppercase'>
              {contract.templateKey}
            </span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ">
            <span className="inline-flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {contract.consecutivo ?? 'Sin número'}
            </span>
            <span className="inline-flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              {contract.contractType ?? 'Contrato'}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {fmtDate(contract.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <div className='flex items-center gap-3'>
            {canTake && <TakeLibranzaButton />}
            {canCancel && <CancelLibranza />}
            <ContractStatusBadge status={displayStatus(contract)} />

          </div>
          {link && (
            <div className="flex flex-wrap gap-2">
              <a
                href={`/dashboard/manage-contracts/${params.id}/audit`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
              >
                <History className="h-3.5 w-3.5" />
                Ver auditoria
              </a>

              {
                (user?.role === "CREDIT_ANALYST" || user?.role === "ADMIN") &&
                <a
                  href={`/dashboard/edit/${contract.id}`}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                >
                  <PencilLine className="h-3.5 w-3.5" />
                  Editar libranza
                </a>
              }

              <a
                href={`/dashboard/upload-documents/${contract.id}`}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
              >
                <Copy className="h-3.5 w-3.5" />
                Ver/subir documentos
              </a>

              {contract.status === "SIGNED" && (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/contracts/contract/${params.id}/download`}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Descargar PDF
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}