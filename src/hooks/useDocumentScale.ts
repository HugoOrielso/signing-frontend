// hooks/useDocumentScale.ts
import { useEffect, useRef, useState } from 'react';

const DOC_WIDTH = 816;  // 8.5in a 96dpi
const DOC_HEIGHT = 1056; // 11in a 96dpi

export function useDocumentScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      const availableHeight = entry.contentRect.height;

      const scaleX = availableWidth / DOC_WIDTH;
      const scaleY = availableHeight / DOC_HEIGHT;

      // Usa el menor para que quepa completo
      setScale(Math.min(scaleX, scaleY, 1)); // max 1 = no agrandar
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return { containerRef, scale, DOC_WIDTH, DOC_HEIGHT };
}