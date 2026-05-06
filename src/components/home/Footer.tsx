import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] ">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
            
            <div>
              <Image
                width={30} height={30}
                src="/assets/logo_dimcultura.png"
                alt="Dimcultura"
                className="mb-4 h-20 w-auto rounded-xl bg-white p-2"
              />

              <p className="max-w-md text-sm leading-7 text-slate-300">
                Plataforma educativa y administrativa para la gestión de
                procesos, cursos y servicios de Dimcultura.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                Contacto
              </h3>

              <div className="space-y-3 text-sm text-slate-300">
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  contacto@dimcultura.com
                </p>

                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  +57 300 000 0000
                </p>

                <p className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  Colombia
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-300">
                Síguenos
              </h3>

              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/15 transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <Instagram className="h-5 w-5" />
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/15 transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <Facebook className="h-5 w-5" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/15 transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Dimcultura. Todos los derechos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}