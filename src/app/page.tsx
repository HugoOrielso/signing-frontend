import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Administración</h1>
        <LoginForm />
      </div>
    </div>
  );
}