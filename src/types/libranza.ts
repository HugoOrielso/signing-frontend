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

  clienteNombre?: string | null;
  clienteCC?: string | null;
  clienteCCDe?: string | null;
  clienteDireccion?: string | null;
  clienteTelefono?: string | null;
  clienteEmail?: string | null;
  clienteFuncionario?: string | null;
  clienteDesdeHace?: string | null;

  clienteFechaNacimiento?: string | null;
  clienteFechaExpedicionCC?: string | null;

  municipioTrabajo?: string | null;
  empresaTrabajo?: string | null;
  departamento?: string | null;

  pagaduriaNombre?: string | null;
  pagaduriaMunicipio?: string | null;
  pagaduriaDepartamento?: string | null;
  tipoContrato?: TipoContratoLibranza | null;

  sumaTotal?: string | null;
  numeroCuotas?: string | null;
  valorCuota?: string | null;
  mesCobro?: string | null;

  tipoCuenta?: string | null;
  numeroCuenta?: string | null;
  banco?: string | null;

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

export type TipoCuenta = 'Ahorros' | 'Corriente' | '';

export type FormaPago = 'NOMINA' | 'EFECTY 110520' | 'PSE' | 'BANCO' | '';

export type TipoContratoLibranza =
  | 'PROVISIONAL'
  | 'TEMPORAL'
  | 'PROVISIONAL_VACANTE_DEFINITIVA'
  | 'CARRERA_ADMINISTRATIVA'
  | 'PENSIONADO'
  | '';

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
  email?: string;
  company?: string;
  position?: string;
  relationShip?: string;
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

  clienteFechaNacimiento: string;
  clienteFechaExpedicionCC: string;

  references: ReferenceItem[];

  municipioTrabajo: string;
  empresaTrabajo: string;
  departamento: string;

  pagaduriaNombre: string;
  pagaduriaMunicipio: string;
  pagaduriaDepartamento: string;
  tipoContrato: TipoContratoLibranza;

  sumaTotal: string;
  numeroCuotas: string;
  valorCuota: string;
  mesCobro: string;

  tipoCuenta: TipoCuenta;
  numeroCuenta: string;
  banco: string;

  productos: ProductoItem[];

  formaPago: FormaPago;

  destinatarioEmail: string;
  destinatarioNombre: string;
  templateKey: string;
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

  clienteFechaNacimiento: '',
  clienteFechaExpedicionCC: '',

  references: [],

  municipioTrabajo: '',
  empresaTrabajo: '',
  departamento: '',

  pagaduriaNombre: '',
  pagaduriaMunicipio: '',
  pagaduriaDepartamento: '',
  tipoContrato: '',

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
  templateKey: '',
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

  documents?: ContractDocumentItem[];
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
  | 'PENDING_DOCUMENTS'
  | 'DOCUMENTS_UPLOADED'
  | 'PENDING_VERIFICATION'
  | 'READY_TO_SIGN'
  | 'SENT'
  | 'VIEWED'
  | 'OTP_PENDING'
  | 'OTP_VERIFIED'
  | 'PARTIALLY_SIGNED'
  | 'SIGNED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';


export interface ContractDocumentItem {
  id: string
  type: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  notes?: string | null

  fileUrl?: string | null
  fileName?: string | null
  mimeType?: string | null
  source?: 'CAMERA' | 'FILE_UPLOAD' | null

  createdAt: string | Date
  updatedAt?: string | Date
  uploadedAt?: string | Date
  reviewedAt?: string | Date
}

export type DocType =
  | "ID_FRONT"
  | "ID_BACK"
  | "SELFIE_WITH_ID"
  | "BANK_CERTIFICATE"
  | "PAYROLL_STUB"
  | "ADDITIONAL_DOCUMENT";


export type DocumentStatus = "PENDING" | "REJECTED" | "APPROVED";

export type UploadState = {
  file: File | null;
  preview: string | null;
  loading: boolean;
  uploaded?: boolean;
  uploadedUrl?: string | null;
  mimeType?: string | null;
  status?: DocumentStatus | null;
  notes?: string | null;
};


// type UploadState = {
//   file: File | null;
//   preview: string | null;
//   loading: boolean;
//   uploaded?: boolean;
//   uploadedUrl?: string | null;
//   mimeType?: string | null;
// };
