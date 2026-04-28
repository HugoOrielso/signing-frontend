type DateRange = Date[] | null;

type FinancialSummaryResponse = {
  range: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalContracts: number;
    signedContracts: number;
    activeContracts: number;
    totalSumaTotal: number;
    totalCuotas: number;
    totalValorCuotas: number;
    averagePerContract: number;
  };
  contracts: {
    id: string;
    contractNumber: string | null;
    title: string;
    status: string;
    createdAt: string;
    templateKey: string;
    cliente: {
      name: string | null;
      identification: string | null;
      phone: string | null;
      email: string | null;
      empresaTrabajo: string | null;
    };
    operador: {
      id: string;
      name: string;
      email: string;
      role: string;
    } | null;
    asesor: string | null;
    analista: {
      id: string;
      name: string;
      email: string;
      role: string;
      assignedAt: string | null;
    } | null;
    cuotas: {
      sumaTotal: number;
      numeroCuotas: number;
      valorCuota: number;
    };
  }[];
};

type FinancialContractRow = {
    id: string;
    contractNumber: string | null;
    templateKey: string | null;
    status: string;
    createdAt: string;

    cliente: {
        name: string | null;
        identification: string | null;
    };

    operador: {
        name: string;
        email: string;
    } | null;

    asesor: string | null;

    analista: {
        name: string;
        email: string;
    } | null;

    cuotas: {
        sumaTotal: number;
        numeroCuotas: number;
        valorCuota: number;
    };
};