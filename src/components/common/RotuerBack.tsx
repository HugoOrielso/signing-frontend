"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-xl border bg-white/60 p-1 cursor-pointer text-sm text-slate-700 shadow-sm transition hover:bg-white"
    >
      <ArrowLeft className="h-4 w-4" />
      Volver
    </button>
  );
}