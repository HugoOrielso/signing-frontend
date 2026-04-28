"use client";

import { useState } from "react";
import { Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axiosClient";
import { useParams } from "next/navigation";


export function TakeLibranzaButton() {
    const [loading, setLoading] = useState(false);
    const { id } = useParams<{ id: string }>();
    const handleTakeLibranza = async () => {
        try {
            setLoading(true);

            const res = await api.patch(`/contracts/contract/${id}/take`);

            toast.success(res.data.message || "Libranza tomada correctamente");

            setTimeout(() => {
                location.reload();
            }, 500);
        } catch {
            toast.error("No se pudo tomar la libranza");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleTakeLibranza}
            disabled={loading}
            className="p-1 cursor-pointer text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
        >
            {loading ? (
                <Loader2 className=" animate-spin" />
            ) : (
                <UserCheck className="h-4 w-4" />
            )}

            {loading ? "Tomando..." : "Tomar libranza"}
        </button>
    );
}