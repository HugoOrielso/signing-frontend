"use client";

import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Laptop,
  LineChart,
  Star,
  Users,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import EducationSlider from "@/components/home/slider";
import Link from "next/link";

const categories = [
  {
    title: "Académicos",
    text: "Basados en tesis, documentos y material educativo.",
    icon: BookOpen,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Tecnológicos",
    text: "Herramientas digitales, procesos y formación moderna.",
    icon: Laptop,
    color: "from-purple-500 to-violet-700",
  },
  {
    title: "Profesionales",
    text: "Capacitación práctica para crecer y aplicar lo aprendido.",
    icon: BriefcaseBusiness,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    title: "Investigación",
    text: "Metodologías, análisis y recursos para tus proyectos.",
    icon: LineChart,
    color: "from-orange-400 to-orange-600",
  },
  {
    title: "Humanidades",
    text: "Pensamiento crítico, cultura y desarrollo personal.",
    icon: Users,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    title: "Idiomas",
    text: "Aprende nuevos idiomas de manera práctica.",
    icon: Globe2,
    color: "from-pink-400 to-pink-600",
  },
];

export default function DimculturaLanding() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden text-white">
        {/* Fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/education.png"
            alt="Educación Dimcultura"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/70 to-slate-900/25" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-slate-950/40" />
        </div>

        {/* Luces decorativas */}
        <div className="absolute -left-20 top-40 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-0 bottom-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

        {/* Header */}
        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logo_dimcultura.png"
                alt="Dimcultura"
                width={150}
                height={150}
                className="h-16 w-auto object-contain"
              />
            </div>

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

        {/* Contenido Hero */}
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <GraduationCap size={17} />
              Plataforma educativa
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Un mundo en el que{" "}
              <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                debes estar
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-100 md:text-xl">
              Aprende, organiza y transforma la información de tus documentos,
              tesis y procesos en cursos claros, útiles y profesionales.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold shadow-xl shadow-blue-700/30 transition hover:-translate-y-1 hover:bg-blue-700">
                Explorar cursos
                <ArrowRight size={20} />
              </button>

              <button className="rounded-xl border border-white/30 px-7 py-4 font-bold backdrop-blur-md transition hover:bg-white/10">
                Conocer más
              </button>
            </div>
          </div>

          {/* Card flotante */}
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-5">
              <HeroFeature
                icon={BookOpen}
                title="Tesis"
                text="Extraemos información clave y la convertimos en conocimiento útil."
                color="from-blue-500 to-blue-700"
              />

              <HeroFeature
                icon={Laptop}
                title="Tecnología"
                text="Cursos digitales y modernos para impulsar tu crecimiento."
                color="from-purple-500 to-purple-700"
              />

              <HeroFeature
                icon={GraduationCap}
                title="Formación práctica"
                text="Convertimos contenido académico en aprendizaje fácil de entender."
                color="from-emerald-400 to-emerald-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="text-sm font-black uppercase tracking-wider text-blue-600">
              Aprende sin límites
            </span>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Cursos para cada etapa de tu crecimiento
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Explora áreas diseñadas para potenciar tus habilidades, tu
              conocimiento y tu futuro.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-lg`}
                  >
                    <Icon size={30} />
                  </div>

                  <h3 className="text-lg font-black">{item.title}</h3>

                  <p className="mt-3 min-h-16 text-sm leading-relaxed text-slate-600">
                    {item.text}
                  </p>

                  <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                    Ver cursos
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 rounded-3xl bg-slate-950 px-8 py-10 text-white shadow-2xl md:grid-cols-4">
            <Stat icon={Users} value="25K+" label="Estudiantes" />
            <Stat icon={GraduationCap} value="1.2K+" label="Cursos disponibles" />
            <Stat icon={BookOpen} value="3.5K+" label="Recursos educativos" />
            <Stat icon={Star} value="4.9/5" label="Calificación promedio" />
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="relative overflow-hidden bg-white pb-28">
        <div className="absolute right-0 top-10 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/classroom.jpg"
                alt="Cursos Dimcultura"
                width={900}
                height={650}
                className="h-105 w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-8 left-8 rounded-2xl bg-white p-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <p className="font-black">Contenido</p>
                  <p className="text-sm text-slate-500">de calidad</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-sm font-black uppercase tracking-wider text-blue-600">
              Nuestra misión
            </span>

            <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
              Conocimiento que{" "}
              <span className="text-blue-600">transforma vidas</span>
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              En Dimcultura convertimos información académica en aprendizaje
              real. Creamos cursos basados en tesis, investigaciones y
              experiencias profesionales para que aprendas de verdad.
            </p>

            <div className="mt-8 space-y-4">
              <Check text="Contenido basado en información real y confiable" />
              <Check text="Cursos diseñados por expertos en cada área" />
              <Check text="Aprendizaje práctico, claro y aplicable" />
            </div>

            <button className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-700">
              Conoce más sobre nosotros
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/education.jpg"
            alt="Educación"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="text-sm font-black uppercase tracking-wider text-blue-400">
            ¿Cómo funciona?
          </span>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Aprende en 3 simples pasos
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              title="Explora"
              text="Encuentra cursos, áreas de conocimiento y recursos útiles."
            />
            <Step
              number="02"
              title="Aprende"
              text="Accede a contenidos claros, ordenados y fáciles de seguir."
            />
            <Step
              number="03"
              title="Aplica"
              text="Transforma lo aprendido en resultados reales para tu vida o trabajo."
            />
          </div>
        </div>
      </section>


      <EducationSlider/>
    </main>
  );
}

function HeroFeature({
  icon: Icon,
  title,
  text,
  color,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <div className="flex gap-5 rounded-2xl p-4 transition hover:bg-white/10">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${color} shadow-lg`}
      >
        <Icon size={32} />
      </div>

      <div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-200">{text}</p>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 border-white/10 md:border-r last:md:border-r-0">
      <Icon size={42} className="text-blue-500" />
      <div>
        <p className="text-3xl font-black">{value}</p>
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
}

function Check({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="text-blue-600" size={22} />
      <span className="font-medium text-slate-700">{text}</span>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-left backdrop-blur-md transition hover:-translate-y-2 hover:bg-white/15">
      <span className="text-5xl font-black text-blue-500">{number}</span>
      <h3 className="mt-6 text-2xl font-black">{title}</h3>
      <p className="mt-3 leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}