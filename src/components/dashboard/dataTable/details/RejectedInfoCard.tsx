import { AlertTriangle } from "lucide-react";

interface RejectedInfoCardProps {
  notes?: string | null;
}

export function RejectedInfoCard({ notes }: RejectedInfoCardProps) {
  return (
    <div className="mt-4 rounded-2xl border border-red-200 bg-linear-to-br from-red-50 to-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-red-100 p-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        <div>
          <h3 className="text-base font-semibold text-red-900">
            Datos rechazados
          </h3>
          <p className="mt-1 text-sm text-red-900/80">
            La información general del usuario fue rechazada y debe ser corregida
            antes de continuar con el proceso.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-red-100 bg-white/80 p-4">
        <p className="text-sm text-slate-700">
          El usuario deberá enviar nuevamente los datos solicitados o corregir la
          información registrada para que el expediente pueda ser revisado otra vez.
        </p>

        {notes?.trim() && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
              Motivo del rechazo
            </p>
            <p className="mt-1 text-sm text-red-800">{notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}