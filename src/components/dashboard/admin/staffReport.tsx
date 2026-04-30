"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axiosClient";
import { Calendar } from "primereact/calendar";
import { toast } from "sonner";
import { FileText, Loader2, TrendingUp, Wallet } from "lucide-react";
import { FinancialContractsDataTable } from "./dataTableReports";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

type DateRange = Date[] | null;

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

export function StaffFinancialSummary() {
    const [data, setData] = useState<FinancialSummaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange>(null);

    const incomeByDayChartData = useMemo(() => {
        if (!data?.contracts) return [];

        const grouped = data.contracts.reduce<Record<string, number>>(
            (acc, contract) => {
                const day = new Date(contract.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                });

                acc[day] = (acc[day] || 0) + contract.cuotas.sumaTotal;
                return acc;
            },
            {}
        );

        return Object.entries(grouped).map(([date, total]) => ({
            date,
            total,
            formatted: formatMoney(total),
        }));
    }, [data]);

    const fetchSummary = useCallback(async () => {
        try {
            setLoading(true);

            const params: Record<string, string> = {};

            if (dateRange?.[0] && dateRange?.[1]) {
                params.startDate = dateRange[0].toISOString();
                params.endDate = dateRange[1].toISOString();
            }

            const res = await api.get("/staff/financial-report", {
                params,
            });

            setData(res.data.data);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo obtener tu reporte financiero");
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
                        Mi reporte financiero
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
                        placeholder="Seleccionar rango de fechas"
                    />

                    <button
                        type="button"
                        onClick={fetchSummary}
                        disabled={loading}
                        className="inline-flex h-12 cursor-pointer items-center justify-center rounded bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Consultar"
                        )}
                    </button>
                </div>
            </div>

            {loading && !data ? (
                <div className="flex items-center justify-center rounded-[24px] border border-slate-200 bg-white py-24 shadow-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SummaryCard
                        icon={<Wallet className="h-5 w-5" />}
                        label="Total generado"
                        value={formatMoney(data.summary.totalSumaTotal)}
                    />

                    <SummaryCard
                        icon={<FileText className="h-5 w-5" />}
                        label="Contratos realizados"
                        value={String(data.summary.totalContracts)}
                    />

                    <SummaryCard
                        icon={<TrendingUp className="h-5 w-5" />}
                        label="Promedio por contrato"
                        value={formatMoney(data.summary.averagePerContract)}
                    />
                </div>
            ) : null}

            {data ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-900">
                            Ingresos por día
                        </h3>
                        <p className="text-sm text-slate-500">
                            Total acumulado según la fecha de creación de tus contratos
                        </p>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={incomeByDayChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                <XAxis dataKey="date" />

                                <YAxis
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat("es-CO", {
                                            notation: "compact",
                                            maximumFractionDigits: 1,
                                        }).format(Number(value))
                                    }
                                />

                                <Tooltip
                                    formatter={(_, __, item) => {
                                        const payload = item.payload as {
                                            formatted: string;
                                        };

                                        return [payload.formatted, "Ingresos"];
                                    }}
                                />

                                <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : null}

            {data?.contracts && (
                <FinancialContractsDataTable data={data.contracts} />
            )}
        </div>
    );
}

function SummaryCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                {icon}
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}