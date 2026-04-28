/* eslint-disable react-hooks/incompatible-library */
"use client";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/common/input";
import { Button } from "@/components/ui/common/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/common/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/Table";
import { columnsReport } from "./columsReport";

const STATUS_OPTIONS = [
    { label: "Todos", value: "ALL" },
    { label: "Borrador", value: "DRAFT" },
    { label: "Faltan documentos", value: "PENDING_DOCUMENTS" },
    { label: "Documentos completos", value: "DOCUMENTS_UPLOADED" },
    { label: "En validación", value: "PENDING_VERIFICATION" },
    { label: "Listo para firma", value: "READY_TO_SIGN" },
    { label: "Enviado", value: "SENT" },
    { label: "Visto", value: "VIEWED" },
    { label: "OTP pendiente", value: "OTP_PENDING" },
    { label: "OTP validado", value: "OTP_VERIFIED" },
    { label: "Firma parcial", value: "PARTIALLY_SIGNED" },
    { label: "Firmado", value: "SIGNED" },
    { label: "Rechazado", value: "REJECTED" },
    { label: "Expirado", value: "EXPIRED" },
    { label: "Cancelado", value: "CANCELLED" },
];

export function FinancialContractsDataTable({
    data,
}: {
    data: FinancialContractRow[];
}) {
    const table = useReactTable({
        data,
        columns: columnsReport,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const clienteFilter =
        (table.getColumn("cliente")?.getFilterValue() as string) ?? "";

    const operadorFilter =
        (table.getColumn("operador")?.getFilterValue() as string) ?? "";

    const statusFilter =
        (table.getColumn("status")?.getFilterValue() as string) ?? "ALL";

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                        table
                            .getColumn("status")
                            ?.setFilterValue(value === "ALL" ? undefined : value)
                    }
                >
                    <SelectTrigger className="h-11 rounded-2xl p-5.5 border-slate-200 bg-white shadow-sm">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>

                    <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Filtrar por cliente..."
                    value={clienteFilter}
                    onChange={(event) =>
                        table.getColumn("cliente")?.setFilterValue(event.target.value)
                    }
                    className="h-11 max-w-100 rounded-2xl border-slate-200 bg-white shadow-sm"
                />

                <Input
                    placeholder="Filtrar por operador..."
                    value={operadorFilter}
                    onChange={(event) =>
                        table.getColumn("operador")?.setFilterValue(event.target.value)
                    }
                    className="h-11 max-w-100 rounded-2xl border-slate-200 bg-white shadow-sm"
                />


            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-slate-50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-5 py-3 text-xs font-bold uppercase text-slate-500"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-slate-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-5 py-4">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsReport.length}
                                    className="h-24 text-center text-sm text-slate-500"
                                >
                                    No hay libranzas para mostrar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-slate-500">
                    Mostrando {table.getRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} resultado(s)
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>

                    <span className="text-sm font-medium text-slate-600">
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount() || 1}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}