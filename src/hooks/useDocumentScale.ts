"use client";

import { useEffect, useRef, useState } from "react";

export function useDocumentScale() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const DOC_WIDTH = 794;   // ejemplo A4 render base
  const DOC_HEIGHT = 1123;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const containerWidth = el.clientWidth;

      // padding visual aproximado del contenedor
      const horizontalPadding = window.innerWidth < 640 ? 16 : 32;

      const availableWidth = containerWidth - horizontalPadding;

      const nextScale = availableWidth / DOC_WIDTH;

      // En móvil no lo dejes demasiado pequeño.
      // En desktop tampoco exageradamente grande.
      const clampedScale =
        window.innerWidth < 640
          ? Math.max(0.55, Math.min(nextScale, 0.9))
          : Math.max(0.75, Math.min(nextScale, 1));

      setScale(clampedScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(el);

    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return {
    containerRef,
    scale,
    DOC_WIDTH,
    DOC_HEIGHT,
  };
}