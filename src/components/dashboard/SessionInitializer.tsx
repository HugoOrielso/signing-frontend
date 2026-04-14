"use client";

import { useSessionStore } from "@/store/adminSession";
import { useEffect } from "react";

export default function SessionInitializer() {
  const fetchSession = useSessionStore((s) => s.fetchSession);

  useEffect(() => {
      fetchSession();
  }, [fetchSession]);

  return null;
}