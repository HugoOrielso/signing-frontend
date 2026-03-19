// libranza.types.ts — Libranza Dimcultura wizard types

export interface ProductoItem {
  codigo:      string;
  descripcion: string;
  valor:       string;
}

export interface LibranzaForm {
  // Encabezado
  ciudad:              string;
  asesor:              string;
  fecha:               string;

  // Datos del cliente
  clienteNombre:       string;
  clienteCC:           string;
  clienteCCDe:         string;      // ciudad expedición CC
  clienteDireccion:    string;      // residente en
  clienteTelefono:     string;
  clienteEmail:        string;      // completo (ej: juan@gmail.com)
  clienteFuncionario:  string;      // empresa donde trabaja
  clienteDesdeHace:    string;      // hace cuánto trabaja allí

  // Trabajo
  municipioTrabajo:    string;
  empresaTrabajo:      string;
  departamento:        string;

  // Financiero
  sumaTotal:           string;      // $ total autorizado
  numeroCuotas:        string;      // N° cuotas
  valorCuota:          string;      // $ valor cuota
  mesCobro:            string;      // a partir del mes de

  // Cuenta bancaria
  tipoCuenta:          'Ahorros' | 'Corriente' | '';
  numeroCuenta:        string;
  banco:               string;

  // Tabla de productos
  productos:           ProductoItem[];

  // Forma de pago
  formaPago:           'NOMINA' | 'EFECTY 110520' | 'PSE' | 'BANCO' | '';

  // Envío
  destinatarioEmail:   string;
  destinatarioNombre:  string;
}

export const emptyLibranza = (): LibranzaForm => ({
  ciudad:              '',
  asesor:              '',
  fecha:               new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),

  clienteNombre:       '',
  clienteCC:           '',
  clienteCCDe:         '',
  clienteDireccion:    '',
  clienteTelefono:     '',
  clienteEmail:        '',
  clienteFuncionario:  '',
  clienteDesdeHace:    '',

  municipioTrabajo:    '',
  empresaTrabajo:      '',
  departamento:        '',

  sumaTotal:           '',
  numeroCuotas:        '',
  valorCuota:          '',
  mesCobro:            '',

  tipoCuenta:          '',
  numeroCuenta:        '',
  banco:               '',

  productos: [
    { codigo: '', descripcion: '', valor: '' },
    { codigo: '', descripcion: '', valor: '' },
    { codigo: '', descripcion: '', valor: '' },
  ],

  formaPago:           '',

  destinatarioEmail:   '',
  destinatarioNombre:  '',
});



export interface LibranzaSignature {
  id: string; signerId: string;
  type: "DRAWN" | "TYPED";
  typedValue?: string | null;
  imageUrl?: string | null;
  signedAt: string;
}

export interface LibranzaSigner {
  id: string; name: string; roleTitle?: string;
  signerOrder: number; partyRole: "CONTRACTOR" | "CONTRACTED";
}



// src/types/libranza.ts — tipos centrales alineados al schema de Prisma

// src/types/libranza.ts — tipos centrales alineados al schema de Prisma

export interface LibranzaData {
  id?:                 string;
  contractId?:         string;
  // Encabezado
  ciudad?:             string | null;
  asesor?:             string | null;
  fecha?:              string | null;
  // Datos personales
  clienteNombre?:      string | null;
  clienteCC?:          string | null;
  clienteCCDe?:        string | null;
  clienteDireccion?:   string | null;
  clienteTelefono?:    string | null;
  clienteEmail?:       string | null;
  clienteFuncionario?: string | null;
  clienteDesdeHace?:   string | null;
  // Datos laborales
  municipioTrabajo?:   string | null;
  empresaTrabajo?:     string | null;
  departamento?:       string | null;
  // Financiero
  sumaTotal?:          string | null;
  numeroCuotas?:       string | null;
  valorCuota?:         string | null;
  mesCobro?:           string | null;
  // Bancario
  tipoCuenta?:         string | null;
  numeroCuenta?:       string | null;
  banco?:              string | null;
  // Productos y pago
  productos?:          ProductoItem[] | null;
  formaPago?:          string | null;
}

export interface ProductoItem {
  codigo:      string;
  descripcion: string;
  valor:       string;
}

export interface LibranzaForm {
  // Encabezado
  ciudad:              string;
  asesor:              string;
  fecha:               string;
  // Datos personales
  clienteNombre:       string;
  clienteCC:           string;
  clienteCCDe:         string;
  clienteDireccion:    string;
  clienteTelefono:     string;
  clienteEmail:        string;
  clienteFuncionario:  string;
  clienteDesdeHace:    string;
  // Datos laborales
  municipioTrabajo:    string;
  empresaTrabajo:      string;
  departamento:        string;
  // Financiero
  sumaTotal:           string;
  numeroCuotas:        string;
  valorCuota:          string;
  mesCobro:            string;
  // Bancario
  tipoCuenta:          'Ahorros' | 'Corriente' | '';
  numeroCuenta:        string;
  banco:               string;
  // Productos y pago
  productos:           ProductoItem[];
  formaPago:           'NOMINA' | 'EFECTY 110520' | 'PSE' | 'BANCO' | '';
  // Envío
  destinatarioEmail:   string;
  destinatarioNombre:  string;
}

export type ContractStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'PARTIALLY_SIGNED'
  | 'SIGNED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface ContractParty {
  id:              string;
  role:            'CONTRACTOR' | 'CONTRACTED';
  name:            string;
  identification?: string | null;
  email?:          string | null;
  phone?:          string | null;
  address?:        string | null;
}

export interface ContractSigner {
  id:          string;
  name:        string;
  email?:      string | null;
  phone?:      string | null;
  roleTitle?:  string | null;
  partyRole?:  'CONTRACTOR' | 'CONTRACTED' | null;
  signerOrder: number;
  signedAt?:   string | null;
}

export interface ContractSignature {
  id:          string;
  signerId?:   string | null;
  type:        'DRAWN' | 'TYPED' | 'CLICK_TO_SIGN';
  imageUrl?:   string | null;
  typedValue?: string | null;
  signedAt:    string;
}

export interface Contract {
  id:              string;
  title:           string;
  contractNumber?: string | null;
  contractType?:   string | null;
  status:          ContractStatus;
  startDate?:      string | null;
  endDate?:        string | null;
  subject?:        string | null;
  amount?:         number | null;
  currency?:       string | null;
  paymentMethod?:  string | null;
  token?:          string | null;
  createdAt:       string;
  updatedAt:       string;
  parties:         ContractParty[];
  signers:         ContractSigner[];
  signatures:      ContractSignature[];
  libranzaData?:   LibranzaData | null;
}