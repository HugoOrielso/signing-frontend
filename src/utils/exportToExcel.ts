import * as XLSX from "xlsx";

type ExportToExcelOptions<T> = {
    data: T[];
    fileName: string;
    sheetName?: string;
    mapRow: (item: T) => Record<string, string | number | boolean | null>;
    columnsWidth?: { wch: number }[];
};

export function exportToExcel<T>({
    data,
    fileName,
    sheetName = "Reporte",
    mapRow,
    columnsWidth,
}: ExportToExcelOptions<T>) {
    if (!data.length) {
        throw new Error("No hay datos para exportar");
    }

    const rows = data.map(mapRow);

    const worksheet = XLSX.utils.json_to_sheet(rows);

    if (columnsWidth) {
        worksheet["!cols"] = columnsWidth;
    }

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(
        workbook,
        fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`
    );
}