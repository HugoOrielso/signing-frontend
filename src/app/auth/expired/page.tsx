"use client";

import Link from "next/link";
import { ShieldX } from "lucide-react";
import { BackgroundSurface } from "@/components/common/backgroudDecor";
import Image from "next/image";

export default function AuthExpiredPage() {
  return (
    <div className="relative min-h-dvh flex flex-col bg-slate-50 overflow-hidden">
      <BackgroundSurface />

      {/* HEADER */}
      <header className="relative z-10 w-full py-6 flex justify-center">
        <div className="flex items-center gap-3">
          <Image src={"/assets/logo_dimcultura.png"} alt="logo" width={100} height={100}/>
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
              <p>Tu sesión ha expirado o ya no es válida.</p>

              <p>
                Para continuar con el acceso a tu contrato, inicia sesión
                nuevamente de forma segura.
              </p>
            </div>

            {/* BUTTON */}
            <Link
              href="/auth"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:bg-blue-800 hover:shadow-[0_18px_38px_rgba(37,99,235,0.35)]"
            >
              Iniciar sesión nuevamente
            </Link>

            {/* INFO BOX */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-xs text-blue-700">
              Usaremos tus datos de acceso para verificar tu identidad y
              permitirte continuar con el proceso.
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