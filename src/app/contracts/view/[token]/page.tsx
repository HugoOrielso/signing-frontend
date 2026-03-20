// src/app/contracts/view/[token]/page.tsx
import PublicContractView from "@/components/libranza/LibranzaView/LibranzaView";
import { auth } from "@/lib/auth";

type Props = { params: Promise<{ token: string }> };

export default async function ViewPage({ params }: Props) {
  const { token } = await params;
  const session   = await auth();
  const isAdmin   = !!session?.user?.email;

  return <PublicContractView token={token} pageMode="view" isAdmin={isAdmin} />;
}