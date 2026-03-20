import { fmtDate, signerIsSigned, signerSignedAt } from "@/lib/utils/libranzaHelper";
import { Contract } from "@/types/libranza";
import { BadgeCheck, Wallet } from "lucide-react";

export function InfoCard({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`rounded-xl border bg-background/80 p-4 shadow-sm ${className}`}>
            {children}
        </div>
    );
}

export function Section({
    title,
    icon,
}: {
    title: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 border-b pb-2">
            {icon}
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {title}
            </h3>
        </div>
    );
}

export function DetailRow({
    label,
    value,
    children,
}: {
    label: string;
    value?: string | null;
    children?: React.ReactNode;
}) {
    return (
        <div className="grid items-start gap-2 border-b py-3 last:border-b-0 md:grid-cols-[160px_minmax(0,1fr)] xl:grid-cols-[190px_minmax(0,1fr)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
            </span>

            {children ? (
                <div className="min-w-0">{children}</div>
            ) : (
                <span className="min-w-0 wrap-break-word text-[15px] font-medium text-foreground">
                    {value?.trim() ? value : '—'}
                </span>
            )}
        </div>
    );
}

export function SignerCard({ contract }: { contract: Contract }) {
    if (!contract.signers.length) return null;

    return (
        <InfoCard>
            <Section
                title="Firmantes"
                icon={<BadgeCheck className="h-4 w-4 text-muted-foreground" />}
            />

            <div className="mt-4 space-y-2">
                {contract.signers.map((s) => {
                    const signed = signerIsSigned(contract, s.id);

                    return (
                        <div
                            key={s.id}
                            className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{s.name}</p>
                                <p className="text-[11px] text-muted-foreground">
                                    {s.roleTitle || s.partyRole}
                                </p>
                            </div>

                            {signed ? (
                                <span className="shrink-0 text-[11px] font-semibold text-emerald-700">
                                    ✓ {fmtDate(signerSignedAt(contract, s.id))}
                                </span>
                            ) : (
                                <span className="shrink-0 text-[11px] font-medium text-amber-700">
                                    Pendiente
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </InfoCard>
    );
}

export function ProductsCard({ contract }: { contract: Contract }) {
    const productos = contract.libranzaData?.productos ?? [];
    if (!productos.length) return null;

    return (
        <InfoCard>
            <Section
                title="Productos / Servicios"
                icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            />

            <div className="mt-4 space-y-2">
                {productos.map((p, i) => (
                    <div
                        key={`${p.codigo}-${i}`}
                        className="grid gap-2 rounded-lg border bg-muted/20 px-3 py-3 md:grid-cols-[90px_minmax(0,1fr)_auto]"
                    >
                        <div className="text-xs font-mono text-muted-foreground">
                            {p.codigo || 'S/C'}
                        </div>
                        <div className="min-w-0 wrap-break-word text-sm font-medium">
                            {p.descripcion || '—'}
                        </div>
                        <div className="shrink-0 text-sm font-semibold">
                            {p.valor || '—'}
                        </div>
                    </div>
                ))}
            </div>
        </InfoCard>
    );
}