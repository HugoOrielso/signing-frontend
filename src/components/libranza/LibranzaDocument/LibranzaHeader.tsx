"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { F } from "@/lib/formatters/formaters";
import { LibranzaDataPreview } from "@/types/libranza";
import { Separator } from "@/components/ui/common/separator";

type Empresa = "dimcultura" | "gruculcol";

const empresaConfig: Record<Empresa, {
  logo: string;
  nombre: string;
  subtitulo: string;
  slogan: string;
  nit: string;
  email: string;
  web: string;
}> = {
  dimcultura: {
    logo: "/assets/logo.webp",
    nombre: "Dimcultura S.A.S.",
    subtitulo: "Nueva Dimensión Cultural",
    slogan: "Un mundo en el que debes estar",
    nit: "900.683.382-3",
    email: "servicioalcliente@dimcultura.com",
    web: "www.dimcultura.com",
  },
  gruculcol: {
    logo: "/assets/gruculcol.webp",
    nombre: "GRUCULCOL",
    subtitulo: "Grupo Cultural Colombiano",
    slogan: "Educación sin fronteras",
    nit: "27.898.189-5",
    email: "servicioalcliente@dimcultura.com",
    web: "www.dimcultura.com",
  },
};

const DEFAULT_EMPRESA: Empresa = "dimcultura";

function getEmpresaFromPath(pathname: string): Empresa {
  const segment = pathname.split("/").pop()?.toLowerCase() as Empresa;
  return segment in empresaConfig ? segment : DEFAULT_EMPRESA;
}

interface Props {
  data: LibranzaDataPreview;
}

export function LibranzaHeader({ data }: Props) {
  const pathname = usePathname();
  const empresa = getEmpresaFromPath(pathname);
  const config = empresaConfig[empresa];

  return (
    <>
      <div className="mb-2 flex items-start justify-between">
        <div className="flex w-18 shrink-0 items-center justify-center">
          <Image
            src={config.logo}
            alt={`Logo ${config.nombre}`}
            width={58}
            height={58}
            className="h-auto w-auto object-contain"
          />
        </div>

        <div className="mx-3 flex-1 text-center leading-tight text-black">
          <p className="text-[11px] font-semibold tracking-[0.02em]">
            {config.subtitulo}
          </p>
          <h1 className="text-[18px] font-extrabold uppercase tracking-[0.03em]">
            {config.nombre}
          </h1>
          <p className="text-[8px] italic text-neutral-700">
            &quot;{config.slogan}&quot;
          </p>
          <p className="mt-0.5 text-[7px] font-medium text-neutral-800">
            Nit. {config.nit} · Tel. 310 207 98 00 / 311 861 01 61
          </p>
        </div>

        <div className="rounded-sm border border-neutral-400 bg-white p-1 text-[8px] text-black">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="min-w-9.5 font-bold">CIUDAD:</span>
            <span className="flex-1 border-b border-neutral-400 pb-px">
              {F(data.ciudad)}
            </span>
          </div>

          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="min-w-9.5 font-bold">ASESOR:</span>
            <span className="flex-1 border-b border-neutral-400 pb-px">
              {F(data.asesor)}
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 text-[9px]">
            <div className="flex gap-1.5">
              <span className="min-w-9.5 font-bold">Fecha:</span>
              <span>
                {new Date().toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className="font-extrabold tracking-wide text-ink">
              LIBRANZA
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="py-1 text-center text-[7px] leading-tight text-neutral-800">
        Sede Administrativa: Calle 24 No. 5-40 Conjunto Los Ángeles Barrio Gran
        Colombia Casa G1 Villa del Rosario Col. Lote 1 Barrio El Country Tel.
        6512857{" "}
        <strong className="font-semibold text-black">
          {config.email} · {config.web}
        </strong>
      </div>

      <Separator />
    </>
  );
}