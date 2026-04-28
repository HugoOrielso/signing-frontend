"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContractStatusBadge } from "../dataTable/statusBadge";

type ContractRow = {
id: string;
  contractNumber: string | null;
  templateKey: string | null;
  status: string;
  createdAt: string;

  cliente: {
    name: string | null;
    identification: string | null;
  };

  operador: {
    name: string;
    email: string;
  } | null;

  asesor: string | null;

  analista: {
    name: string;
    email: string;
  } | null;

  cuotas: {
    sumaTotal: number;
    numeroCuotas: number;
    valorCuota: number;
  };
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

export const columnsReport: ColumnDef<ContractRow>[] = [
  {
    accessorKey: "contractNumber",
    header: "Contrato",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-slate-900">
          {row.original.templateKey} #{row.original.contractNumber}
        </p>
        <p className="text-xs text-slate-500">
          {formatDate(row.original.createdAt)}
        </p>
      </div>
    ),
  },
  {
    id: "cliente",
    header: "Cliente",
    accessorFn: (row) =>
      `${row.cliente.name ?? ""} ${row.cliente.identification ?? ""}`,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-800">
          {row.original.cliente.name ?? "Sin cliente"}
        </p>
        <p className="text-xs text-slate-500">
          {row.original.cliente.identification ?? "Sin cédula"}
        </p>
      </div>
    ),
  },
  {
    id: "operador",
    header: "Operador",
    accessorFn: (row) =>
      `${row.operador?.name ?? ""} ${row.operador?.email ?? ""}`,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-800">
          {row.original.operador?.name ?? "—"}
        </p>
        <p className="text-xs text-slate-500">
          {row.original.operador?.email ?? ""}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "asesor",
    header: "Asesor",
    cell: ({ row }) => row.original.asesor ?? "—",
  },
  {
    id: "analista",
    header: "Analista",
    accessorFn: (row) =>
      `${row.analista?.name ?? ""} ${row.analista?.email ?? ""}`,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-800">
          {row.original.analista?.name ?? "—"}
        </p>
        <p className="text-xs text-slate-500">
          {row.original.analista?.email ?? ""}
        </p>
      </div>
    ),
  },
  {
    id: "cuotas",
    header: "Cuotas",
    cell: ({ row }) => (
      <span>
        {row.original.cuotas.numeroCuotas} x{" "}
        {formatMoney(row.original.cuotas.valorCuota)}
      </span>
    ),
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-bold text-slate-900">
        {formatMoney(row.original.cuotas.sumaTotal)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <ContractStatusBadge status={row.original.status} />,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "ALL") return true;
      return row.getValue(columnId) === filterValue;
    },
  },
];
