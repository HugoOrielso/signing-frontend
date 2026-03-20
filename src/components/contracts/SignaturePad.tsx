"use client";

import { ConfirmSignModal } from "./ConfirmSignModal";
import { useEffect, useRef, useState } from "react";

type SignatureType = "DRAWN" | "TYPED";
type TabType = "draw" | "type";

type CanvasEvent =
    | React.MouseEvent<HTMLCanvasElement>
    | React.TouchEvent<HTMLCanvasElement>;

export function SignaturePad({
    onSave,
    disabled,
}: {
    onSave: (t: SignatureType, d: string) => void;
    disabled?: boolean;
}) {
    const [tab, setTab] = useState<TabType>("draw");
    const [typed, setTyped] = useState("");
    const [hasDrawn, setDrawn] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawing = useRef({
        active: false,
        lastX: 0,
        lastY: 0,
    });

    const [pending, setPending] = useState<{
        type: SignatureType;
        data: string;
    } | null>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;

        ctx.strokeStyle = "#1a1a2e";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }, []);

    function getPos(canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) {
        const rect = canvas.getBoundingClientRect();

        if ("touches" in e) {
            const touch = e.touches[0] ?? e.changedTouches[0];
            return {
                x: ((touch.clientX - rect.left) * canvas.width) / rect.width,
                y: ((touch.clientY - rect.top) * canvas.height) / rect.height,
            };
        }

        return {
            x: ((e.clientX - rect.left) * canvas.width) / rect.width,
            y: ((e.clientY - rect.top) * canvas.height) / rect.height,
        };
    }

    const down = (e: CanvasEvent) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const pos = getPos(canvas, e.nativeEvent);

        drawing.current = {
            active: true,
            lastX: pos.x,
            lastY: pos.y,
        };

        setDrawn(true);
    };

    const move = (e: CanvasEvent) => {
        e.preventDefault();

        if (!drawing.current.active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pos = getPos(canvas, e.nativeEvent);

        ctx.beginPath();
        ctx.moveTo(drawing.current.lastX, drawing.current.lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        drawing.current.lastX = pos.x;
        drawing.current.lastY = pos.y;
    };

    const stop = () => {
        drawing.current.active = false;
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setDrawn(false);
    };

    function requestDrawn() {
        const canvas = canvasRef.current;
        if (!canvas || !hasDrawn) return;

        setPending({
            type: "DRAWN",
            data: canvas.toDataURL("image/png"),
        });
    }

    function requestTyped() {
        if (!typed.trim()) return;

        setPending({
            type: "TYPED",
            data: typed.trim(),
        });
    }

    return (
        <>
            <div>

                <div className="flex w-fit overflow-hidden border border-borderSoft rounded-lg mb-4">

                    {(["draw", "type"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            disabled={disabled}
                            className={` px-5 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${tab === t ? "bg-ink text-gold" : "bg-white text-muted"}`}>
                            {t === "draw" ? "✏️ Dibujar" : "⌨️ Escribir"}
                        </button>
                    ))}
                </div>

                {/* DRAW TAB */}

                {tab === "draw" && (
                    <div>

                        <div className="relative overflow-hidden border-2 border-dashed border-borderSoft rounded-xl bg-cream">

                            <canvas
                                ref={canvasRef}
                                width={600}
                                height={140}
                                className="block w-full h-35 touch-none"
                                onMouseDown={disabled ? undefined : down}
                                onMouseMove={disabled ? undefined : move}
                                onMouseUp={stop}
                                onMouseLeave={stop}
                                onTouchStart={disabled ? undefined : down}
                                onTouchMove={disabled ? undefined : move}
                                onTouchEnd={stop}
                            />

                            {!hasDrawn && (
                                <p className="absolute text-sm text-borderSoft top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                                    ← Firma aquí con el mouse o el dedo
                                </p>
                            )}

                        </div>

                        <div className="flex justify-end gap-2 mt-3">

                            <button
                                onClick={clear}
                                disabled={disabled}
                                className="px-3 py-1 text-xs text-muted"
                            >
                                Limpiar
                            </button>

                            <button
                                onClick={requestDrawn}
                                disabled={disabled || !hasDrawn}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold
                bg-ink text-gold
                ${!hasDrawn ? "opacity-40" : ""}
                `}
                            >
                                ✓ Firmar con este trazo
                            </button>

                        </div>

                    </div>
                )}

                {/* TYPE TAB */}

                {tab === "type" && (
                    <div>

                        <div className="p-5 border border-borderSoft rounded-xl bg-cream">

                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-3">
                                Escribe tu nombre completo
                            </label>

                            <input
                                type="text"
                                placeholder="Tu nombre..."
                                value={typed}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setTyped(e.target.value)
                                }
                                disabled={disabled}
                                className="w-full bg-transparent border-b-2 border-gold outline-none px-1 py-2 text-[30px] text-ink"
                                style={{
                                    fontFamily: "Dancing Script, cursive",
                                }}
                            />

                            {typed && (
                                <div
                                    className="mt-4 pb-2 border-b border-borderSoft text-[40px] text-ink"
                                    style={{
                                        fontFamily: "Dancing Script, cursive",
                                    }}
                                >
                                    {typed}
                                </div>
                            )}

                        </div>

                        <div className="flex justify-end mt-3">

                            <button
                                onClick={requestTyped}
                                disabled={disabled || !typed.trim()}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold
                bg-ink text-gold
                ${!typed.trim() ? "opacity-40" : ""}
                `}
                            >
                                ✓ Usar esta firma
                            </button>

                        </div>

                    </div>
                )}

            </div>

            {pending && (
                <ConfirmSignModal
                    signerName={typed || "Firmante"}
                    onConfirm={() => {
                        onSave(pending.type, pending.data);
                        setPending(null);
                    }}
                    onCancel={() => setPending(null)}
                    confirming={!!disabled}
                />
            )}
        </>
    );
}