// components/libranza/ScaledDocumentViewer.tsx
'use client';

import { useDocumentScale } from '@/hooks/useDocumentScale';

interface Props {
  children: React.ReactNode;
}

export function ScaledDocumentViewer({ children }: Props) {
  const { containerRef, scale, DOC_WIDTH, DOC_HEIGHT } = useDocumentScale();

  return (
    // Contenedor exterior — ocupa el espacio disponible
    <div
      ref={containerRef}
      className="w-full overflow-hidden bg-neutral-300 p-4 md:p-8"
      // La altura del contenedor se adapta al doc escalado
      style={{ minHeight: DOC_HEIGHT * scale + 64 }}
    >
      {/* Centrador */}
      <div className="flex justify-center items-start">
        {/* Caja que ocupa el espacio "real" del doc escalado */}
        <div
          style={{
            width: DOC_WIDTH * scale,
            height: DOC_HEIGHT * scale,
            position: 'relative',
          }}
        >
          {/* El doc en tamaño real, escalado desde la esquina superior izquierda */}
          <div
            style={{
              width: DOC_WIDTH,
              height: DOC_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            className="bg-white shadow-2xl rounded-sm border border-neutral-300"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}