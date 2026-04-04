import { LibranzaForm } from "@/types/libranza";

export function buildLibranzaPayload(f: LibranzaForm) {
  return {
    title: `Libranza Dimcultura - ${f.clienteNombre}`,
    contractType: "LIBRANZA",
    subject: `Autorización de descuento por nómina · ${f.clienteNombre}`,

    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

    amount: f.sumaTotal
      ? parseFloat(f.sumaTotal.replace(/[^0-9.]/g, ""))
      : undefined,

    currency: "COP",
    paymentMethod: f.formaPago || undefined,

    ciudad: f.ciudad,
    asesor: f.asesor,
    fecha: f.fecha,

    clienteNombre: f.clienteNombre,
    clienteCC: f.clienteCC,
    clienteCCDe: f.clienteCCDe,
    clienteFechaNacimiento: f.clienteFechaNacimiento,
    clienteFechaExpedicionCC: f.clienteFechaExpedicionCC,
    clienteDireccion: f.clienteDireccion,
    clienteTelefono: f.clienteTelefono,
    clienteEmail: f.clienteEmail,
    clienteFuncionario: f.clienteFuncionario,
    clienteDesdeHace: f.clienteDesdeHace,

    pagaduriaNombre: f.pagaduriaNombre ?? f.empresaTrabajo,
    pagaduriaMunicipio: f.pagaduriaMunicipio ?? f.municipioTrabajo,
    pagaduriaDepartamento: f.pagaduriaDepartamento ?? f.departamento,

    municipioTrabajo: f.municipioTrabajo,
    empresaTrabajo: f.empresaTrabajo,
    departamento: f.departamento,

    sumaTotal: f.sumaTotal,
    numeroCuotas: f.numeroCuotas,
    valorCuota: f.valorCuota,
    mesCobro: f.mesCobro,

    tipoCuenta: f.tipoCuenta,
    numeroCuenta: f.numeroCuenta,
    banco: f.banco,

    formaPago: f.formaPago,

    tipoContrato: f.tipoContrato ?? "FIJO",

    productos: f.productos,

    parties: [
      {
        role: "CONTRACTOR",
        name: "Dimcultura S.A.S.",
        identification: "900.585.322-4",
        email: "servicioalcliente@dimcultura.com",
      },
      {
        role: "CONTRACTED",
        name: f.clienteNombre,
        identification: f.clienteCC,
        email: f.clienteEmail || f.destinatarioEmail,
        phone: f.clienteTelefono,
        address: f.clienteDireccion,
      },
    ],

    signers: [
      {
        partyRole: "CONTRACTED",
        name: f.destinatarioNombre || f.clienteNombre,
        email: f.destinatarioEmail,
        phone: f.clienteTelefono,
        roleTitle: "Contratado",
        signerOrder: 1,
      },
    ],

    references: f.references,

    templateKey: f.templateKey,
  };
}