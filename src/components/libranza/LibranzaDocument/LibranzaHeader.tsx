import Image from "next/image";
import { LibranzaData } from "@/types/libranza";
import { INK } from "@/lib/constanst";
import { F } from "@/lib/formatters/formaters";

interface Props {
  data: LibranzaData;
}

export function LibranzaHeader({ data }: Props) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #000",
          paddingBottom: 5,
          marginBottom: 5,
        }}
      >
        <div
          style={{
            width: 45,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 22,
            color: INK,
            flexShrink: 0,
          }}
        >
          <Image src="/assets/logo.webp" alt="Logo" width={80} height={70} />
        </div>

        <div style={{ textAlign: "center", flex: 1, margin: "0 8px" }}>
          <div style={{ fontSize: 10, fontWeight: 700 }}>Nueva Dimensión Cultural</div>
          <div style={{ fontSize: 14, fontWeight: 900 }}>Dimcultura S.A.S</div>
          <div style={{ fontSize: 8, fontStyle: "italic" }}>
            &quot;Un mundo en el que debes estar&quot;
          </div>
          <div style={{ fontSize: 7, marginTop: 1 }}>
            Nit. 900.585.322-4 · Tel. 310 207 98 00 / 311 861 01 61
          </div>
        </div>

        <div style={{ fontSize: 8, border: "1px solid #000", padding: "4px 7px", minWidth: 155 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
            <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>CIUDAD:</span>
            <span style={{ borderBottom: "1px solid #000", flex: 1 }}>{F(data.ciudad)}</span>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
            <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>ASESOR:</span>
            <span style={{ borderBottom: "1px solid #000", flex: 1 }}>{F(data.asesor)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {["DD", "MM", "AA"].map((lbl, i) => (
              <span key={lbl} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 7 }}>{lbl}</span>
                <span
                  style={{
                    border: "1px solid #000",
                    minWidth: lbl === "AA" ? 26 : 16,
                    textAlign: "center",
                    padding: "0 1px",
                  }}
                >
                  {data.fecha?.split("/")?.[i] ?? ""}
                </span>
              </span>
            ))}
            <span style={{ fontWeight: 700, fontSize: 9, marginLeft: 3 }}>LIBRANZA</span>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 7,
          marginBottom: 5,
          borderBottom: "1px solid #ccc",
          paddingBottom: 3,
        }}
      >
        Sede Administrativa: Calle 24 No. 5-40 Conjunto los Ángeles Barrio Gran Colombia Casa G1
        Villa del Rosario Col. Lote 1 Barrio el Country Tel. 6512857 &nbsp;
        <strong>servicioalcliente@dimcultura.com · www.dimcultura.com</strong>
      </div>
    </>
  );
}