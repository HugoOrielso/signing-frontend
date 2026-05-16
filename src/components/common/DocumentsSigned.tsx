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
    <div className="flex min-h-[100dvh] items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-white p-5 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-3xl sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 sm:mb-6 sm:h-20 sm:w-20">
          <CheckCircle2 className="h-9 w-9 text-emerald-600 sm:h-11 sm:w-11" />
        </div>

        <h2 className="mb-3 text-center text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
          {title}
        </h2>

        <p className="mx-auto mb-6 max-w-md text-center text-sm leading-6 text-neutral-600 sm:mb-8 sm:leading-7">
          {description}
        </p>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
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

              <p className="pt-2 text-xs leading-5 text-neutral-500">
                Conforme a la Ley 527 de 1999 y el Decreto 2364 de 2012 de
                Colombia.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400 sm:mt-8">
          Gracias por completar el proceso.
        </div>
      </div>
    </div>
  );
}