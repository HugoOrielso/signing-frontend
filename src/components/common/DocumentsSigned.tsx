import { CheckCircle2, FileCheck2 } from "lucide-react";

interface DocumentsSignedProps {
  title?: string;
  description?: string;
}

export function DocumentsSigned({
  title = "Documentos firmados correctamente",
  description = "La firma electrónica fue completada exitosamente y los documentos ya cuentan con validez jurídica.",
}: DocumentsSignedProps) {
  return (
    <div className="flex min-h-105 items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-emerald-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-11 w-11 text-emerald-600" />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h2>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-md text-center text-sm leading-7 text-neutral-600">
          {description}
        </p>

        {/* Info Box */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <FileCheck2 className="h-6 w-6 text-neutral-700" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-900">
                Estado del proceso
              </p>

              <p className="text-sm leading-6 text-neutral-600">
                Los documentos fueron procesados y firmados electrónicamente.
                La información quedó registrada correctamente en el sistema.
              </p>

              <div className="pt-2 text-xs leading-5 text-neutral-500">
                Conforme a la Ley 527 de 1999 y el Decreto 2364 de 2012
                de Colombia.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-neutral-400">
          Gracias por completar el proceso.
        </div>
      </div>
    </div>
  );
}