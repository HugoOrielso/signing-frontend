import { Contract } from "@/types/libranza";
import { Wallet } from "lucide-react";
import { InfoCard, Section } from "./atoms";

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