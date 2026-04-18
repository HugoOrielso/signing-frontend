import CreateUserForm from "@/components/dashboard/users/CreateUserForm";
import { UserPlus } from "lucide-react";

export default async function CreateUserPage() {
  return (
    <div className="relative w-full overflow-hidden px-4 py-8 md:px-6 md:py-10">

      <div className="relative z-10 mx-auto flex w-full max-w-5xl justify-center">
        <div className="w-full max-w-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-700 to-blue-500 text-white shadow-[0_18px_40px_rgba(37,99,235,0.22)]">
              <UserPlus className="h-6 w-6" />
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-700/80">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Crear usuario
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Registra un nuevo usuario para acceder al panel administrativo de
              Dimcultura.
            </p>
          </div>

          <div className="rounded-[30px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <CreateUserForm />
          </div>
        </div>
      </div>
    </div>
  );
}

