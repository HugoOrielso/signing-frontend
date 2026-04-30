import { LibranzaDataPreview, LibranzaForm } from "@/types/libranza";

export function buildLibranzaPayload(f: LibranzaForm) {
  return {
    title: `Libranza Dimcultura - ${f.clienteNombre}`,
    contractType: "LIBRANZA",
    subject: `Autorización de descuento por nómina · ${f.clienteNombre}`,

    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

    amount: f.sumaTotal
      ? (f.sumaTotal)
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

    sumaTotal: Number(f.sumaTotal),
    numeroCuotas: Number(f.numeroCuotas),
    valorCuota: Number(f.valorCuota),
    mesCobro: f.mesCobro,

    tipoCuenta: f.tipoCuenta,
    numeroCuenta: f.numeroCuenta,
    banco: f.banco,

    formaPago: f.formaPago,

    tipoContrato: f.tipoContrato ?? "FIJO",

    productos: f.productos,

    parties: [
      {
        role: "ACREEDOR",
        name: "Dimcultura S.A.S.",
        identification: "900.585.322-4",
        email: "servicioalcliente@dimcultura.com",
      },
      {
        role: "DEUDOR",
        name: f.clienteNombre,
        identification: f.clienteCC,
        email: f.clienteEmail || f.destinatarioEmail,
        phone: f.clienteTelefono,
        address: f.clienteDireccion,
      },
    ],

    signers: [
      {
        partyRole: "DEUDOR",
        name: f.destinatarioNombre || f.clienteNombre,
        email: f.destinatarioEmail,
        phone: f.clienteTelefono,
        roleTitle: "Deudor",
        signerOrder: 1,
      },
    ],

    references: f.references,

    templateKey: f.templateKey,
  };
}


export function buildLibranzaPayloadToReview(f: LibranzaDataPreview) {
  return {
    title: `Libranza Dimcultura - ${f.clienteNombre}`,
    contractType: "LIBRANZA",
    subject: `Autorización de descuento por nómina · ${f.clienteNombre}`,

    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

    amount: f.sumaTotal
      ? (f.sumaTotal)
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
        role: "ACREEDOR",
        name: "Dimcultura S.A.S.",
        identification: "900.585.322-4",
        email: "servicioalcliente@dimcultura.com",
      },
      {
        role: "DEUDOR",
        name: f.clienteNombre,
        identification: f.clienteCC,
        email: f.clienteEmail,
        phone: f.clienteTelefono,
        address: f.clienteDireccion,
      },
    ],

    signers: [
      {
        partyRole: "DEUDOR",
        name: f.clienteNombre,
        email: f.clienteEmail,
        phone: f.clienteTelefono,
        roleTitle: "Deudor",
        signerOrder: 1,
      },
    ],

    references: f.references,

  };
}

export function buildLibranzaPayloadToEdit(f: LibranzaDataPreview) {
  return {
    title: `Libranza Dimcultura - ${f.clienteNombre}`,
    contractType: "LIBRANZA",
    subject: `Autorización de descuento por nómina · ${f.clienteNombre}`,

    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),

    amount: f.sumaTotal
      ? (f.sumaTotal)
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
        role: "ACREEDOR",
        name: "Dimcultura S.A.S.",
        identification: "900.585.322-4",
        email: "servicioalcliente@dimcultura.com",
      },
      {
        role: "DEUDOR",
        name: f.clienteNombre,
        identification: f.clienteCC,
        email: f.clienteEmail,
        phone: f.clienteTelefono,
        address: f.clienteDireccion,
      },
    ],

    signers: [
      {
        partyRole: "DEUDOR",
        name: f.clienteNombre,
        email: f.clienteEmail,
        phone: f.clienteTelefono,
        roleTitle: "Deudor",
        signerOrder: 1,
      },
    ],

    references: f.references,

  };
}