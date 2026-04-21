'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axiosClient';
import type { Contract, ContractStatus } from '@/types/libranza';
import { DataTable } from './data-table';
import { getContractsColumns } from './columns';

import StatsBar from './details/StatsBar';
import { Input } from '@/components/ui/common/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/common/select';


const STATUS_OPTIONS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Pendiente documentos', value: 'PENDING_DOCUMENTS' },
  { label: 'Documentos subidos', value: 'DOCUMENTS_UPLOADED' },
  { label: 'Pendiente verificación', value: 'PENDING_VERIFICATION' },
  { label: 'Listo para firma', value: 'READY_TO_SIGN' },
  { label: 'Enviado', value: 'SENT' },
  { label: 'Visto', value: 'VIEWED' },
  { label: 'OTP pendiente', value: 'OTP_PENDING' },
  { label: 'OTP verificado', value: 'OTP_VERIFIED' },
  { label: 'Firma parcial', value: 'PARTIALLY_SIGNED' },
  { label: 'Firmado', value: 'SIGNED' },
  { label: 'Rechazado', value: 'REJECTED' },
  { label: 'Expirado', value: 'EXPIRED' },
  { label: 'Cancelado', value: 'CANCELLED' },
] as const;

type StatusFilter = 'ALL' | ContractStatus;

export default function ContractsTable() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get('/contracts')
      .then((res) => {
        const data = res.data?.data ?? res.data?.contracts ?? [];
        setContracts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const statusOk = filter === 'ALL' ? true : c.status === filter;

      if (!statusOk) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const ld = c.libranzaData;
      const contracted = c.parties.find((p) => p.role === 'CONTRACTED');

      return [
        c.contractNumber,
        c.title,
        ld?.clienteNombre ?? contracted?.name,
        ld?.clienteCC ?? contracted?.identification,
        ld?.clienteTelefono ?? contracted?.phone,
        ld?.clienteEmail ?? contracted?.email,
        ld?.asesor,
        ld?.empresaTrabajo,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [contracts, filter, search]);

  const columns = useMemo(() => getContractsColumns(), []);

  return (
    <div className="space-y-5">
      <StatsBar contracts={contracts} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full">
          <Select
            value={filter}
            onValueChange={(value: string) => setFilter(value as StatusFilter)}
          >
            <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-100">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-200">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full ">
          <Input
            placeholder="Buscar por nombre, cédula, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-blue-100"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-[24px] border border-slate-200 bg-white py-24 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredContracts} />
      )}

      {!loading && (
        <p className="text-right text-xs font-medium text-slate-500">
          {filteredContracts.length} contrato
          {filteredContracts.length !== 1 ? "s" : ""}
          {filter !== "ALL" && " · filtrado"}
        </p>
      )}
    </div>
  );
}

