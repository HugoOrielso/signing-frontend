import { CheckBox as Chk } from "@/components/ui/Libranza/CheckBox";
import { FieldUnderline as U } from "@/components/ui/Libranza/FieldUnderline";
import { LibranzaDataPreview } from "@/types/libranza";

interface Props {
  data: LibranzaDataPreview;
}

export function LibranzaPaymentSection({ data: d }: Props) {
  return (
    <div className="space-y-1 text-[9.5px]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border border-neutral-400 p-1 rounded-sm text-ink">
        <span className="font-bold uppercase">Forma de pago:</span>

        {["NOMINA", "EFECTY 110520", "PSE", "BANCO"].map((op) => (
          <span key={op} className="inline-flex items-center gap-1">
            <Chk on={d.formaPago === op} />
            <span className="uppercase">{op}</span>
          </span>
        ))}
      </div>

      <div className="border border-neutral-400 rounded-sm p-1 leading-[1.45] text-ink">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-bold uppercase">Aceptada</span>
          <span>
            Fecha: <U  />
          </span>
          <span>
            N°: <U  />
          </span>
          <span>
            Por $: <U />
          </span>
        </div>

        <div className="mb-1.5">
          <span className="font-bold">Señor(es): </span>
          <U  />
          <span> El </span>
          <U  />
          <span> de </span>
          <U  />
          <span> del año </span>
          <U  />
        </div>

        <div className="mb-1.5">
          Se servirán(n) ud.(es) pagar solidariamente en <U /> por esta
          Única de Cambio sin protesto, excusado al aviso de rechazo a
        </div>

        <div className="mb-1.5">
          la orden de <U  />
        </div>

        <div className="mb-1.5">
          La cantidad de: <U  /> ($<U />)
        </div>

        <div className="mb-2">
          Pesos m/l en <U  /> Cuota(s) de $ <U /> más intereses
          durante el plazo de <U  /> meses y del mora a la tasa máxima
          legal autorizada.
        </div>

        <div className="grid grid-cols-4 gap-3 border-t border-border-soft pt-2 ">
          {[0, 1].map((i) => (
            <div key={i} className="text-ink">
              <div className="mb-1 h-5 border-b border-ink" />
              <div className="font-bold">Firma</div>
              <div>Cédula NIT.</div>
              <div>Ciudad NIT.</div>
            </div>
          ))}

          <div className="col-span-2 text-ink">
            <div className="mb-1 font-bold uppercase">Dirección aceptantes</div>
            <U  />
            <div className="mt-1.5">
              <span className="font-bold">TELÉFONO: </span>
              <U /> <span className="font-bold">Atentamente,</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}