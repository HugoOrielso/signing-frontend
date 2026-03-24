import CreateUserForm from "@/components/dashboard/users/CreateUserForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateUserPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <div className="max-w-md w-full mx-auto mt-10 p-6 bg-white dark:bg-[#0A0A0A] rounded-2xl shadow border border-gray-200 dark:border-white/10">
        <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Crear usuario
        </h1>
        <CreateUserForm />
      </div>
    </div>
  );
}