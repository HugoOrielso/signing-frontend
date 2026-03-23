export function PublicContractError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center max-w-90 p-8">
        <div className="text-[40px] mb-4">⚠️</div>
        <h2 className="font-serif text-[22px] text-ink mb-2">
          Enlace no válido
        </h2>
        <p className="text-sm text-muted">Contrato no encontrado</p>
      </div>
    </div>
  );
} 