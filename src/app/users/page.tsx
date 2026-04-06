import { Greeting } from "@/components/users/UserGreats";
import { FileText, PenLine, Eye, Clock } from "lucide-react";

export default function Page() {
  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* HEADER */}
      <div>
        <div className="text-2xl md:text-3xl font-semibold text-gray-900">
            <Greeting/>
        </div>
        <p className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl">
          Aquí podrás gestionar tus solicitudes, revisar el estado de tus
          contratos, firmar documentos de forma segura y hacer seguimiento en
          tiempo real.
        </p>
      </div>

      {/* CARDS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Estado */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">
              Ver estado
            </h3>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Consulta en tiempo real el estado de tus solicitudes y contratos.
          </p>
        </div>

        {/* Firmar */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100 text-green-600">
              <PenLine className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">
              Firmar documentos
            </h3>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Firma tus contratos de forma rápida y segura desde cualquier
            dispositivo.
          </p>
        </div>

        {/* Solicitudes */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">
              Mis solicitudes
            </h3>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Accede a todas tus solicitudes y revisa la información enviada.
          </p>
        </div>

        {/* Seguimiento */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">
              Seguimiento
            </h3>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Mantente informado sobre cada paso del proceso de tu contrato.
          </p>
        </div>
      </div>

      {/* INFO EXTRA */}
      <div className="rounded-2xl border bg-linear-to-r from-gray-900 to-gray-800 text-white p-6">
        <h2 className="text-lg font-semibold">
          Todo en un solo lugar
        </h2>
        <p className="mt-2 text-sm text-gray-300 max-w-xl">
          Este espacio fue diseñado para que tengas el control total de tu
          proceso: desde la solicitud hasta la firma final. Sin papeleo,
          sin complicaciones.
        </p>
      </div>
    </div>
  );
}