import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthScreen from "@/components/contracts/auth/AuthScreen";

type Props = { params: Promise<{ token: string }> };

export default async function AuthPage({ params }: Props) {
  const { token } = await params;
  const session = await auth();

  if (session?.user?.email) {
    redirect(`/contracts/view/${token}`);
  }

  return <AuthScreen token={token} />;
}