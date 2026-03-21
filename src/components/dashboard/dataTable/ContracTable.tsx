'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axiosClient';
import type { Contract } from '@/types/libranza';
import { DataTable } from './data-table';
import { getContractsColumns } from './columns';

import { displayStatus } from '@/lib/utils/libranzaHelper';

import StatsBar from './details/StatsBar';
import { Button } from '@/components/ui/common/button';
import { Input } from '@/components/ui/common/input';
import { ContractDetailDialog } from './libranzaDetailDialog';

const STATUS_TABS = [
    { label: 'Todos', value: 'ALL' },
    { label: 'Enviados', value: 'SENT_VIEWED' },
    { label: 'Pend. firma', value: 'PENDING_SIGN' },
    { label: 'Firmados', value: 'SIGNED' },
    { label: 'Expirados', value: 'EXPIRED' },
] as const;

export default function ContractsTable() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [selected, setSelected] = useState<Contract | null>(null);
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
            const statusOk =
                filter === 'ALL'
                    ? true
                    : filter === 'SENT_VIEWED'
                        ? ['SENT', 'VIEWED'].includes(c.status)
                        : displayStatus(c) === filter;

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

    const columns = useMemo(
        () =>
            getContractsColumns({
                onOpen: (contract) => setSelected(contract),
            }),
        []
    );

    return (
        <div className="space-y-5">
            <div >
                <StatsBar contracts={contracts} />

                <div className="flex flex-col gap-3 py-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {STATUS_TABS.map((tab) => (
                            <Button
                                key={tab.value}
                                variant={filter === tab.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(tab.value)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>

                    <div className="w-full md:w-105">
                        <Input
                            placeholder="Buscar por nombre, cédula, teléfono..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center rounded-xl border py-24">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-muted border-t-primary" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredContracts}
                    />
                )}
            </div>

            {!loading && (
                <p className="text-right text-xs text-muted-foreground">
                    {filteredContracts.length} contrato{filteredContracts.length !== 1 ? 's' : ''}
                    {filter !== 'ALL' && ' · filtrado'}
                </p>
            )}

            <ContractDetailDialog
                contract={selected}
                open={!!selected}
                onOpenChange={(open) => !open && setSelected(null)}
            />
        </div>
    );
}