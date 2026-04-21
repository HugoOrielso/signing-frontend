import Image from 'next/image'
import React from 'react'

const HomeHeader = () => {
    return (
        <header className="flex items-center justify-center sticky top-0 z-20 bg-white/80 backdrop-blur-sm px-3 py-1">
            <div className='flex items-center justify-between w-full max-w-7xl'>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center">
                        <Image
                            src="/assets/logo_dimcultura.png"
                            width={55}
                            height={55}
                            alt="logo"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Dimcultura</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-blue-600/80">
                            Servicios Digitales
                        </p>
                    </div>
                </div>

                <div className="hidden items-center gap-2 rounded-full  text-sm text-slate-600  md:flex">
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                    >
                        <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                        Administración
                    </a>
                </div>
            </div>

        </header>
    )
}

export default HomeHeader