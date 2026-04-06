"use client";

import Image from "next/image";

export default function AuthExpiredPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-linear-to-br from-blue-900 via-blue-800 to-blue-700">

      {/* HEADER */}
      <header className="w-full py-6 flex justify-center">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/logo.webp"
            alt="Dimcultura Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <div className="text-white text-lg font-semibold tracking-wide">
            Dimcultura S.A.S
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center space-y-5">

          {/* ICON */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-900 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🔒</span>
          </div>

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-gray-900">
            Sesión finalizada
          </h1>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-600 leading-relaxed">
            Tu sesión ha expirado o ya no es válida.
          </p>

          <p className="text-sm text-gray-600 leading-relaxed">
            Para acceder nuevamente, utiliza el enlace que te enviamos al correo que ingresaste previamente.
          </p>

          {/* EXTRA INFO */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900">
            Si no encuentras el mensaje, revisa tu carpeta de spam o correo no deseado.
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-blue-200 pb-6">
        Acceso seguro protegido por Dimcultura
      </footer>
    </div>
  );
}