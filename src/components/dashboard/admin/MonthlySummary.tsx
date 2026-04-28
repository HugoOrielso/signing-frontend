"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axiosClient";
import { Calendar } from "primereact/calendar";
import { toast } from "sonner";
import { CreditCard, FileText, Loader2, Users, Wallet } from "lucide-react";

type DateRange = Date[] | null;

type SummaryResponse = {
  range: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalContracts: number;
    totalAmount: number;
    totalSumaTotal: number;
    totalCuotas: number;
    totalValorCuotas: number;
  };
  byAsesor: {
    asesor: string;
    totalContracts: number;
    totalAmount: number;
    totalSumaTotal: number;
    totalCuotas: number;
    totalValorCuotas: number;
  }[];
  byAnalyst: {
    analystId: string | null;
    analystName: string;
    analystEmail: string | null;
    totalContracts: number;
    totalAmount: number;
    totalSumaTotal: number;
  }[];
  contracts: {
    id: string;
    contractNumber: string | null;
    title: string;
    status: string;
    amount: number;
    createdAt: string;
    asesor: string | null;
    cliente: {
      name: string | null;
      identification: string | null;
      empresaTrabajo: string | null;
    };
    cuotas: {
      sumaTotal: number;
      numeroCuotas: number;
      valorCuota: number;
    };
    analyst: {
      id: string;
      name: string;
      email: string;
      role: string;
      assignedAt: string | null;
    } | null;
  }[];
};

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));
};

export default function AdminMonthlySummary() {
  const [data, setData] = useState<SummaryResponse | null>(null);
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

      const res = await api.get("/admin/earnings", {
        params,
      });

      setData(res.data.data);
    } catch {
      toast.error("No se pudo obtener el resumen");
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Resumen administrativo
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
            placeholder="Seleccionar rango"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 shadow-sm md:w-70"
          />

          <button
            type="button"
            onClick={fetchSummary}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <SummaryCard
              icon={<Wallet className="h-5 w-5" />}
              label="Total colocado"
              value={formatMoney(data.summary.totalSumaTotal)}
            />

            <SummaryCard
              icon={<FileText className="h-5 w-5" />}
              label="Contratos"
              value={String(data.summary.totalContracts)}
            />

            <SummaryCard
              icon={<CreditCard className="h-5 w-5" />}
              label="Total cuotas"
              value={String(data.summary.totalCuotas)}
            />

            <SummaryCard
              icon={<Users className="h-5 w-5" />}
              label="Valor cuotas"
              value={formatMoney(data.summary.totalValorCuotas)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SummaryList
              title="Resumen por asesor"
              items={data.byAsesor.map((item) => ({
                name: item.asesor,
                subtitle: `${item.totalContracts} contrato(s) · ${item.totalCuotas} cuota(s)`,
                value: formatMoney(item.totalSumaTotal),
              }))}
            />

            <SummaryList
              title="Resumen por analista"
              items={data.byAnalyst.map((item) => ({
                name: item.analystName,
                subtitle: `${item.totalContracts} contrato(s)`,
                value: formatMoney(item.totalSumaTotal),
              }))}
            />
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-base font-bold text-slate-900">
                Contratos del rango
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Contrato</th>
                    <th className="px-5 py-3">Cliente</th>
                    <th className="px-5 py-3">Asesor</th>
                    <th className="px-5 py-3">Analista</th>
                    <th className="px-5 py-3">Creado</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3 text-right">Cuotas</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {contract.contractNumber ?? "Sin número"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {contract.status}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {contract.cliente.name ?? "Sin cliente"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {contract.cliente.identification ?? "Sin cédula"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {contract.asesor ?? "Sin asesor"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {contract.analyst?.name ?? "Sin analista"}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {formatDate(contract.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right font-semibold text-slate-900">
                        {formatMoney(contract.cuotas.sumaTotal)}
                      </td>

                      <td className="px-5 py-4 text-right text-slate-700">
                        {contract.cuotas.numeroCuotas} x{" "}
                        {formatMoney(contract.cuotas.valorCuota)}
                      </td>
                    </tr>
                  ))}

                  {data.contracts.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No hay contratos en este rango.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
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

function SummaryList({
  title,
  items,
}: {
  title: string;
  items: {
    name: string;
    subtitle: string;
    value: string;
  }[];
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-slate-900">{title}</h3>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </div>

              <p className="font-bold text-slate-900">{item.value}</p>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">
            Sin datos para mostrar.
          </p>
        )}
      </div>
    </div>
  );
}