// page.tsx — Libranza wizard
import LibranzaWizard from '@/components/dashboard/Libranza/LibranzaWizard';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nueva Libranza — ContractSign' };

export default function NewContractPage() {
  return <LibranzaWizard />;
}