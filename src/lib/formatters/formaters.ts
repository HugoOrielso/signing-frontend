export const F = (v?: string | null) => v?.trim() || "\u00a0";

export const FM = (v?: string | null) =>
  v?.trim()
    ? `$${parseFloat(v.replace(/[^0-9.]/g, "")).toLocaleString("es-CO", {
        minimumFractionDigits: 2,
      })}`
    : "$\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0";

export const formatMoney = (value: number) =>
  `$${value.toLocaleString("es-CO", { minimumFractionDigits: 2 })}`;