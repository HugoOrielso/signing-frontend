export function PublicContractLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Cargando contrato…</p>
      </div>
    </div>
  );
}