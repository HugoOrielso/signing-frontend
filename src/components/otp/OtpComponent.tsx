"use client"
import { useRef } from "react";
const INK = "#1a1a2e";
const GOLD = "#c9a84c";
const BORDER = "#d4c9b0";

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

        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {Array.from({ length: 6 }).map((_, i) => {
                const filled = !!(value[i] && value[i] !== " ");
                return (
                    <input key={i} ref={refs[i]} type="text" inputMode="numeric"
                        maxLength={1} disabled={disabled}
                        value={filled ? value[i] : ""}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKey(i, e)}
                        onPaste={handlePaste}
                        onClick={() => refs[i].current?.select()}
                        style={{
                            width: 46, height: 54, textAlign: "center",
                            fontSize: 24, fontWeight: 700, fontFamily: "monospace",
                            border: `2px solid ${filled ? GOLD : BORDER}`,
                            borderRadius: 10, outline: "none",
                            color: INK, background: filled ? "#fffdf5" : "white",
                            transition: "border-color 0.15s, background 0.15s",
                        }}
                    />
                );
            })}
        </div>
    )
}

export default OtpComponent