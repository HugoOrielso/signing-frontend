import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <header className="relative z-20">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <Link href={"/"} className="flex items-center gap-3">
                    <Image
                        src="/assets/logo_dimcultura.png"
                        alt="Dimcultura"
                        width={60}
                        height={60}
                        className="w-auto object-contain"
                    />
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
                    <a className="text-blue-400" href="#">
                        Inicio
                    </a>
                    <a className="hover:text-blue-400" href="#">
                        Cursos
                    </a>
                    <a className="hover:text-blue-400" href="#">
                        Plataforma
                    </a>
                    <a className="hover:text-blue-400" href="#">
                        Beneficios
                    </a>
                    <a className="hover:text-blue-400" href="#">
                        Nosotros
                    </a>
                    <a className="hover:text-blue-400" href="#">
                        Contacto
                    </a>
                </nav>

                <div className="hidden gap-3 md:flex">
                    <Link href="/auth" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold backdrop-blur-md transition hover:bg-white/10 cursor-pointer">
                        Portal de usuario
                    </Link>

                    <Link href="/login" className="rounded-xl cursor-pointer bg-blue-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-600/30 transition hover:bg-blue-700">
                        Portal administrativo
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header