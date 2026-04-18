export function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-8%] top-[-10%] h-80 w-[20rem] rounded-full bg-blue-100 blur-3xl" />
      <div className="absolute right-[-8%] top-[8%] h-72 w-[18rem] rounded-full bg-indigo-100 blur-3xl" />
      <div className="absolute bottom-[-12%] left-[20%] h-64 w-[16rem] rounded-full bg-sky-100 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-size-[84px_84px] opacity-50" />
    </div>
  );
}

export function BackgroundSurface() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* retícula sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-size-[72px_72px] opacity-35" />

      {/* luces suaves, muy discretas */}
      <div className="absolute left-[-10%] top-[-8%] h-72 w-[18rem] rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute right-[-12%] top-[12%] h-64 w-[16rem] rounded-full bg-slate-200/70 blur-3xl" />
      <div className="absolute bottom-[-12%] left-[25%] h-56 w-56 rounded-full bg-white/80 blur-3xl" />

      {/* viñeta suave para profundidad */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_42%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.03),transparent_35%)]" />
    </div>
  );
}