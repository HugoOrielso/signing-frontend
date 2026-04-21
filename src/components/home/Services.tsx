import React from 'react'
import { CanvasLines } from './backgoundLines'
function BackgroundDetails() {
    return (
        <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[88px_88px] opacity-60" />
            <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-blue-200 to-transparent" />
        </div>
    );
}
function SoftAurora() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-8%] top-[-8%] h-96 w-96 animate-pulse rounded-full bg-blue-200/50 blur-3xl" />
            <div className="absolute right-[-10%] top-[8%] h-80 w-96 animate-pulse rounded-full bg-indigo-200/45 blur-3xl" />
            <div className="absolute bottom-[-12%] left-[22%] h-80 w-80 animate-pulse rounded-full bg-sky-100/70 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.09),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_24%)]" />
        </div>
    );
}
const iconColors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600",
};

const services = [
    {
        title: "Libranzas Digitales",
        description:
            "Gestiona solicitudes, validaciones y seguimiento de libranzas en un flujo claro, ágil y profesional.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 12h6M9 16h4" />
            </svg>
        ),
        color: "blue",
    },
    {
        title: "Proyectos de Construcción",
        description:
            "Vivienda residencial y obras comerciales respaldadas con gestión documental integrada.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        color: "indigo",
    },
    {
        title: "Pagarés Electrónicos",
        description:
            "Centraliza la creación, firma y consulta de pagarés con una experiencia moderna y organizada.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6M9 15l3 3 3-3" />
            </svg>
        ),
        color: "teal",
    },
    {
        title: "Firma y Trazabilidad",
        description:
            "Cada proceso queda registrado con control visual, estados claros y respaldo documental.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        color: "amber",
    },
];

const Services = () => {
    return (
        <div className="relative  overflow-hidden bg-white text-slate-900">
            <CanvasLines />
            <SoftAurora />
            <BackgroundDetails />

            <main className="relative z-10 mx-auto max-w-6xl flex-col p-4">
                {/* ── Separador ── */}
                <div className="mb-16 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

                {/* ── Grid de servicios ── */}
                <section className="mb-20">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Todo lo que ofrecemos
                    </div>
                    <div className="mb-10 flex items-end justify-between">
                        <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                            Una plataforma,{" "}
                            <span className="bg-linear-to-r from-blue-700 to-indigo-500 bg-clip-text text-transparent">
                                múltiples soluciones
                            </span>
                        </h2>
                        <button className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-blue-200 hover:text-blue-700 md:block">
                            Ver todos los servicios →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map((svc) => (
                            <div
                                key={svc.title}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(37,99,235,0.09)]"
                            >
                                <div
                                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconColors[svc.color]}`}
                                >
                                    {svc.icon}
                                </div>
                                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                                    {svc.title}
                                </h3>
                                <p className="text-xs leading-6 text-slate-500">
                                    {svc.description}
                                </p>
                                <span className="mt-4 block text-xs font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    Conocer más →
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA final ── */}
                <section className="mb-10 overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-indigo-50 px-8 py-12 text-center shadow-[0_20px_60px_rgba(37,99,235,0.07)]">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                        Empieza hoy
                    </div>
                    <h2 className="mx-auto mb-4 max-w-xl text-2xl font-semibold text-slate-900 md:text-3xl">
                        ¿Listo para gestionar tus libranzas o conocer nuestros proyectos?
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-slate-500">
                        Contáctanos y un asesor te guiará en el proceso, sin filas, sin papel
                        y sin complicaciones.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="rounded-2xl bg-linear-to-r from-blue-700 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(37,99,235,0.25)] transition-transform hover:scale-[1.02]">
                            Solicitar asesoría
                        </button>
                        <button className="rounded-2xl border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700">
                            Ver proyectos de vivienda
                        </button>
                    </div>
                </section>

            </main>
        </div>
    )
}

export default Services