import publicApi from "@/lib/axiosPublicClient";
import { GOLD, INK } from "@/lib/constanst";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadButton({ token }: { token: string }) {
    const [downloading, setDownloading] = useState(false);
    async function handleDownload() {
        setDownloading(true);
        try {
            const response = await publicApi.get(`/contracts/public/${token}/download`,
                { responseType: "blob" });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `libranza-${token.slice(0, 8)}.pdf`;
            document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message ?? "No se pudo descargar el PDF");
        } finally { setDownloading(false); }
    }
    return (
        <button onClick={handleDownload} disabled={downloading} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: downloading ? "#2d2d4e" : INK,
            color: GOLD, fontSize: 13, fontWeight: 600,
            cursor: downloading ? "not-allowed" : "pointer",
            flexShrink: 0, transition: "all 0.2s",
        }}>
            {downloading ? (
                <><div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: `2px solid ${GOLD}`, borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite"
                }} /> Generando PDF…</>
            ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg> Descargar PDF</>
            )}
        </button>
    );
}