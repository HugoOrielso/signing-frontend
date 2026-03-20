import { FilePlus2, FileText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-3">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido al dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Desde aquí puedes crear contratos y administrar los existentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Panel seguro</h2>
          <p className="text-sm text-gray-500 mt-2">
            Acceso exclusivo para administradores.
          </p>
        </div>

        <Link
          href="/dashboard/create-contract"
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
            <FilePlus2 className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Crear contrato</h2>
          <p className="text-sm text-gray-500 mt-2">
            Genera un nuevo contrato para enviar a firma.
          </p>
        </Link>

        <Link
          href="/dashboard/manage-contracts"
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Administrar contratos
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Revisa, filtra y controla los contratos ya creados.
          </p>
        </Link>
      </div>
    </div>
  );
}