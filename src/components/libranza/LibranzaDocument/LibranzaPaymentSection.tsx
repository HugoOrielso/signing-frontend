import { LibranzaData } from "@/types/libranza";
import { CheckBox as Chk } from "@/components/ui/Libranza/CheckBox";
import { FieldUnderline as U } from "@/components/ui/Libranza/FieldUnderline";

interface Props {
  data: LibranzaData;
}

export function LibranzaPaymentSection({ data: d }: Props) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 8,
          border: "1px solid #000",
          padding: "4px 8px",
          marginBottom: 5,
        }}
      >
        <strong>FORMA DE PAGO:</strong>
        {["NOMINA", "EFECTY 110520", "PSE", "BANCO"].map((op) => (
          <span key={op} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Chk on={d.formaPago === op} />
            {op}
          </span>
        ))}
      </div>

      <div style={{ border: "1px solid #000", padding: "5px 7px", fontSize: 8 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <strong>ACEPTADA</strong>
          <span>
            Fecha: <U w={80} />
          </span>
          <span>
            N°: <U w={60} />
          </span>
          <span>
            Por $: <U w={70} />
          </span>
        </div>

        <div style={{ marginBottom: 3 }}>
          <strong>Señor(es): </strong>
          <U w={150} />
          <span> El </span>
          <U w={50} />
          <span> de </span>
          <U w={80} />
          <span> del año </span>
          <U w={50} />
        </div>

        <div style={{ marginBottom: 3 }}>
          Se servirán(n) ud.(es) pagar solidariamente en <U w={140} />
          {" "}por esta Única de Cambio sin protesto, excusado al aviso de rechazo a
        </div>

        <div style={{ marginBottom: 3 }}>
          la orden de <U w={200} />
        </div>

        <div style={{ marginBottom: 3 }}>
          La cantidad de: <U w={140} /> ($<U w={80} />)
        </div>

        <div style={{ marginBottom: 3 }}>
          Pesos m/l en <U w={50} /> Cuota(s) de $ <U w={70} />
          {" "}más intereses durante el plazo de <U w={60} /> meses y del mora a la tasa máxima legal autorizada.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 6,
            marginTop: 8,
            paddingTop: 4,
            borderTop: "1px solid #ccc",
            fontSize: 7.5,
          }}
        >
          {[0, 1].map((i) => (
            <div key={i}>
              <div style={{ borderBottom: "1px solid #000", height: 22, marginBottom: 3 }} />
              <div>
                <strong>Firma</strong>
              </div>
              <div>Cédula NIT.</div>
              <div>Ciudad NIT.</div>
            </div>
          ))}

          <div style={{ gridColumn: "span 2" }}>
            <div style={{ marginBottom: 2 }}>
              <strong>DIRECCIÓN ACEPTANTES</strong>
            </div>
            <U w={200} />
            <div style={{ marginTop: 3 }}>
              <strong>TELÉFONO: </strong>
              <U w={80} /> <strong>Atentamente,</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}