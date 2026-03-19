export type PartyRole = "CONTRACTOR" | "CONTRACTED";
export type SigType   = "canvas" | "typed";

export interface ContractGeneralData {
  title: string;
  contractNumber: string;
  contractType: string;
  startDate: string;
  endDate: string;
  subject: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  contractorName: string;
  contractorIdentification: string;
  contractorEmail: string;
  contractorPhone: string;
  contractorAddress: string;
  contractedName: string;
  contractedIdentification: string;
  contractedEmail: string;
  contractedPhone: string;
  contractedAddress: string;
}

export interface ContractClauseItem {
  id: string;
  content: string;
}

export interface ContractSignerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  partyRole: PartyRole;
  // Signature — stored directly on the signer
  signed:  boolean;
  sigType: SigType | null;
  sigData: string;
}

export interface ContractStore {
  step: number;
  generalData: ContractGeneralData;
  clauses: ContractClauseItem[];
  signers: ContractSignerItem[];

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  updateGeneralField: <K extends keyof ContractGeneralData>(
    field: K,
    value: ContractGeneralData[K]
  ) => void;
  setGeneralData: (data: ContractGeneralData) => void;

  addClause: () => void;
  updateClause: (id: string, content: string) => void;
  removeClause: (id: string) => void;
  setClauses: (clauses: ContractClauseItem[]) => void;

  addSigner: () => void;
  updateSigner: <K extends keyof ContractSignerItem>(
    id: string,
    field: K,
    value: ContractSignerItem[K]
  ) => void;
  saveSig: (id: string, sigType: SigType | null, sigData: string) => void;
  removeSigner: (id: string) => void;
  setSigners: (signers: ContractSignerItem[]) => void;

  resetStore: () => void;
}


