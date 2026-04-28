import React, { useState } from "react";
import api from "@/lib/axiosClient";
import { toast } from "sonner";
import { useParams } from "next/navigation";


const CancelLibranza = () => {
    const { id } = useParams<{ id: string }>();
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCancel = async () => {
        try {
            setLoading(true);

            await api.delete(`/contracts/contract/${id}/cancel`);
            toast.success("Libranza cancelada correctamente");
            setShowConfirm(false);
            setTimeout(() => {
                location.reload();
            }, 500);
        } catch (error) {
            console.error(error);
            toast.error("Error al cancelar la libranza");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Botón principal */}
            <button
                onClick={() => setShowConfirm(true)}
                className="p-1 cursor-pointer text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
                Anular libranza
            </button>

            {/* Modal */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            ¿Estás seguro de anular esta libranza?
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Esta acción no se puede deshacer.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border rounded cursor-pointer"
                                disabled={loading}
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
                                disabled={loading}
                            >
                                {loading ? "Anulando..." : "Sí, anular"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CancelLibranza;