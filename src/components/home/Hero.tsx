import React from 'react'
import { BuildingCanvas } from './BuildingCanvas'

const cardServices = [
    {
        title: "Libranzas Digitales",
        description: "Solicitudes, validaciones y seguimiento en un flujo claro para empleados afiliados.",
    },
    {
        title: "Proyectos Inmobiliarios",
        description: "Construcción residencial y comercial con respaldo documental integrado.",
    },
    {
        title: "Pagarés Electrónicos",
        description: "Creación, firma y consulta de pagarés con experiencia moderna.",
    },
];

const Hero = () => {
    return (
        <div className='flex w-full items-center justify-center'>
            <section className="max-w-6xl flex flex-1 items-center p-4">
                <div className="grid w-full items-start gap-8 lg:items-center lg:gap-14 lg:grid-cols-[1.15fr_0.85fr]">

                    {/* Columna izquierda */}
                    <div className="order-1 max-w-3xl">
                        <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] text-blue-700 shadow-sm backdrop-blur sm:mb-6 sm:px-4 sm:text-sm">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                            <span className="truncate">
                                Constructora · Libranzas · Gestión Documental
                            </span>
                        </div>

                        <h1 className="max-w-4xl text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                            Construimos tu futuro con{" "}
                            <span className="bg-linear-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                libranzas, proyectos
                            </span>{" "}
                            y gestión documental.
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
                            Dimcultura es una empresa constructora con servicios financieros
                            integrados: libranzas digitales, pagarés electrónicos y trazabilidad
                            documental para empleados y afiliados.
                        </p>

                        {/* Tags */}
                        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                            {[
                                { label: "Libranzas digitales", highlight: true },
                                { label: "Pagarés electrónicos", highlight: true },
                                { label: "Constructora", highlight: false },
                                { label: "Firma y trazabilidad", highlight: false },
                                { label: "Proyectos de vivienda", highlight: false },
                            ].map(({ label, highlight }) => (
                                <span
                                    key={label}
                                    className={`rounded-full border px-3 py-1.5 text-[11px] sm:text-xs ${highlight
                                        ? "border-blue-200 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-slate-50 text-slate-600"
                                        }`}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
                            <button className="w-full rounded-2xl bg-linear-to-r from-blue-700 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(37,99,235,0.22)] transition-transform duration-300 hover:scale-[1.02] sm:w-auto">
                                Ver servicios
                            </button>

                            <button className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-200 hover:text-blue-700 sm:w-auto">
                                Solicitar información
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha — card con modelo 3D */}
                    <div className="order-2 relative lg:order-2">
                        <div className="absolute -inset-4 rounded-[2rem] bg-blue-100/70 blur-2xl sm:-inset-6 lg:-inset-8 lg:blur-3xl" />

                        <div className="relative rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5 lg:rounded-[2rem] lg:shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500 sm:text-sm">Resumen</p>
                                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                                        Servicios principales
                                    </h2>
                                </div>

                                <div className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] text-blue-700 sm:text-xs">
                                    Activo
                                </div>
                            </div>

                            {/* Canvas 3D */}
                            <div className="relative mb-4 w-full overflow-hidden rounded-2xl bg-slate-950">

                                {/* ALTURA CONTROLADA */}
                                <div className="h-50 w-62.5 md:w-full sm:h-65 md:h-75 lg:h-80">
                                    <BuildingCanvas />
                                </div>

                                <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40">
                                    Arrastra para rotar
                                </div>

                                <div className="absolute right-2 top-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/50 backdrop-blur-sm">
                                    Small Building.glb
                                </div>
                            </div>

                            {/* Lista de servicios del card */}
                            <div className="space-y-3">
                                {cardServices.map((service) => (
                                    <div
                                        key={service.title}
                                        className="group rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(37,99,235,0.10)]"
                                    >
                                        <div className="mb-2 flex items-center gap-3">
                                            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-linear-to-r from-blue-600 to-cyan-400 shadow-[0_0_14px_rgba(59,130,246,0.4)]" />
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {service.title}
                                            </h3>
                                        </div>

                                        <p className="text-xs leading-6 text-slate-500 sm:text-[13px]">
                                            {service.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero