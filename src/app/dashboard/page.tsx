import {
  FileSignature,
  ShieldCheck,
  BadgeCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Firma digital",
    description: "Envía documentos listos para revisión y firma de manera simple y ordenada.",
    icon: FileSignature,
    iconWrap: "bg-blue-100 text-blue-700",
  },
  {
    title: "Seguridad",
    description: "Control de acceso y manejo confiable de la información en cada proceso.",
    icon: ShieldCheck,
    iconWrap: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Trazabilidad",
    description: "Consulta el estado de cada documento y mantén visibilidad del flujo completo.",
    icon: BadgeCheck,
    iconWrap: "bg-violet-100 text-violet-700",
  },
];

const steps = [
  "Creación de contratos",
  "Envío a firma",
  "Seguimiento del estado",
];

export default function DashboardPage() {
  return (
    <section className="relative min-h-full overflow-hidden px-6 py-8 md:px-8 md:py-10">
      <DashboardBackground />

      <div className="relative mx-auto grid max-w-7xl gap-10 xl:grid-cols-[1.4fr_0.92fr]">
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <Building2 className="h-4 w-4 text-blue-700" />
              Plataforma interna Dimcultura
            </div>

            <div className="mt-8 max-w-4xl">
              <h2 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
                Gestiona y firma documentos de libranza con una experiencia
                <span className="bg-linear-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  {" "}
                  clara, segura y moderna
                </span>
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                Centraliza la creación, administración y envío de contratos y
                pagarés desde un solo lugar, con más orden operativo,
                trazabilidad y confianza para los procesos internos de
                Dimcultura.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                Procesos más organizados
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                Firma y seguimiento centralizado
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                Mayor control documental
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-[28px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.10)]"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.iconWrap}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-stretch">
          <div className="relative w-full overflow-hidden rounded-[32px] border border-slate-200/60 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-indigo-400/15 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.22em] text-slate-200 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Panel operativo
              </div>

              <h3 className="mt-6 text-3xl font-semibold leading-tight">
                Gestión documental para procesos de libranza
              </h3>

              <p className="mt-5 text-[15px] leading-7 text-slate-300">
                Administra contratos, pagarés y seguimiento de firma desde un
                mismo panel, con una experiencia mucho más clara para el equipo.
              </p>

              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm transition hover:bg-white/[0.14]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-blue-200">
                        {index + 1}
                      </div>
                      <span className="text-base font-medium text-white">
                        {step}
                      </span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-4 text-sm leading-7 text-blue-100">
                Una sola vista para mantener control, continuidad y trazabilidad
                en todo el proceso documental.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-10%] top-[-8%] h-88 w-88 rounded-full bg-blue-100 blur-3xl" />
      <div className="absolute right-[-8%] top-[10%] h-80 w-[20rem] rounded-full bg-indigo-100 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[18%] h-72 w-[18rem] rounded-full bg-sky-100 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[84px_84px] opacity-50" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent" />
    </div>
  );
}