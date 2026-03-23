'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axiosClient';
import type { Contract, ContractDocumentItem } from '@/types/libranza';
import { ContractDetailClient } from '@/components/dashboard/Libranza/Details/LibranzaDetailClient';

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [docs, setDocs]         = useState<ContractDocumentItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    api.get(`/contracts/${id}`)
      .then((res) => {
        const data: Contract = res.data?.data;
        setContract(data);
        return api.get(`/contracts/public/${data.token}/documents`);
      })
      .then((res) => setDocs(res.data.documents ?? []))
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
    </div>
  );

  if (notFound || !contract) return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      Contrato no encontrado
    </div>
  );

  return <ContractDetailClient contract={contract} docs={docs} />;
}