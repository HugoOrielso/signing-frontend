"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axiosClient";
import { Calendar } from "primereact/calendar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type DateRange = Date[] | null;

type OperationalGroup = {
    asesor?: string;
    analystId?: string | null;
    analystName?: string;
    analystEmail?: string | null;
    totalContracts: number;
    totalSumaTotal: number;
    totalCuotas: number;
    totalValorCuotas?: number;
    signedContracts: number;
    activeContracts: number;
    rejectedContracts: number;
    contracts: {
        id: string;
        contractNumber: string | null;
        status: string;
        createdAt: string;
        asesor?: string | null;
        analyst?: string | null;
        clienteNombre: string | null;
        clienteCC: string | null;
        sumaTotal: number;
        numeroCuotas: number;
        valorCuota: number;
        assignedAt?: string | null;
    }[];
};

type OperationalSummaryResponse = {
    range: {
        startDate: string;
        endDate: string;
    };
    byAsesor: OperationalGroup[];
    byAnalyst: OperationalGroup[];
};

const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value || 0);

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("es-CO", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    }).format(new Date(value));

export function AdminOperationalSummary() {
    const [data, setData] = useState<OperationalSummaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>(null);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);

            const params: Record<string, string> = {};

            if (dateRange?.[0] && dateRange?.[1]) {
                params.startDate = dateRange[0].toISOString();
                params.endDate = dateRange[1].toISOString();
            }

            const res = await api.get("/admin/contracts/operational-summary", {
                params,
            });

            setData(res.data.data);
        } catch {
            toast.error("No se pudo obtener el resumen operativo");
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const rangeLabel = useMemo(() => {
        if (!data) return "Últimos 30 días";

        return `${formatDate(data.range.startDate)} - ${formatDate(
            data.range.endDate
        )}`;
    }, [data]);

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rendimiento operativo
                    </h2>
                    <p className="text-sm text-slate-500">{rangeLabel}</p>
                </div>

                <div className="flex items-center gap-3">
                    <Calendar
                        value={dateRange}
                        onChange={(e) => setDateRange(e.value as DateRange)}
                        selectionMode="range"
                        readOnlyInput
                        hideOnRangeSelection
                        showIcon
                        placeholder="Seleccionar rango"
                    />

                    <button
                        type="button"
                        onClick={fetchSummary}
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center rounded bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Consultar"}
                    </button>
                </div>
            </div>

            {loading && !data ? (
                <div className="flex items-center justify-center rounded-[24px] border border-slate-200 bg-white py-24 shadow-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <OperationalGroupList
                        title="Por asesor"
                        type="asesor"
                        groups={data.byAsesor}
                    />

                    <OperationalGroupList
                        title="Por analista"
                        type="analyst"
                        groups={data.byAnalyst}
                    />
                </div>
            ) : null}
        </div>
    );
}

function OperationalGroupList({
    title,
    type,
    groups,
}: {
    title: string;
    type: "asesor" | "analyst";
    groups: OperationalGroup[];
}) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-slate-900">{title}</h3>

            <div className="space-y-4">
                {groups.length > 0 ? (
                    groups.map((group) => {
                        const name =
                            type === "asesor"
                                ? group.asesor ?? "Sin asesor"
                                : group.analystName ?? "Sin analista";

                        return (
                            <div
                                key={name}
                                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-slate-900">{name}</p>
                                        <p className="text-xs text-slate-500">
                                            {group.totalContracts} contrato(s) ·{" "}
                                            {group.activeContracts} activo(s) ·{" "}
                                            {group.signedContracts} firmado(s)
                                        </p>
                                    </div>

                                    <p className="text-right font-bold text-slate-900">
                                        {formatMoney(group.totalSumaTotal)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <MiniStat label="Cuotas" value={String(group.totalCuotas)} />
                                    <MiniStat label="Rechazados" value={String(group.rejectedContracts)} />
                                    <MiniStat
                                        label="Promedio"
                                        value={formatMoney(
                                            group.totalContracts > 0
                                                ? Math.round(group.totalSumaTotal / group.totalContracts)
                                                : 0
                                        )}
                                    />
                                </div>

                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm font-semibold text-blue-600">
                                        Ver contratos
                                    </summary>

                                    <div className="mt-3 overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="text-slate-500">
                                                <tr>
                                                    <th className="py-2 pr-3">Contrato</th>
                                                    <th className="py-2 pr-3">Cliente</th>
                                                    <th className="py-2 pr-3">Estado</th>
                                                    <th className="py-2 pr-3">Fecha</th>
                                                    <th className="py-2 text-right">Total</th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-slate-200">
                                                {group.contracts.map((contract) => (
                                                    <tr key={contract.id}>
                                                        <td className="py-2 pr-3 font-medium">
                                                            {contract.contractNumber ?? "Sin número"}
                                                        </td>
                                                        <td className="py-2 pr-3">
                                                            {contract.clienteNombre ?? "Sin cliente"}
                                                        </td>
                                                        <td className="py-2 pr-3">{contract.status}</td>
                                                        <td className="py-2 pr-3">
                                                            {formatDate(contract.createdAt)}
                                                        </td>
                                                        <td className="py-2 text-right font-semibold">
                                                            {formatMoney(contract.sumaTotal)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            </div>
                        );
                    })
                ) : (
                    <p className="py-10 text-center text-sm text-slate-500">
                        Sin datos para mostrar.
                    </p>
                )}
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-white p-3">
            <p className="text-[11px] font-medium text-slate-500">{label}</p>
            <p className="mt-1 font-bold text-slate-900">{value}</p>
        </div>
    );
}