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

export interface LibranzaDataPreview {
  id?: string;
  contractId?: string;
  ciudad?: string | null;
  asesor?: string | null;
  fecha?: string | null;
  // Datos personales
  clienteNombre?: string | null;
  clienteCC?: string | null;
  clienteCCDe?: string | null;
  clienteDireccion?: string | null;
  clienteTelefono?: string | null;
  clienteEmail?: string | null;
  clienteFuncionario?: string | null;
  clienteDesdeHace?: string | null;
  // Datos laborales
  municipioTrabajo?: string | null;
  empresaTrabajo?: string | null;
  departamento?: string | null;
  // Financiero
  sumaTotal?: string | null;
  numeroCuotas?: string | null;
  valorCuota?: string | null;
  mesCobro?: string | null;
  // Bancario
  tipoCuenta?: string | null;
  numeroCuenta?: string | null;
  banco?: string | null;
  // Productos y pago
  productos?: ProductoItem[] | null;
  formaPago?: string | null;
  references: ReferenceItem[];
  templateKey?: string | null;
}

export interface ProductoItem {
  codigo: string;
  descripcion: string;
  valor: string;
}

export type ReferenceType = 'PERSONAL' | 'LABORAL';

export interface ReferenceItem {
  type: ReferenceType;
  name: string;
  phone: string;
  email: string;
  // Solo LABORAL
  company: string;
  position: string;
  // Solo PERSONAL
  relationShip: string;
}

export interface LibranzaForm {
  ciudad: string;
  asesor: string;
  fecha: string;

  clienteNombre: string;
  clienteCC: string;
  clienteCCDe: string;
  clienteDireccion: string;
  clienteTelefono: string;
  clienteEmail: string;
  clienteFuncionario: string;
  clienteDesdeHace: string;

  references: ReferenceItem[];

  municipioTrabajo: string;
  empresaTrabajo: string;
  departamento: string;

  sumaTotal: string;
  numeroCuotas: string;
  valorCuota: string;
  mesCobro: string;

  tipoCuenta: 'Ahorros' | 'Corriente' | '';
  numeroCuenta: string;
  banco: string;

  productos: ProductoItem[];

  formaPago: 'NOMINA' | 'EFECTY 110520' | 'PSE' | 'BANCO' | '';

  
  destinatarioEmail: string;
  destinatarioNombre: string;
  templateKey: string
}

export const emptyLibranza: LibranzaForm = {
  ciudad: '',
  asesor: '',
  fecha: '',

  clienteNombre: '',
  clienteCC: '',
  clienteCCDe: '',
  clienteDireccion: '',
  clienteTelefono: '',
  clienteEmail: '',
  clienteFuncionario: '',
  clienteDesdeHace: '',

  references: [],

  municipioTrabajo: '',
  empresaTrabajo: '',
  departamento: '',

  sumaTotal: '',
  numeroCuotas: '',
  valorCuota: '',
  mesCobro: '',

  tipoCuenta: '',
  numeroCuenta: '',
  banco: '',

  productos: [{ codigo: '', descripcion: '', valor: '' }],

  formaPago: '',

  destinatarioEmail: '',
  destinatarioNombre: '',
  templateKey: ''
};

export interface Contract {
  id: string;
  title: string;
  contractNumber?: string | null;
  contractType?: string | null;
  subject?: string | null;
  status: ContractStatus;
  token?: string | null;

  amount?: number | null;
  currency?: string | null;

  createdAt: string;
  updatedAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;

  parties: ContractParty[];
  signers: LibranzaSigner[];
  signatures: LibranzaSignature[];
  libranzaData?: LibranzaDataPreview | null;
}


export interface ContractParty {
  id: string;
  role: 'CONTRACTOR' | 'CONTRACTED';
  name: string;
  identification?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export type ContractStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'PARTIALLY_SIGNED'
  | 'SIGNED'
  | 'EXPIRED'
  | 'CANCELLED';


export interface ContractDocumentItem {
  id: string;
  type: string;
  label: string;
  url: string;
  mimeType?: string;
  uploadedAt: string;
}