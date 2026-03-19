import { LibranzaData } from "@/types/libranza";
import { FieldUnderline as U } from "@/components/ui/Libranza/FieldUnderline";
import { FieldBox as Box } from "@/components/ui/Libranza/FieldBox";
import { CheckBox as Chk } from "@/components/ui/Libranza/CheckBox";
import { F, FM } from "@/lib/formatters/formaters";

interface Props {
  data: LibranzaData;
}

export function LibranzaBody({ data: d }: Props) {
  return (
    <>
      <div style={{ fontSize: 9, lineHeight: 1.65, marginBottom: 5 }}>
        Yo <U w={130}>{F(d.clienteNombre)}</U>{" "}
        con C.C.<U w={90}>{F(d.clienteCC)}</U>{" "}
        De <U w={90}>{F(d.clienteCCDe)}</U>,<br />
        residente en <U w={150}>{F(d.clienteDireccion)}</U>{" "}
        con número de contacto <U w={90}>{F(d.clienteTelefono)}</U> y correo<br />
        de notificación <U w={130}>{F(d.clienteEmail)}</U>{" "}
        Funcionario de <U w={110}>{F(d.clienteFuncionario)}</U>{" "}
        Desde hace <U w={70}>{F(d.clienteDesdeHace)}</U><br />
        Actualmente trabajo en el municipio de <U w={110}>{F(d.municipioTrabajo)}</U>
        , me permito autorizar por medio de este, al Señor pagador de<br />
        <U w={160}>{F(d.empresaTrabajo)}</U>
        , departamento <U w={100}>{F(d.departamento)}</U>
        , para que descuente de mi sueldo o de cualquier otro concepto la<br />
        suma de <Box w={90}>{FM(d.sumaTotal)}</Box>{" "}
        en <Box w={30}>{F(d.numeroCuotas)}</Box>{" "}
        cuotas mensuales consecutivas por valor de <Box w={90}>{FM(d.valorCuota)}</Box>
        , cada una, a partir<br />
        del mes de <Box w={110}>{F(d.mesCobro)}</Box>{" "}
        y pagarlos a la orden de <strong>DIMCULTURA S.A.S.</strong>{" "}
        <span style={{ fontSize: 8 }}>
          Nota: en caso de que el cupo de mi nómina no sea suficiente para cubrir la obligación
          mensual, autorizo a la empresa para que debite los valores pactados en este documento, de mi cuenta
        </span>
        <br />
        <strong>Ahorros</strong> <Chk on={d.tipoCuenta === "Ahorros"} />{" "}
        <strong>Corriente</strong> <Chk on={d.tipoCuenta === "Corriente"} />{" "}
        No. <U w={100}>{F(d.numeroCuenta)}</U>{" "}
        DEL BANCO <U w={100}>{F(d.banco)}</U>{" "}
        <span style={{ fontSize: 7 }}>
          Declaro formalmente no tener nada que reclamar a <strong>DIMCULTURA S.A.S</strong> judicial
          o extrajudicialmente, por los cargos que a través de la presente autorización, se realice de mi cuenta.
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          border: "1px solid #000",
          padding: 5,
          marginBottom: 5,
          fontSize: 8,
        }}
      >
        {[0, 1].map((i) => (
          <div key={i}>
            <strong>Nombre: </strong>
            <U w={120} />
            <br />
            <strong>Parentesco: </strong>
            <U w={70} /> <strong>Teléfono: </strong>
            <U w={70} />
            <br />
            <strong>Correo: </strong>
            <U w={140} />
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 6.5,
          border: "1px solid #ccc",
          padding: 5,
          marginBottom: 5,
          lineHeight: 1.5,
          textAlign: "justify",
        }}
      >
        <strong>AUTORIZACIÓN PARA CONSULTA Y REPORTE DE INFORMACIÓN: </strong>
        Dando cumplimiento a lo dispuesto en la Ley 1581 de 2012 &quot;por la cual se dictan disposiciones
        generales para la protección de datos personales&quot; y de conformidad con lo señalado en el Decreto
        1377 de 2013, con la firma de este documento, manifiesto que he sido informado por DIMCULTURA S.A.S.,
        y en ejercicio de mi Derecho a la Libertad y Autodeterminación Informática, autorizo a DIMCULTURA S.A.S.,
        o a la entidad que mi acreedor delegue para representarlo o a su cesionario, endosatario o a quien ostente
        en el futuro la calidad de acreedor, previo a la relación contractual y de manera irrevocable, escrita,
        expresa, concreta, suficiente, voluntaria e informada, con la finalidad que la información comercial,
        crediticia, financiera y de servicios de la cual soy titular referida al nacimiento, ejecución y extinción
        de obligaciones dinerarias, a mi comportamiento e historial crediticio, incluida la información positiva
        y negativa de mis hábitos de pago, y aquella que se refiera a la información personal necesaria para el
        estudio, análisis y eventual otorgamiento de un crédito o colaboración de un contrato, sea en general
        administrada y en especial: capturada, tratada, procesada, operada, verificada, transmitida transferida,
        usada o puesta en circulación, y consultada por terceras personas autorizadas expresamente por la ley
        1266 de 2008, incluyendo los Usuarios de la Información. Con estas mismas alcances, atributos y
        finalidades autorizo expresamente para que tal información sea conocida y reportada en la Base de Datos
        de DATACREDITO operada por FENALCO y DATACREDITO.
      </div>
    </>
  );
}