"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import api from "@/lib/axiosClient";
import type { Contract, ContractStatus } from "@/types/libranza";
import { DataTable } from "./data-table";
import { getContractsColumns } from "./columns";
import StatsBar from "./details/StatsBar";
import { Input } from "@/components/ui/common/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/common/select";
import { Calendar } from "primereact/calendar";
import { toast } from "sonner";

type DateRange = Date[] | null;

type Operator = {
    id: string;
    name: string;
    email: string;
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
    { label: "OTP pendiente", value: "OTP_PENDING" },
    { label: "OTP verificado", value: "OTP_VERIFIED" },
    { label: "Firma parcial", value: "PARTIALLY_SIGNED" },
    { label: "Firmado", value: "SIGNED" },
    { label: "Rechazado", value: "REJECTED" },
    { label: "Expirado", value: "EXPIRED" },
    { label: "Cancelado", value: "CANCELLED" },
] as const;

type StatusFilter = "ALL" | ContractStatus;

export default function ContractsTableWithParams() {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingOperators, setLoadingOperators] = useState(true);

    const [filter, setFilter] = useState<StatusFilter>("ALL");
    const [search, setSearch] = useState("");
    const [asesor, setAsesor] = useState("");
    const [dateRange, setDateRange] = useState<DateRange>(null);

    const fetchOperators = useCallback(async () => {
        try {
            setLoadingOperators(true);

            const res = await api.get("/admin/operators");
            setOperators(res.data?.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("No se pudieron cargar los asesores");
        } finally {
            setLoadingOperators(false);
        }
    }, []);

    const fetchContracts = useCallback(async () => {
        try {
            if (!asesor || !dateRange?.[0] || !dateRange?.[1]) return;

            setLoading(true);

            const res = await api.get("/contracts/with-params", {
                params: {
                    asesor,
                    startDate: dateRange[0].toISOString(),
                    endDate: dateRange[1].toISOString(),
                    status: filter,
                    search: search.trim() || undefined,
                },
            });

            setContracts(res.data?.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener contratos");
        } finally {
            setLoading(false);
        }
    }, [asesor, dateRange, filter, search]);

    useEffect(() => {
        fetchOperators();
    }, [fetchOperators]);

    useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    const columns = useMemo(() => getContractsColumns(), []);

    return (
        <div className="space-y-5">
            <StatsBar contracts={contracts} />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">

                    <Select
                        value={filter}
                        onValueChange={(value) => setFilter(value as StatusFilter)}
                    >
                        <SelectTrigger className="h-11 p-6 rounded border-slate-200 bg-white shadow-sm">
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
                    <Input
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className=" p-6 rounded border-slate-200 max-w-100 bg-white shadow-sm"
                    />

                </div>
                <div className="flex items-center gap-3">

                    <Select
                        value={asesor}
                        onValueChange={setAsesor}
                        disabled={loadingOperators}
                    >
                        <SelectTrigger className="h-11 p-6 rounded border-slate-200 bg-white shadow-sm">
                            <SelectValue
                                placeholder={
                                    loadingOperators ? "Cargando asesores..." : "Selecciona un asesor"
                                }
                            />
                        </SelectTrigger>

                        <SelectContent>
                            {operators.map((operator) => (
                                <SelectItem key={operator.id} value={operator.name}>
                                    {operator.name}
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
                        placeholder="Rango de fechas"
                    />

                </div>
            </div>

            {!asesor || !dateRange?.[0] || !dateRange?.[1] ? (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 py-16 text-sm text-slate-500">
                    Selecciona asesor y rango de fechas para ver contratos
                </div>
            ) : loading ? (
                <div className="flex items-center justify-center rounded-[24px] border bg-white py-24">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                </div>
            ) : (
                <DataTable columns={columns} data={contracts} />
            )}

            {!loading && asesor && dateRange?.[0] && dateRange?.[1] && (
                <p className="text-right text-xs text-slate-500">
                    {contracts.length} contrato{contracts.length !== 1 ? "s" : ""}
                </p>
            )}
        </div>
    );
}