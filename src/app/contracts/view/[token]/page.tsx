// src/app/contracts/view/[token]/page.tsx
import { auth } from "@/lib/auth";
import PublicContractView from "./PublicContractView";

type Props = { params: Promise<{ token: string }> };

export default async function ViewPage({ params }: Props) {
  const { token } = await params;
  const session   = await auth();
  const isAdmin   = !!session?.user?.email;

  return <PublicContractView token={token} pageMode="view" isAdmin={isAdmin} />;
}