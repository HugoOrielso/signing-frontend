import React from "react";

interface Props {
  w?: number;
  children?: React.ReactNode;
}

export function FieldUnderline({ children }: Props) {
  return (
    <span
      style={{
        borderBottom: "1px solid #000",
        padding: "0 2px",
        verticalAlign: "bottom",
      }}
    >
      {children ?? "\u00a0"}
    </span>
  );
}