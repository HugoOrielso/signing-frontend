"use client";

import { ShieldX } from "lucide-react";
import { BackgroundSurface } from "@/components/common/backgroudDecor";

export default function AuthExpiredPage() {
  return (
    <div className="relative min-h-dvh flex flex-col bg-slate-50 overflow-hidden">

      <BackgroundSurface />

      {/* HEADER */}
      <header className="relative z-10 w-full py-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-[0_12px_25px_rgba(37,99,235,0.25)]">
            <span className="font-bold text-sm">D</span>
          </div>

          <div className="text-slate-900 text-lg font-semibold tracking-wide">
            Dimcultura
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl space-y-6">

            {/* ICON */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-sm">
              <ShieldX className="h-7 w-7" />
            </div>

            {/* TITLE */}
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Sesión finalizada
            </h1>

            {/* DESCRIPTION */}
            <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
              <p>
                Tu sesión ha expirado o ya no es válida.
              </p>

              <p>
                Para acceder nuevamente, utiliza el enlace que te enviamos al correo que ingresaste previamente.
              </p>
            </div>

            {/* INFO BOX */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-xs text-blue-700">
              Si no encuentras el mensaje, revisa tu carpeta de spam o correo no deseado.
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-xs text-slate-500 pb-6">
        Acceso seguro protegido por Dimcultura
      </footer>
    </div>
  );
}