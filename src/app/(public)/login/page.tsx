import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session && !session.error) redirect("/dashboard");

  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h1>
        <LoginForm expiredError={error === "SessionExpired"} />
      </div>
    </div>
  );
}