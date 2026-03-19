interface ContractData  {
  id: string;
  title: string;
  contractType?: string | null;
  subject?: string | null;
  status: string;
  parties: Array<{
    id: string;
    role: "CONTRACTOR" | "CONTRACTED";
    name: string;
    email?: string | null;
  }>;
  clauses: Array<{
    id: string;
    position: number;
    content: string;
  }>;
  signers: Array<{
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    roleTitle?: string | null;
    partyRole?: "CONTRACTOR" | "CONTRACTED" | null;
    signerOrder: number;
  }>;
};

type Props = {
  token: string;
};