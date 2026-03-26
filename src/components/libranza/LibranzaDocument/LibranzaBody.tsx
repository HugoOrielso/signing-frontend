"use client";

import { FieldUnderline as U } from "@/components/ui/Libranza/FieldUnderline";
import { FieldBox as Box } from "@/components/ui/Libranza/FieldBox";
import { CheckBox as Chk } from "@/components/ui/Libranza/CheckBox";
import { F, FM } from "@/lib/formatters/formaters";
import { LibranzaDataPreview } from "@/types/libranza";

type Empresa = "dimcultura" | "gruculcol";

const empresaNombre: Record<Empresa, string> = {
  dimcultura: "DIMCULTURA S.A.S.",
  gruculcol: "GRUCULCOL",
};

function resolveEmpresa(value?: string | null): Empresa {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "gruculcol" ? "gruculcol" : "dimcultura";
}

interface Props {
  data: LibranzaDataPreview;
  templateKey:string
}

export function LibranzaBody({ data: d, templateKey }: Props) {
  const empresa = resolveEmpresa(templateKey);
  const nombre = empresaNombre[empresa]

  return (
    <div className="space-y-1 text-black">
      <div className="text-[9px] leading-[1.75] text-neutral-900 text-balance">
        Yo <U>{F(d.clienteNombre)}</U>{" "}
        con C.C. <U>{F(d.clienteCC)}</U>{" "}
        de <U>{F(d.clienteCCDe)}</U>,
        residente en <U>{F(d.clienteDireccion)}</U>{" "}
        con número de contacto <U>{F(d.clienteTelefono)}</U> y correo
        de notificación <U>{F(d.clienteEmail)}</U>{" "}
        Funcionario de <U>{F(d.clienteFuncionario)}</U>{" "}
        Desde hace <U>{F(d.clienteDesdeHace)}</U>
        Actualmente trabajo en el municipio de <U>{F(d.municipioTrabajo)}</U>,
        me permito autorizar por medio de este, al Señor pagador de
        <U>{F(d.empresaTrabajo)}</U>,
        departamento <U>{F(d.departamento)}</U>,
        para que descuente de mi sueldo o de cualquier otro concepto la
        suma de <Box>{FM(d.sumaTotal)}</Box>{" "}
        en <Box>{F(d.numeroCuotas)}</Box>{" "}
        cuotas mensuales consecutivas por valor de <Box w={90}>{FM(d.valorCuota)}</Box>,
        cada una, a partir del mes de <Box>{F(d.mesCobro)}</Box>{" "}
        y pagarlos a la orden de <span className="font-bold">{nombre}</span>{" "}
        <br />
        <span className="text-[9px]">
          <b>Nota:</b> en caso de que el cupo de mi nómina no sea suficiente para cubrir la obligación
          mensual, autorizo a la empresa para que debite los valores pactados en este documento,
          de mi cuenta.
        </span>
        <br />
        <span className="font-bold">Ahorros</span>{" "}
        <Chk on={d.tipoCuenta === "Ahorros"} />{" "}
        <span className="font-bold">Corriente</span>{" "}
        <Chk on={d.tipoCuenta === "Corriente"} />{" "}
        No. <U w={100}>{F(d.numeroCuenta)}</U>{" "}
        del banco <U w={100}>{F(d.banco)}.</U>{" "}
        <br />
        <span>
          Declaro formalmente no tener nada que reclamar a{" "}
          <span className="font-bold">{nombre}</span> judicial o
          extrajudicialmente, por los cargos que a través de la presente autorización,
          se realicen de mi cuenta.
        </span>
      </div>

      {/* Referencias — sin cambios */}
      <div className="border border-neutral-400 rounded-sm p-1 text-[8px]">
        <div className="font-bold mb-1">Referencias laborales y/o personales:</div>
        {d.references.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {d.references.map((r) => (
              <div key={r.email}>
                {r.type === "PERSONAL" && (
                  <div className="space-y-1 text-neutral-900">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold whitespace-nowrap">Nombre:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold whitespace-nowrap">Parentesco:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.relationShip}</span>
                      <span className="font-semibold whitespace-nowrap">Teléfono:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold whitespace-nowrap">Correo:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.email}</span>
                    </div>
                  </div>
                )}
                {r.type === "LABORAL" && (
                  <div className="space-y-1 text-neutral-900">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold whitespace-nowrap">Nombre:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold whitespace-nowrap">Empresa:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.company}</span>
                      <span className="font-semibold whitespace-nowrap">Teléfono:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold whitespace-nowrap">Correo:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.email}</span>
                      <span className="font-semibold whitespace-nowrap">Cargo:</span>
                      <span className="flex-1 border-b border-black h-2.5">{r.position}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Autorización — nombre dinámico en todos los lugares */}
      <div className="rounded-sm border border-neutral-400 p-1 text-balance">
        <span className="font-bold text-black">
          AUTORIZACIÓN PARA CONSULTA Y REPORTE DE INFORMACIÓN:
        </span>{" "}
        Dando cumplimiento a lo dispuesto en la Ley 1581 de 2012 &quot;por la cual se
        dictan disposiciones generales para la protección de datos personales&quot; y de
        conformidad con lo señalado en el Decreto 1377 de 2013, con la firma de este
        documento, manifiesto que he sido informado por <span className="font-bold">{nombre}</span>, y en ejercicio
        de mi Derecho a la Libertad y Autodeterminación Informática, autorizo a <span className="font-bold">{nombre}</span>,
        o a la entidad que mi acreedor delegue para representarlo o a su cesionario,
        endosatario o a quien ostente en el futuro la calidad de acreedor, previo a la
        relación contractual y de manera irrevocable, escrita, expresa, concreta,
        suficiente, voluntaria e informada, con la finalidad que la información comercial,
        crediticia, financiera y de servicios de la cual soy titular referida al nacimiento,
        ejecución y extinción de obligaciones dinerarias, a mi comportamiento e historial
        crediticio, incluida la información positiva y negativa de mis hábitos de pago, y
        aquella que se refiera a la información personal necesaria para el estudio, análisis
        y eventual otorgamiento de un crédito o colaboración de un contrato, sea en general
        administrada y en especial: capturada, tratada, procesada, operada, verificada,
        transmitida, transferida, usada o puesta en circulación, y consultada por terceras
        personas autorizadas expresamente por la ley 1266 de 2008, incluyendo los Usuarios
        de la Información. Con estos mismos alcances, atributos y finalidades autorizo
        expresamente para que tal información sea conocida y reportada en la Base de Datos
        de DATACRÉDITO operada por FENALCO y DATACRÉDITO.
      </div>
    </div>
  );
}