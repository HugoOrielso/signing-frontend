export function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function safeText(value?: string | null, fallback = "________________") {
  return value?.trim() ? value : fallback;
}

export function formatDateText(value?: string | null) {
  return value?.trim() ? value : "________________";
}

export function formatDateTimeText(value?: string | null) {
  if (!value) return "Fecha no disponible";
  return new Date(value).toLocaleString("es-CO");
}

export function numberToSpanishWords(value?: number | null) {
  if (!value) return "CERO PESOS";
  return `${formatCurrency(value).replace("$", "").trim()} PESOS M/CTE`;
}
