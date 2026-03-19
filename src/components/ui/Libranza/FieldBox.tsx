import React from "react";

interface Props {
  w?: number;
  children?: React.ReactNode;
}

export function FieldBox({ w = 70, children }: Props) {
  return (
    <span
      style={{
        border: "1px solid #000",
        display: "inline-block",
        padding: "0 3px",
        minWidth: w,
        lineHeight: 1.4,
        verticalAlign: "bottom",
      }}
    >
      {children ?? "\u00a0"}
    </span>
  );
}