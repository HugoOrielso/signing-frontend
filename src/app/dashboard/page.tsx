import { FileSignature, ShieldCheck, BadgeCheck, Building2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <section className="flex items-center justify-center px-8 py-10 min-h-screen ">
      <div className="grid gap-10 xl:grid-cols-[1.45fr_0.95fr]">
        {/* Lado izquierdo */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-200/70 px-4 py-2 text-sm font-medium text-slate-700">
              <Building2 className="h-4 w-4" />
              Plataforma interna Dimcultura
            </div>

            <h2 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900">
              Gestiona y firma documentos de libranza de forma rápida y segura
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Esta plataforma permite crear, administrar y enviar contratos y
              documentos para firma digital, facilitando el proceso interno de
              Dimcultura con más orden, trazabilidad y seguridad.
            </p>
          </div>

          {/* Cards inferiores */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/70">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FileSignature className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Firma digital
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Envía documentos listos para revisión y firma.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/70">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Seguridad
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Control de acceso y manejo confiable de la información.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/70">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                Trazabilidad
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Consulta el estado de cada documento en un solo lugar.
              </p>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex items-end">
          <div className="w-full rounded-[30px] bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl shadow-slate-300/40">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-300">
              Dimcultura
            </p>

            <h3 className="mt-5 text-3xl font-bold leading-tight">
              Gestión documental para procesos de libranza
            </h3>

            <p className="mt-5 text-[15px] leading-7 text-slate-300">
              Centraliza la creación, el seguimiento y la firma de documentos
              empresariales desde un mismo panel.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-white/10 px-5 py-4 text-base font-medium backdrop-blur-sm">
                Creación de contratos
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-4 text-base font-medium backdrop-blur-sm">
                Envío a firma
              </div>
              <div className="rounded-2xl bg-white/10 px-5 py-4 text-base font-medium backdrop-blur-sm">
                Seguimiento del estado
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}