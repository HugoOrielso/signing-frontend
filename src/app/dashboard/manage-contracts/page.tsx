import ContractsTable from "@/components/dashboard/dataTable/ContracTable";
import { Metadata } from "next";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Mis Contratos — ContractSign",
};

export default function DashboardPage() {
  return (
    <div className="w-full min-w-0 px-4 py-6 md:px-6 md:py-8">
      <BackgroundDecor />

      <div className=" mx-auto max-w-7xl space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            <FileText className="h-4 w-4" />
            Gestión documental
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Mis contratos
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            Consulta, filtra y revisa todos los contratos registrados dentro de la
            plataforma.
          </p>
        </div>

        <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-4  md:p-6 mx-auto">
          <ContractsTable />
        </div>
      </div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-size-[84px_84px] opacity-40" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
    </div>
  );
}

