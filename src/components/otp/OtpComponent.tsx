"use client"
import { useRef } from "react";
import React from 'react'

const OtpComponent = ({ value, onChange, disabled }: {
    value: string; onChange: (v: string) => void; disabled?: boolean;
}) => {

    const refs = [
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    ];

    function handleChange(i: number, v: string) {
        const digit = v.replace(/\D/g, "").slice(-1);
        const arr = value.padEnd(6, " ").split("");
        arr[i] = digit || " ";
        const next = arr.join("").trimEnd();
        onChange(next);
        if (digit && i < 5) refs[i + 1].current?.focus();
    }
    function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !value[i] && i > 0) {
            const arr = value.padEnd(6, " ").split("");
            arr[i - 1] = " ";
            onChange(arr.join("").trimEnd());
            refs[i - 1].current?.focus();
        }
    }
    function handlePaste(e: React.ClipboardEvent) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted) { onChange(pasted); refs[Math.min(pasted.length, 5)].current?.focus(); }
        e.preventDefault();
    }

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: 6 }).map((_, i) => {
                const filled = !!(value[i] && value[i] !== " ");
                return (
                    <input
                        key={i}
                        ref={refs[i]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        disabled={disabled}
                        value={filled ? value[i] : ""}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKey(i, e)}
                        onPaste={handlePaste}
                        onClick={() => refs[i].current?.select()}
                        className={`w-11.5 h-13.5 text-center text-2xl font-bold font-mono rounded-[10px] outline-none border-2 transition-[border-color,background] duration-150 text-ink
                            ${filled
                                ? "border-gold bg-[#fffdf5]"
                                : "border-border-soft bg-white"
                            }`}
                    />
                );
            })}
        </div>
    );
}

export default OtpComponent;