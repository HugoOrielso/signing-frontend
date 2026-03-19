import { TD, TH } from "@/lib/styles";

interface Producto {
  codigo?: string | null;
  descripcion?: string | null;
  valor?: string | null;
}

interface Props {
  productos: Producto[];
}

export function LibranzaProductsTable({ productos }: Props) {
  const total = productos.reduce((sum, p) => {
    const value = parseFloat((p.valor ?? "").replace(/[^0-9.]/g, "") || "0") || 0;
    return sum + value;
  }, 0);

  return (
    <>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 3,
          fontSize: 8,
        }}
      >
        <thead>
          <tr>
            <th style={{ ...TH, width: 70 }}>CODIGO</th>
            <th style={{ ...TH, width: 20 }}>C</th>
            <th style={TH}>DESCRIPCIÓN</th>
            <th style={{ ...TH, width: 90, textAlign: "right" }}>VALOR</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, i) => (
            <tr key={i}>
              <td style={TD}>{p.codigo ?? ""}</td>
              <td style={TD} />
              <td style={TD}>{p.descripcion ?? ""}</td>
              <td style={{ ...TD, textAlign: "right" }}>
                {p.valor
                  ? `$${parseFloat(p.valor.replace(/[^0-9.]/g, "")).toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                    })}`
                  : ""}
              </td>
            </tr>
          ))}

          {Array.from({ length: Math.max(0, 6 - productos.length) }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td style={TD}>&nbsp;</td>
              <td style={TD} />
              <td style={TD} />
              <td style={TD} />
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          textAlign: "center",
          fontSize: 13,
          fontWeight: 900,
          color: "#cc0000",
          letterSpacing: 4,
          margin: "2px 0",
          opacity: 0.1,
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        NO SON DEVOLUCIONES
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 5 }}>
        <table style={{ borderCollapse: "collapse", fontSize: 9 }}>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: 700,
                  padding: "2px 10px",
                  border: "1px solid #000",
                  background: "#1a1a2e",
                  color: "white",
                }}
              >
                TOTAL COMPRA
              </td>
              <td
                style={{
                  padding: "2px 18px",
                  border: "1px solid #000",
                  textAlign: "right",
                  fontWeight: 700,
                  minWidth: 90,
                }}
              >
                ${total.toLocaleString("es-CO", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}