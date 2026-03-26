"use client";

import api from "@/lib/axiosClient";
import { AuditTrailResponse } from "@/types/auditTrail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Hash,
  Clock3,
  FileText,
  Activity,
} from "lucide-react";

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
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">Cargando trazabilidad...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">No hay datos de trazabilidad.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* HERO / RESUMEN */}
      <section className="rounded-[28px] bg-linear-to-br from-slate-50 to-white p-6 md:p-8 shadow-sm ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-slate-500">
              Trazabilidad del contrato
            </p>

            <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {data.contract.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Estado:</span>
                <span>{data.contract.status}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                <FileText className="h-4 w-4 text-violet-600" />
                <span className="font-medium">Tipo:</span>
                <span>{data.contract.contractType ?? "-"}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
                <Hash className="h-4 w-4 text-slate-500" />
                <span className="font-medium">Nº:</span>
                <span>{data.contract.contractNumber ?? "-"}</span>
              </div>
            </div>
          </div>

          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ring-1 ${
                data.verification.valid
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-red-200"
              }`}
            >
              {data.verification.valid ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
              {data.verification.valid
                ? "Integridad válida"
                : "Integridad inválida"}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total eventos
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {data.summary.totalEvents}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Primer evento
            </p>
            <div className="mt-2 flex items-center gap-2 text-slate-700">
              <Clock3 className="h-4 w-4 text-blue-600" />
              <p className="text-sm md:text-base">
                {data.summary.firstEventAt
                  ? new Date(data.summary.firstEventAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Hash final
            </p>
            <p className="mt-2 break-all font-mono text-xs text-slate-700">
              {data.summary.lastEventHash ?? "-"}
            </p>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="rounded-[28px] bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-200/70">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Línea de tiempo</h2>
            <p className="mt-1 text-sm text-slate-500">
              Historial completo de eventos del contrato
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
            {data.events.length} eventos
          </span>
        </div>

        <div className="max-h-175 space-y-5 overflow-y-auto pr-2">
          {data.events.map((event, index) => {
            const isLast = index === data.events.length - 1;

            return (
              <div key={event.id} className="relative pl-12">
                {!isLast && (
                  <div className="absolute left-3.75 top-10 h-[calc(100%+12px)] w-px bg-slate-200" />
                )}

                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                  {index + 1}
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition hover:bg-white hover:shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {event.eventType}
                      </p>

                      <div className="mt-3 grid gap-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium text-slate-700">Actor:</span>{" "}
                          {event.actorType}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Email:</span>{" "}
                          {event.actorEmail ?? "-"}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">IP:</span>{" "}
                          {event.ipAddress ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-xs font-medium text-slate-500">
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <details className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <summary className="cursor-pointer list-none text-sm font-medium text-blue-700">
                      Ver detalles técnicos
                    </summary>

                    <div className="mt-4 space-y-3 text-sm text-slate-700">
                      <div>
                        <p className="font-medium text-slate-900">Hash del evento</p>
                        <p className="mt-1 break-all font-mono text-xs text-slate-600">
                          {event.eventHash}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">Hash previo</p>
                        <p className="mt-1 break-all font-mono text-xs text-slate-600">
                          {event.previousEventHash ?? "-"}
                        </p>
                      </div>

                      {event.documentHash && (
                        <div>
                          <p className="font-medium text-slate-900">Hash del documento</p>
                          <p className="mt-1 break-all font-mono text-xs text-slate-600">
                            {event.documentHash}
                          </p>
                        </div>
                      )}

                      {event.metadata && (
                        <div>
                          <p className="font-medium text-slate-900">Metadata</p>
                          <pre className="mt-2 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        </div>
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