"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:py-6">
        <Link href="/" className="flex min-w-0 items-center">
          <Image
            src="/assets/logo_dimcultura.png"
            alt="Dimcultura"
            width={100}
            height={100}
            priority
            className="h-auto w-20 object-contain sm:w-24 md:w-28"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          <a className="text-blue-400" href="#">Inicio</a>
          <a className="hover:text-blue-400" href="#">Cursos</a>
          <a className="hover:text-blue-400" href="#">Plataforma</a>
          <a className="hover:text-blue-400" href="#">Beneficios</a>
          <a className="hover:text-blue-400" href="#">Nosotros</a>
          <a className="hover:text-blue-400" href="#">Contacto</a>
        </nav>

        <div className="hidden shrink-0 gap-3 md:flex">
          <Link
            href="/auth"
            className="rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold backdrop-blur-md transition hover:bg-white/10"
          >
            Portal de usuario
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
          >
            Portal administrativo
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 backdrop-blur-md md:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mx-4 rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">
          <nav className="grid gap-1 text-sm font-semibold">
            {["Inicio", "Cursos", "Plataforma", "Beneficios", "Nosotros", "Contacto"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-white/85 hover:bg-white/10 hover:text-blue-400"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          <div className="mt-4 grid gap-3">
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-white/30 px-5 py-3 text-center text-sm font-semibold backdrop-blur-md transition hover:bg-white/10"
            >
              Portal de usuario
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
            >
              Portal administrativo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;