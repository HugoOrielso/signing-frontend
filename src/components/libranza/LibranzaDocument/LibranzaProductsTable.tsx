interface Producto {
  codigo?: string | null;
  descripcion?: string | null;
  valor?: string | null;
}

interface Props {
  productos: Producto[];
}

function formatCurrency(value?: string | null) {
  if (!value) return "";

  const parsed = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;

  return `$${parsed.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function LibranzaProductsTable({ productos }: Props) {
  const total = productos.reduce((sum, p) => {
    const value = parseFloat((p.valor ?? "").replace(/[^0-9.]/g, "") || "0") || 0;
    return sum + value;
  }, 0);

  const rows =
    productos.length > 0 ? [...productos, {}] : [{}];

  return (
    <div className="my-1 space-y-1">
      <div className="relative overflow-hidden rounded-sm border-2 border-ink bg-transparent">
        <table className="w-full table-fixed border-collapse text-[8px] text-ink">
          <thead>
            <tr className="bg-ink text-white">
              <th className="w-19.5 border-r border-white/70 px-3 py-1.5 text-left font-bold uppercase tracking-[0.04em]">
                Código
              </th>
              <th className="w-9.5 border-r border-white/70 px-2 py-1.5 text-center font-bold uppercase tracking-[0.04em]">
                C
              </th>
              <th className="border-r border-white/70 px-3 py-1.5 text-center font-bold uppercase tracking-[0.04em]">
                Descripción
              </th>
              <th className="w-37.5 px-3 py-1.5 text-center font-bold uppercase tracking-[0.04em]">
                Valor
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p, i) => (
              <tr key={i} className="h-5.25">
                <td className="border-t border-r border-ink px-2 py-0.5 align-middle">
                  {p.codigo ?? ""}
                </td>
                <td className="border-t border-r border-ink px-2 py-0.5 text-center align-middle" />
                <td className="border-t border-r border-ink px-2 py-0.5 align-middle">
                  {p.descripcion ?? ""}
                </td>
                <td className="border-t border-ink px-2 py-0.5 text-right align-middle font-medium">
                  {formatCurrency(p.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="select-none text-center text-[18px] font-extrabold uppercase tracking-[0.05em] text-ink/10">
            No se aceptan devoluciones
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.02em] text-ink">
            Total compra
          </span>
          <div className="min-w-40 rounded-[12px] border-2 border-ink bg-white px-4 py-1 text-right text-[10px] font-bold text-ink">
            ${total.toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}