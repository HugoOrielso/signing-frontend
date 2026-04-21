import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <footer className=" flex items-center justify-center bg-white text-slate-500">
            <div className="flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 md:flex-row">
                <div className="flex items-center gap-2">
                    <Image
                        src="/assets/logo_dimcultura.png"
                        width={28}
                        height={28}
                        alt="logo"
                    />
                    <span>© {new Date().getFullYear()} Dimcultura — Todos los derechos reservados</span>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="transition hover:text-blue-600">Privacidad</a>
                    <a href="#" className="transition hover:text-blue-600">Términos</a>
                    <a href="/login" className="transition hover:text-blue-600">Administración</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer