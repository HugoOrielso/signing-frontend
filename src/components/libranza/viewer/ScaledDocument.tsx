"use client";

import { useDocumentScale } from "@/hooks/useDocumentScale";

interface Props {
  children: React.ReactNode;
}

export function ScaledDocumentViewer({ children }: Props) {
  const { containerRef, scale, DOC_WIDTH, DOC_HEIGHT } = useDocumentScale();

  const scaledWidth = DOC_WIDTH * scale;
  const scaledHeight = DOC_HEIGHT * scale;

  return (
    <div
      ref={containerRef}
      className="
        w-full
        overflow-x-auto
        overflow-y-hidden
        bg-neutral-200
        px-2 py-3
        sm:px-4 sm:py-4
        md:px-6 md:py-8
      "
    >
      <div
        className="mx-auto flex justify-center"
        style={{
          minWidth: scaledWidth,
          minHeight: scaledHeight,
        }}
      >
        <div
          style={{
            width: scaledWidth,
            height: scaledHeight,
            position: "relative",
          }}
        >
          <div
            className="bg-white shadow-xl rounded-lg border border-neutral-300"
            style={{
              width: DOC_WIDTH,
              height: DOC_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}