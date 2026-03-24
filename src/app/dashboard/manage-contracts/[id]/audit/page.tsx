"use client";

import api from "@/lib/axiosClient";
import { AuditTrailResponse } from "@/types/auditTrail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function AuditTrailView() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<AuditTrailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function getContractAuditTrail(contractId: string) {
    const res = await api.get(`/contracts/${contractId}/audit-trail`);
    return res.data;
  }
  useEffect(() => {
    if (!id) return;

    let cancelled = false;


    getContractAuditTrail(id)
      .then((data) => {
        if (!cancelled) setData(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-border-soft p-6">
        Cargando trazabilidad...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl border border-border-soft p-6">
        No hay datos de trazabilidad
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3">

      {/* RESUMEN */}

      <section className="rounded-3xl border border-blue-200 bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <p className="text-sm text-ink opacity-70">
              Trazabilidad del contrato
            </p>

            <h1 className="text-xl font-semibold text-ink">
              {data.contract.title}
            </h1>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <span className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                Estado: {data.contract.status}
              </span>

              <span className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                Tipo: {data.contract.contractType ?? "-"}
              </span>

              <span className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                Nº: {data.contract.contractNumber ?? "-"}
              </span>

            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${data.verification.valid
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
              }`}
          >
            {data.verification.valid ? "Integridad válida" : "Integridad inválida"}
          </div>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs opacity-70">Total eventos</p>
            <p className="text-lg font-semibold text-ink">
              {data.summary.totalEvents}
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs opacity-70">Primer evento</p>
            <p className="text-sm text-ink">
              {data.summary.firstEventAt
                ? new Date(data.summary.firstEventAt).toLocaleString()
                : "-"}
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs opacity-70">Hash final</p>
            <p className="text-sm break-all text-ink">
              {data.summary.lastEventHash ?? "-"}
            </p>
          </div>

        </div>

      </section>

      {/* TIMELINE */}

      <section className="rounded-3xl border border-blue-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold text-main">
            Línea de tiempo
          </h2>

          <span className="text-sm opacity-70">
            {data.events.length} eventos
          </span>

        </div>

        {/* SCROLL INTERNO */}

        <div className="max-h-130 overflow-y-auto pr-2 space-y-3">

          {data.events.map((event, index) => {

            const isLast = index === data.events.length - 1;

            return (
              <div key={event.id} className="relative pl-8">

                {!isLast && (
                  <div className="absolute left-2.75 top-6 h-full w-0.5 bg-main opacity-20" />
                )}

                {/* ICONO */}

                <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-white text-xs font-bold shadow-md">
                  {index + 1}
                </div>

                {/* EVENTO */}

                <div className="rounded-xl border border-main bg-white p-3 text-sm">

                  <div className="flex items-center justify-between">

                    <p className="font-semibold text-main">
                      {event.eventType}
                    </p>

                    <span className="text-xs opacity-60">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>

                  </div>

                  <div className="mt-1 text-xs space-y-1">

                    <p>Actor: {event.actorType}</p>

                    <p>Email: {event.actorEmail ?? "-"}</p>

                    <p>IP: {event.ipAddress ?? "-"}</p>

                  </div>

                  {/* DETALLES TECNICOS */}

                  <details className="mt-2 text-xs">

                    <summary className="cursor-pointer text-main">
                      detalles técnicos
                    </summary>

                    <div className="mt-2 space-y-1">

                      <p>Hash: {event.eventHash}</p>

                      <p>Prev: {event.previousEventHash ?? "-"}</p>

                      {event.documentHash && (
                        <p>Doc hash: {event.documentHash}</p>
                      )}

                      {event.metadata && (
                        <pre className="mt-2 overflow-auto rounded bg-neutral-100 p-2 text-xs">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      )}

                    </div>

                  </details>

                </div>

              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
}