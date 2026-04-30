import { BackgroundDecor } from "@/components/common/backgroudDecor";
import { Greeting } from "@/components/users/UserGreats";
import {
  FileText,
  PenLine,
  Eye,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    title: "Ver estado",
    description:
      "Consulta en tiempo real el estado de tus solicitudes y contratos.",
    icon: Eye,
  },
  {
    title: "Firmar documentos",
    description:
      "Firma tus contratos de forma rápida y segura desde cualquier dispositivo.",
    icon: PenLine,
  },
  {
    title: "Mis solicitudes",
    description:
      "Accede a todas tus solicitudes y revisa la información enviada.",
    icon: FileText,
  },
  {
    title: "Seguimiento",
    description:
      "Mantente informado sobre cada paso del proceso de tu contrato.",
    icon: Clock,
  },
];

export default function Page() {
  return (
    <div className="relative overflow-hidden p-6 md:p-10">
      <BackgroundDecor />

      <div className="relative z-10 space-y-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Portal de usuario
            </div>

            <div className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              <Greeting />
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Aquí podrás gestionar tus solicitudes, revisar el estado de tus
              contratos, firmar documentos de forma segura y hacer seguimiento
              en tiempo real.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                Acceso seguro
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                Firma digital
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                Seguimiento en línea
              </div>
            </div>
          </div>


        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                href="/users/contracts"
                key={item.title}
                className="group block rounded-[26px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(37,99,235,0.10)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Todo en un solo lugar
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Este espacio fue diseñado para que tengas el control total de tu
                proceso: desde la solicitud hasta la firma final. Sin papeleo,
                sin complicaciones y con información siempre disponible.
              </p>
            </div>

            <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Plataforma segura
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

