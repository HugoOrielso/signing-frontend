// page.tsx — Libranza wizard
import { Metadata } from 'next';
import LibranzaWizard from '../../../components/libranza/LibranzaWizard';

export const metadata: Metadata = { title: 'Nueva Libranza — ContractSign' };

export default function NewContractPage() {
  return <LibranzaWizard />;
}