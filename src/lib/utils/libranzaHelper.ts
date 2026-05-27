import type { Contract, ContractStatus } from '@/types/libranza';

export function fmtDate(d?: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function fmtMoney(v?: number | null, currency?: string | null) {
  if (v == null) return '—';
  return `$${v.toLocaleString('es-CO', { minimumFractionDigits: 0 })} ${currency ?? 'COP'}`;
}

export function clientName(c: Contract): string {
  return (
    c.libranzaData?.clienteNombre ??
    c.parties.find((p) => p.role === 'CONTRACTED')?.name ??
    '—'
  );
}

export function clientCC(c: Contract): string {
  return (
    c.libranzaData?.clienteCC ??
    c.parties.find((p) => p.role === 'CONTRACTED')?.identification ??
    '—'
  );
}

export function clientPhone(c: Contract): string | null {
  return (
    c.libranzaData?.clienteTelefono ??
    c.parties.find((p) => p.role === 'CONTRACTED')?.phone ??
    null
  );
}

export function contractValue(c: Contract): string {
  const ld = c.libranzaData;

  if (ld?.sumaTotal) {
    const n = Number(ld.sumaTotal);

    return Number.isNaN(n)
      ? ld.sumaTotal.toString()
      : `$${n.toLocaleString("es-CO")}`;
  }

  return fmtMoney(c.amount, c.currency);
}

export function signedCount(c: Contract): [number, number] {
  const total = c.signers.length;
  const signed = c.signers.filter((s) =>
    c.signatures.some((sig) => sig.signerId === s.id)
  ).length;

  return [signed, total];
}

export function signerSignedAt(c: Contract, signerId: string): string | null {
  return c.signatures.find((sig) => sig.signerId === signerId)?.signedAt ?? null;
}

export function signerIsSigned(c: Contract, signerId: string): boolean {
  return c.signatures.some((sig) => sig.signerId === signerId);
}

export function displayStatus(c: Contract): ContractStatus {
  const [signed, total] = signedCount(c);

  if (c.status === 'SIGNED') return 'SIGNED';

  if (c.status === 'PARTIALLY_SIGNED') return 'PARTIALLY_SIGNED';

  if (total > 1 && signed > 0 && signed < total) {
    return 'PARTIALLY_SIGNED';
  }

  return c.status as ContractStatus;
}

export function publicUrl(token?: string | null): string | null {
  if (!token) return null;

  const base =
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  return `${base}/contracts/sign/${token}`;
}


export function publicUrlAdmin(token?: string | null): string | null {
  if (!token) return null;

  const base =
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  return `${base}/contracts/view/${token}`;
}