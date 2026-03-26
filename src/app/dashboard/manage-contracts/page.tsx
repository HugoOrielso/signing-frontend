import ContractsTable from '@/components/dashboard/dataTable/ContracTable';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mis Contratos — ContractSign' };

export default async function DashboardPage() {
  return (
    <div className="p-3  mx-auto">
      <div className="container mx-auto">
        <ContractsTable />
      </div>
    </div>
  );
}