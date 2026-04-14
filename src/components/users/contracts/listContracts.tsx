"use client";

import Link from "next/link";
import {
  FileText,
  CalendarDays,
  BadgeDollarSign,
  AlertCircle,
} from "lucide-react";
import { ContractStatus, ContractSummary } from "@/types/libranza";
import { DEFAULT_STATUS_META, STATUS_META, StatusMeta, TOTAL_STEPS } from "@/lib/utils/userContract";
type UserContractsListProps = {
  contracts: ContractSummary[];
  loading?: boolean;
};

function getStatusMeta(status: ContractStatus): StatusMeta {
  return STATUS_META[status] ?? DEFAULT_STATUS_META;
}

function getProgressWidth(step: number): string {
  if (step <= 0) return "0%";
  return `${(step / TOTAL_STEPS) * 100}%`;
}

function formatCurrency(value: string | number | null, currency = "COP"): string {
  if (value === null || value === undefined) return "No disponible";
  const numberValue = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numberValue)) return "No disponible";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numberValue);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}




function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <FileText className="h-7 w-7 text-slate-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        Aún no tienes contratos disponibles
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Cuando haya documentos asociados a tu proceso, podrás verlos aquí,
        revisar su estado y completar la firma si es necesario.
      </p>
    </div>
  );
}

function ContractCard({ contract }: { contract: ContractSummary }) {
  const statusMeta = getStatusMeta(contract.status);
  const StatusIcon = statusMeta.icon;
  const dataReviewStatus = contract.dataReviewStatus === "REJECTED" && contract.status === "PENDING_VERIFICATION"
  return (
    <article
      className={`rounded-3xl border p-5 shadow-sm transition hover:shadow-md ${dataReviewStatus ? '"border-red-200 bg-red-50 ' : statusMeta.cardClassName ?? "bg-white border-slate-200"}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Libranza - {contract.consecutivo || "Contrato"}
            </h3>
            <div className="flex items-center gap-2">

              {
                dataReviewStatus ?
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-sm border p-1 text-xs font-medium bg-red-100 text-red-700`}
                    >

                      <AlertCircle className="h-4 w-4" />
                      Datos rechazados
                    </span>

                    <a href="#" className="inline-flex items-center gap-2 rounded-sm border p-1 text-xs font-medium bg-red-100 text-red-700">
                      Ir a editar datos
                    </a>
                  </div>
                  :
                  <span
                    className={`inline-flex items-center gap-2 rounded-sm border p-1 text-xs font-medium ${statusMeta.className}`}
                  >

                    <StatusIcon className="h-4 w-4" />
                    {statusMeta.label}
                  </span>
              }


              <div className="flex flex-wrap gap-2">
                {statusMeta.action && contract.token && (
                  <Link
                    href={statusMeta.action.href(contract.token)}
                    className="inline-flex items-center gap-2 rounded-sm bg-black p-1 text-xs font-medium text-white transition hover:bg-slate-800"
                  >

                    <statusMeta.action.icon className="h-4 w-4" />
                    <span>
                      {statusMeta.action.label}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>


          {
            dataReviewStatus ? 
            <p className="mt-3 text-sm ">Los datos fueron rechazados por favor revisa el formulario inicial.</p>
            :
            <p className="mt-3 text-sm ">{statusMeta.description}</p>

          }

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs ">
              <span>Progreso del proceso</span>
              <span>{statusMeta.label}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusMeta.progressClassName ?? "bg-slate-900"}`}
                style={{ width: getProgressWidth(statusMeta.step) }}
              >
                <div className="h-full w-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>


      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm ">
            <BadgeDollarSign className="h-4 w-4" />
            Valor
          </div>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {formatCurrency(contract.amount, contract.currency ?? "COP")}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm ">
            <CalendarDays className="h-4 w-4" />
            Fecha de creación
          </div>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {formatDate(contract.createdAt)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm ">
            <FileText className="h-4 w-4" />
            Última actualización
          </div>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {formatDate(contract.updatedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}


export function UserContractsList({
  contracts,
}: UserContractsListProps) {
  if (!contracts.length) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}