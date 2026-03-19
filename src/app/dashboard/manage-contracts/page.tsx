import ContractsList from '@/components/contracts/administration/ContractList';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mis Contratos — ContractSign' };

const INK  = '#1a1a2e';
const MUTED = '#7a6e5f';
const GOLD  = '#c9a84c';

export default function DashboardPage() {
  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily:'Playfair Display, Georgia, serif', fontSize:28, color:INK, margin:0 }}>
            Mis Contratos
          </h1>
          <p className="text-sm mt-1" style={{ color:MUTED }}>
            Gestiona y da seguimiento a todas las libranzas
          </p>
        </div>
        <a href="/dashboard/create-contract"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-all"
          style={{ background:INK, color:GOLD }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva libranza
        </a>
      </div>
      <ContractsList />
    </div>
  );
}