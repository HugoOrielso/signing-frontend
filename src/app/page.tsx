import Image from "next/image";

export default function DimculturaServicesLanding() {
  const services = [
    {
      title: "Libranzas Digitales",
      description:
        "Gestiona solicitudes, validaciones y seguimiento de libranzas en un flujo claro, ágil y profesional.",
    },
    {
      title: "Pagarés Electrónicos",
      description:
        "Centraliza la creación, firma y consulta de pagarés con una experiencia moderna y organizada.",
    },
    {
      title: "Firma y Trazabilidad",
      description:
        "Cada proceso queda registrado con control visual, estados claros y respaldo documental.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <CanvasLines />
      <SoftAurora />
      <BackgroundDetails />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 md:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-linear-to-br from-blue-600 to-indigo-600 shadow-[0_16px_40px_rgba(37,99,235,0.18)]">
              <Image src={"/assets/logo.webp"} width={45} height={45} alt="logo" />
              {/* <span className="text-lg font-bold tracking-wide text-white">D</span> */}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Dimcultura</p>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-600/80">
                Servicios Digitales
              </p>
            </div>
          </div>

          <div className="hidden  rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur md:flex items-center gap-2">
            <p>
              Plataforma moderna para gestión documental
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
            >
              <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></span>
              Administración
            </a>
          </div>
        </header>

        <section className="flex flex-1 items-center py-16 md:py-24">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 shadow-sm backdrop-blur">
                Soluciones claras, seguras y visuales
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
                Servicios digitales para <span className="bg-linear-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent">libranzas, pagarés</span> y procesos documentales.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                Una landing pequeña, limpia y elegante para presentar lo esencial de Dimcultura:
                procesos organizados, experiencia visual moderna y una comunicación clara de los servicios.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button className="rounded-2xl bg-linear-to-r from-blue-700 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(37,99,235,0.22)] transition-transform duration-300 hover:scale-[1.02]">
                  Ver servicios
                </button>
                <button className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:text-blue-700">
                  Solicitar información
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[2rem] bg-blue-100/70 blur-3xl" />
              <div className="relative rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Resumen</p>
                    <h2 className="text-xl font-semibold text-slate-900">Servicios principales</h2>
                  </div>
                  <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
                    Activo
                  </div>
                </div>

                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div
                      key={service.title}
                      className="group rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(37,99,235,0.10)]"
                      style={{ animationDelay: `${index * 120}ms` }}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_14px_rgba(59,130,246,0.4)]" />
                        <h3 className="text-base font-semibold text-slate-900">{service.title}</h3>
                      </div>
                      <p className="text-sm leading-7 text-slate-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SoftAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-8%] top-[-8%] h-112 w-md rounded-full bg-blue-200/50 blur-3xl animate-pulse" />
      <div className="absolute right-[-10%] top-[8%] h-96 w-[24rem] rounded-full bg-indigo-200/45 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-12%] left-[22%] h-88 w-88 rounded-full bg-sky-100/70 blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.09),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_24%)]" />
    </div>
  );
}

function BackgroundDetails() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[88px_88px] opacity-60" />
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent" />
    </div>
  );
}

function CanvasLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 650C127 586 244 605 411 542C578 479 597 378 796 355C995 332 1095 423 1270 373C1370 344 1458 285 1520 242"
          stroke="url(#paint0_linear)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-[dash_12s_linear_infinite]"
          strokeDasharray="8 14"
        />
        <path
          d="M-60 710C128 681 265 726 447 666C629 606 697 486 873 472C1050 458 1124 557 1308 520C1411 499 1497 428 1550 396"
          stroke="url(#paint1_linear)"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="animate-[dash_16s_linear_infinite]"
          strokeDasharray="10 18"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(37,99,235,0)" />
            <stop offset="0.35" stopColor="rgba(37,99,235,0.45)" />
            <stop offset="0.7" stopColor="rgba(99,102,241,0.35)" />
            <stop offset="1" stopColor="rgba(37,99,235,0)" />
          </linearGradient>
          <linearGradient id="paint1_linear" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(14,165,233,0)" />
            <stop offset="0.45" stopColor="rgba(14,165,233,0.28)" />
            <stop offset="0.75" stopColor="rgba(59,130,246,0.22)" />
            <stop offset="1" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
        </defs>
      </svg>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -120;
          }
        }
      `}</style>
    </div>
  );
}
