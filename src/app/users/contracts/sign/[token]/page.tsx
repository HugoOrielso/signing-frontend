import PublicContractView from "@/components/libranza/LibranzaView/LibranzaView";

type Props = { params: Promise<{ token: string }> };

export default async function SignPage({ params }: Props) {
  const { token } = await params;

  return <PublicContractView token={token} pageMode="sign" />;
}