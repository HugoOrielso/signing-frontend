import React from "react";

interface Props {
  w?: number;
  children?: React.ReactNode;
}

export function FieldUnderline({ w = 80, children }: Props) {
  return (
    <span
      style={{
        borderBottom: "1px solid #000",
        display: "inline-block",
        minWidth: w,
        padding: "0 2px",
        lineHeight: 1.3,
        verticalAlign: "bottom",
      }}
    >
      {children ?? "\u00a0"}
    </span>
  );
}