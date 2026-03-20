import React from "react";

interface Props {
  w?: number;
  children?: React.ReactNode;
}

export function FieldBox({children }: Props) {
  return (
    <span
      style={{
        border: "1px solid #000",
        padding: "0 2px",
      }}
    >
      {children ?? "\u00a0"}
    </span>
  );
}