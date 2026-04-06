"use client";

import { useEffect, useState } from "react";
import publicApiNew from "@/lib/publicAxios";
import { UserContractsList } from "@/components/users/contracts/listContracts";
import { ContractSummary } from "@/types/libranza";


export default function UserContractsPage() {
  const [contracts, setContracts] = useState<ContractSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const { data } = await publicApiNew.get("/users/contracts");
        setContracts(data?.data ?? []);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return (
    <div className="space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Mis contratos
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Revisa el estado de tus documentos y completa la firma cuando esté disponible.
        </p>
      </div>

      <UserContractsList contracts={contracts}  loading={loading} />
    </div>
  );
}