import {
  ContractClauseItem,
  ContractGeneralData,
  ContractSignerItem,
  ContractStore,
} from "@/types/contract";
import { create } from "zustand";

const initialGeneralData: ContractGeneralData = {
  title: "",
  contractNumber: "",
  contractType: "Prestación de Servicios",
  startDate: "",
  endDate: "",
  subject: "",
  amount: "",
  currency: "COP",
  paymentMethod: "Pago único al inicio",
  contractorName: "",
  contractorIdentification: "",
  contractorEmail: "",
  contractorPhone: "",
  contractorAddress: "",
  contractedName: "",
  contractedIdentification: "",
  contractedEmail: "",
  contractedPhone: "",
  contractedAddress: "",
};

const blankSig = () => ({ signed: false, sigType: null as null, sigData: "" });

const createInitialClauses = (): ContractClauseItem[] => [
  { id: crypto.randomUUID(), content: "" },
];

const createInitialSigners = (): ContractSignerItem[] => [
  {
    id: crypto.randomUUID(),
    name: "", email: "", phone: "",
    roleTitle: "Contratante", partyRole: "CONTRACTOR",
    ...blankSig(),
  },
  {
    id: crypto.randomUUID(),
    name: "", email: "", phone: "",
    roleTitle: "Contratado", partyRole: "CONTRACTED",
    ...blankSig(),
  },
];

export const useContractStore = create<ContractStore>((set) => ({
  step: 1,
  generalData: initialGeneralData,
  clauses: createInitialClauses(),
  signers: createInitialSigners(),

  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 4) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  updateGeneralField: (field, value) =>
    set((s) => ({ generalData: { ...s.generalData, [field]: value } })),
  setGeneralData: (data) => set({ generalData: data }),

  addClause: () =>
    set((s) => ({
      clauses: [...s.clauses, { id: crypto.randomUUID(), content: "" }],
    })),
  updateClause: (id, content) =>
    set((s) => ({
      clauses: s.clauses.map((c) => (c.id === id ? { ...c, content } : c)),
    })),
  removeClause: (id) =>
    set((s) => {
      if (s.clauses.length === 1) return s;
      return { clauses: s.clauses.filter((c) => c.id !== id) };
    }),
  setClauses: (clauses) => set({ clauses }),

  addSigner: () =>
    set((s) => ({
      signers: [
        ...s.signers,
        {
          id: crypto.randomUUID(),
          name: "", email: "", phone: "",
          roleTitle: "", partyRole: "CONTRACTED" as const,
          ...blankSig(),
        },
      ],
    })),
  updateSigner: (id, field, value) =>
    set((s) => ({
      signers: s.signers.map((sg) =>
        sg.id === id ? { ...sg, [field]: value } : sg
      ),
    })),
  // Dedicated action to persist the drawn/typed signature
  saveSig: (id, sigType, sigData) =>
    set((s) => ({
      signers: s.signers.map((sg) =>
        sg.id === id
          ? { ...sg, signed: !!sigType, sigType: sigType ?? null, sigData }
          : sg
      ),
    })),
  removeSigner: (id) =>
    set((s) => {
      if (s.signers.length === 1) return s;
      return { signers: s.signers.filter((sg) => sg.id !== id) };
    }),
  setSigners: (signers) => set({ signers }),

  resetStore: () =>
    set({
      step: 1,
      generalData: initialGeneralData,
      clauses: createInitialClauses(),
      signers: createInitialSigners(),
    }),
}));