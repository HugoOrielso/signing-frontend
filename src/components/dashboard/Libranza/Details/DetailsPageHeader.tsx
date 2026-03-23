'use client';

import { displayStatus, fmtDate, publicUrl } from '@/lib/utils/libranzaHelper';
import { Contract } from '@/types/libranza';
import { BadgeCheck, CalendarDays, Copy, ExternalLink, FileText } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { ContractStatusBadge } from '@/components/dashboard/dataTable/statusBadge';

export function DetailsPageHeader({ contract }: { contract: Contract }) {
  const link = useMemo(() => publicUrl(contract.token), [contract.token]);

  return (
    <div className="bg-muted/30 px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div className="min-w-0">
          <h1 className="text-left text-2xl font-bold leading-tight">
            {contract.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {contract.contractNumber ?? 'Sin número'}
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
          <ContractStatusBadge status={displayStatus(contract)} />

          {link && (
            <div className="flex flex-wrap gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir enlace
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  toast.success('Enlace copiado');
                }}
                className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-semibold transition hover:bg-muted"
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar enlace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}