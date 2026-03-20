import { useLibranzaStore } from '@/store/libranzaStore';
const STEPS = [
    { n: 1, label: 'Datos' },
    { n: 2, label: 'Vista previa y envío' },
];
const LibranzaControlHeader = () => {
    const step = useLibranzaStore((state) => state.step);

    const setStep = useLibranzaStore((state) => state.setStep);

    const goStep = (n: number) => {
        setStep(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header className="flex min-h-[46.5px] items-center justify-between px-10">
            <div className="text-xl tracking-[1px] text-gold">
                <em>Crear nueva libranza</em>
            </div>

            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => {
                    const done = step > s.n;
                    const active = step === s.n;

                    return (
                        <div key={s.n} className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => done && goStep(s.n)}
                                disabled={!done}
                                className="flex items-center gap-2"
                            >
                                <div
                                    className={[
                                        'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold border-2',
                                        done
                                            ? 'border-transparent bg-linear-to-br from-gold to-gold-dark text-ink'
                                            : active
                                                ? 'border-gold bg-ink text-gold'
                                                : 'border-transparent bg-[#2d2d4e] text-[#5a5a7a]',
                                    ].join(' ')}
                                >
                                    {done ? '✓' : s.n}
                                </div>

                                <span
                                    className={[
                                        'text-xs',
                                        active
                                            ? 'font-semibold text-gold'
                                            : done
                                                ? 'text-gold-dark'
                                                : 'text-[#5a5a7a]',
                                    ].join(' ')}
                                >
                                    {s.label}
                                </span>
                            </button>

                            {i < STEPS.length - 1 && (
                                <div
                                    className={[
                                        'h-0.5 w-8',
                                        done ? 'bg-linear-to-r from-gold to-gold-dark' : 'bg-[#2d2d4e]',
                                    ].join(' ')}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </header>
    )
}

export default LibranzaControlHeader