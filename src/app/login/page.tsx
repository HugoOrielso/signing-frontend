import LoginForm from "@/components/auth/LoginForm";
import { BackgroundDecor } from "@/components/common/backgroudDecor";

export default async function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <BackgroundDecor />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-700 to-blue-500 shadow-[0_18px_40px_rgba(37,99,235,0.22)]">
              <span className="text-lg font-bold text-white">D</span>
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.25em] text-blue-700/80">
              Dimcultura
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Administración
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Accede a la plataforma para gestionar libranzas, pagarés y procesos
              documentales.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

