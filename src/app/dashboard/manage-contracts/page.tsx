import ContractsTable from '@/components/dashboard/dataTable/ContracTable';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mis Contratos — ContractSign' };

export default async function DashboardPage() {
  return (
    <div className="p-3  mx-auto">
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="font-serif text-[28px] text-ink m-0">
            Libranzas
          </h1>
        </div>

        <a
          href="/dashboard/create-contract"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline bg-ink text-gold transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva libranza
        </a>
      </div>

      <div className="container mx-auto py-2.5">
        <ContractsTable />
      </div>
    </div>
  );
}