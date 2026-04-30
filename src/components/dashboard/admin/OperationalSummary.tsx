"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axiosClient";
import { Calendar } from "primereact/calendar";
import { toast } from "sonner";
import { FileText, Loader2, Search, TrendingUp, Wallet, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/common/select";
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

type UserOption = {
    id: string;
    name: string;
    email?: string;
    role?: string;
};

type FinancialReportResponse = {
    range: {
        startDate: string;
        endDate: string;
    };
    summary: {
        totalContracts: number;
        totalSumaTotal: number;
        averagePerContract: number;
        signedContracts: number;
        activeContracts: number;
        rejectedContracts: number;
        cancelledContracts: number;
        statusSummary: Record<string, number>;
    };
    statuses: {
        status: string;
        count: number;
    }[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: any[];
};

const STATUS_OPTIONS = [
    { label: "Todos", value: "ALL" },
    { label: "Borrador", value: "DRAFT" },
    { label: "Pendiente documentos", value: "PENDING_DOCUMENTS" },
    { label: "Documentos subidos", value: "DOCUMENTS_UPLOADED" },
    { label: "Pendiente verificación", value: "PENDING_VERIFICATION" },
    { label: "Listo para firma", value: "READY_TO_SIGN" },
    { label: "Enviado", value: "SENT" },
    { label: "Visto", value: "VIEWED" },
    { label: "Firma parcial", value: "PARTIALLY_SIGNED" },
    { label: "Firmado", value: "SIGNED" },
    { label: "Rechazado", value: "REJECTED" },
    { label: "Cancelado", value: "CANCELLED" },
    { label: "Expirado", value: "EXPIRED" },
];

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

export function AdminFilteredOperationalReport() {
    const [data, setData] = useState<FinancialReportResponse | null>(null);

    const [operators, setOperators] = useState<UserOption[]>([]);
    const [analysts, setAnalysts] = useState<UserOption[]>([]);

    const [dateRange, setDateRange] = useState<DateRange>(null);
    const [operatorId, setOperatorId] = useState("ALL");
    const [analystId, setAnalystId] = useState("ALL");
    const [status, setStatus] = useState("ALL");

    const [loading, setLoading] = useState(false);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchFilters = useCallback(async () => {
        try {
            setLoadingFilters(true);

            const [operatorsRes, analystsRes] = await Promise.all([
                api.get("/admin/operators"),
                api.get("/admin/analysts"),
            ]);

            setOperators(operatorsRes.data?.data ?? []);
            setAnalysts(analystsRes.data?.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron cargar los filtros");
        } finally {
            setLoadingFilters(false);
        }
    }, []);

    const fetchReport = useCallback(async () => {
        const hasStartDate = Boolean(dateRange?.[0]);
        const hasEndDate = Boolean(dateRange?.[1]);
        const hasOperator = operatorId !== "ALL";
        const hasAnalyst = analystId !== "ALL";

        if (!hasStartDate || !hasEndDate) {
            toast.error("Selecciona un rango de fechas");
            return;
        }

        if (!hasOperator && !hasAnalyst) {
            toast.error("Selecciona un operador o un analista");
            return;
        }

        try {
            setLoading(true);

            const params: Record<string, string> = {
                startDate: dateRange![0].toISOString(),
                endDate: dateRange![1].toISOString(),
            };

            if (hasOperator) {
                const selectedOperator = operators.find((op) => op.id === operatorId);

                if (selectedOperator?.name) {
                    params.operatorName = selectedOperator.name;
                }
            }

            if (hasAnalyst) {
                params.assignedToId = analystId;
            }

            if (status !== "ALL") {
                params.status = status;
            }

            const res = await api.get("/admin/operational-summary", {
                params,
            });

            setData(res.data.data);
            setHasSearched(true);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo obtener el reporte");
        } finally {
            setLoading(false);
        }
    }, [dateRange, operatorId, analystId, status, operators]);

    const handleClearFilters = () => {
        setDateRange(null);
        setOperatorId("ALL");
        setAnalystId("ALL");
        setStatus("ALL");
        setData(null);
        setHasSearched(false);
    };

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    const chartData = useMemo(() => {
        if (!data?.contracts) return [];

        const grouped = data.contracts.reduce<Record<string, number>>(
            (acc, contract) => {
                const day = new Date(contract.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                });

                acc[day] = (acc[day] || 0) + (contract.cuotas?.sumaTotal ?? 0);
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

    const rangeLabel = data
        ? `${formatDate(data.range.startDate)} - ${formatDate(data.range.endDate)}`
        : "Selecciona filtros para consultar";

    const isOperatorSelected = operatorId !== "ALL";
    const isAnalystSelected = analystId !== "ALL";

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col gap-4  xl:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Reporte operativo
                    </h2>
                    <p className="text-sm text-slate-500">{rangeLabel}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={operatorId}
                        onValueChange={(value) => {
                            setOperatorId(value);

                            if (value !== "ALL") {
                                setAnalystId("ALL");
                            }
                        }}
                        disabled={loadingFilters || isAnalystSelected}
                    >
                        <SelectTrigger className="h-12 p-6 min-w-52.5 rounded bg-white">
                            <SelectValue placeholder="Operador" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">Todos los operadores</SelectItem>

                            {operators.map((operator) => (
                                <SelectItem key={operator.id} value={operator.id}>
                                    {operator.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={analystId}
                        onValueChange={(value) => {
                            setAnalystId(value);

                            if (value !== "ALL") {
                                setOperatorId("ALL");
                            }
                        }}
                        disabled={loadingFilters || isOperatorSelected}
                    >
                        <SelectTrigger className="h-12 p-6 min-w-52.5 rounded bg-white">
                            <SelectValue placeholder="Analista" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="ALL">Todos los analistas</SelectItem>

                            {analysts.map((analyst) => (
                                <SelectItem key={analyst.id} value={analyst.id}>
                                    {analyst.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="h-12 p-6 min-w-52.5 rounded bg-white">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>

                        <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Calendar
                        value={dateRange}
                        onChange={(e) => setDateRange(e.value as DateRange)}
                        selectionMode="range"
                        readOnlyInput
                        hideOnRangeSelection
                        showIcon
                        placeholder="Rango de fechas"
                    />

                    <button
                        type="button"
                        onClick={fetchReport}
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Search className="h-4 w-4" />
                                Consultar
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleClearFilters}
                        disabled={loading}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                    >
                        <X className="h-4 w-4" />
                        Limpiar
                    </button>
                </div>
            </div>

            {!data && !hasSearched && (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                    <p className="text-sm font-medium text-slate-700">
                        Selecciona un rango de fechas y un operador o analista para consultar
                        el reporte.
                    </p>
                </div>
            )}

            {data && (
                <>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <SummaryCard
                            icon={<Wallet className="h-5 w-5" />}
                            label="Total generado"
                            value={formatMoney(data.summary.totalSumaTotal)}
                        />

                        <SummaryCard
                            icon={<FileText className="h-5 w-5" />}
                            label="Contratos"
                            value={String(data.summary.totalContracts)}
                        />

                        <SummaryCard
                            icon={<TrendingUp className="h-5 w-5" />}
                            label="Promedio por contrato"
                            value={formatMoney(data.summary.averagePerContract)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <SmallStatusCard label="Firmados" value={data.summary.signedContracts} />
                        <SmallStatusCard label="Activos" value={data.summary.activeContracts} />
                        <SmallStatusCard label="Rechazados" value={data.summary.rejectedContracts} />
                        <SmallStatusCard label="Cancelados" value={data.summary.cancelledContracts} />
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5">
                            <h3 className="text-lg font-bold text-slate-900">
                                Ingresos por día
                            </h3>
                            <p className="text-sm text-slate-500">
                                Total acumulado según la fecha de creación de contratos
                            </p>
                        </div>

                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>

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
                                            const payload = item.payload as { formatted: string };
                                            return [payload.formatted, "Ingresos"];
                                        }}
                                    />

                                    <Bar
                                        dataKey="total"
                                        radius={[10, 10, 0, 0]}
                                        fill="url(#barGradient)"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <FinancialContractsDataTable data={data.contracts} />
                </>
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

function SmallStatusCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
        </div>
    );
}