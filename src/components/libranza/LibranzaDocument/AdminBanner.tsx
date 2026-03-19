export function PublicContractAdminBanner() {
  return (
    <div
      style={{
        background: "#1e1b4b",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a5b4fc"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
      </svg>

      <p style={{ fontSize: 12, color: "#a5b4fc", margin: 0 }}>
        Vista de administrador — el panel de firma no está disponible en este modo.
      </p>
    </div>
  );
}