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
        <header className="flex items-center justify-between p-2">
            <div className="text-xl tracking-[1px] text-main">
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
                                            ? 'border bg-linear-to-br from-green-500 to-green-600 text-white'
                                            : active
                                                ? ' bg-main text-white'
                                                : 'border bg-white ',
                                    ].join(' ')}
                                >
                                    {done ? '✓' : s.n}
                                </div>

                                <span
                                    className={[
                                        'text-xs',
                                        active
                                            ? 'font-semibold text-main'
                                            : done
                                                ? 'text-green-500'
                                                : 'text-main',
                                    ].join(' ')}
                                >
                                    {s.label}
                                </span>
                            </button>

                            {i < STEPS.length - 1 && (
                                <div
                                    className={[
                                        'h-0.5 w-8',
                                        done ? 'bg-gray-500' : 'bg-[#2d2d4e]',
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