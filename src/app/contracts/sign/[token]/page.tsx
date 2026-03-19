// src/app/contracts/sign/[token]/page.tsx
import { auth } from "@/lib/auth";
import PublicContractView from "../../view/[token]/PublicContractView";

type Props = { params: Promise<{ token: string }> };

export default async function SignPage({ params }: Props) {
  const { token } = await params;
  const session   = await auth();
  const isAdmin   = !!session?.user?.email;

  return <PublicContractView token={token} pageMode="sign" isAdmin={isAdmin} />;
}