// src/app/contracts/auth/[token]/page.tsx

import AuthScreen from "@/components/contracts/auth/AuthScreen";

type Props = { params: Promise<{ token: string }> };

export default async function AuthPage({ params }: Props) {
  const { token } = await params;
  return <AuthScreen token={token} />;
}