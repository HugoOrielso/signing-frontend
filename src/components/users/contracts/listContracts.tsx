"use client";
import {
  FileText,
} from "lucide-react";
import { ContractSummary } from "@/types/libranza";
import { ContractCard } from "@/components/contracts/contractsCards";
type UserContractsListProps = {
  contracts: ContractSummary[];
  loading?: boolean;
};



function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <FileText className="h-7 w-7 text-slate-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        Aún no tienes contratos disponibles
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Cuando haya documentos asociados a tu proceso, podrás verlos aquí,
        revisar su estado y completar la firma si es necesario.
      </p>
    </div>
  );
}



export function UserContractsList({
  contracts,
}: UserContractsListProps) {
  if (!contracts.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}