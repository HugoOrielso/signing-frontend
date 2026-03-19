import { CSSProperties } from "react";
import { INK } from "./constanst";

export const TH: CSSProperties = {
  padding: "3px 6px",
  border: "1px solid #000",
  fontWeight: 700,
  fontSize: 8,
  textAlign: "left",
  background: INK,
  color: "white",
};

export const TD: CSSProperties = {
  padding: "3px 6px",
  border: "1px solid #ddd",
  fontSize: 8,
  height: 18,
};