'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axiosClient';
import axios from 'axios';
import type { Contract } from '@/types/libranza';
import { ContractDetailClient } from '@/components/dashboard/Libranza/Details/LibranzaDetailClient';

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);

    const fetchData = async () => {
      try {
        const res = await api.get(`/contracts/${id}`);
        const data: Contract = res.data?.data;

        if (!data) {
          setNotFound(true);
          return;
        }

        setContract(data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setNotFound(true);
          } else {
            console.error('Axios error:', error.response?.data);
          }
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  if (notFound || !contract) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Contrato no encontrado
      </div>
    );
  }

  return <ContractDetailClient contract={contract} />;
}