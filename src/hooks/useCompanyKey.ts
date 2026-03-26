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

export function getEmpresaFromPath(pathname: string): Empresa {
  const segment = pathname.split("/").pop()?.toLowerCase() as Empresa;
  return segment in empresaConfig ? segment : DEFAULT_EMPRESA;
}