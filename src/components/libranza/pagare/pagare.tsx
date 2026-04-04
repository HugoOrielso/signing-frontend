"use client";

import React from "react";
import type {
    LibranzaDataPreview,
    LibranzaSignature,
    LibranzaSigner,
} from "@/types/libranza";
import Image from "next/image";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
    subsets: ["latin"],
    weight: "400",
});
interface PagarePreviewProps {
    data: LibranzaDataPreview;
    signers: LibranzaSigner[];
    signatures: LibranzaSignature[];
}

function F(value?: string | null) {
    return value?.trim() || "________________";
}

function FM(value?: string | null) {
    return value?.trim() || "________________";
}

function formatDate(value?: string | null) {
    if (!value) return "________________";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-CO");
}

function getPrimarySigner(signers: LibranzaSigner[]) {
    return signers.find((s) => s.partyRole === "CONTRACTOR") || signers[0] || null;
}

function getSignatureForSigner(
    signatures: LibranzaSignature[],
    signerId?: string
) {
    if (!signerId) return null;
    return signatures.find((s) => s.signerId === signerId) || null;
}

function U({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-block border-b border-zinc-700 px-1 leading-normal">
            {children}
        </span>
    );
}

function renderSignature(signature: LibranzaSignature | null) {
    if (!signature) {
        return (
            <div className="flex h-16 items-end justify-center border-b border-zinc-400 text-xs text-zinc-500">
                Espacio para firma
            </div>
        );
    }

    if (signature.type === "DRAWN" && signature.imageUrl) {
        return (
            <div className="flex h-16 items-center justify-center border-b border-zinc-400">
                <Image fill
                    src={signature.imageUrl}
                    alt="Firma"
                    className="max-h-12 object-contain"
                />
            </div>
        );
    }

    if (signature.type === "TYPED" && signature.typedValue) {
        return (
            <div className="flex h-16 items-end justify-center border-b border-zinc-400 pb-1">
                <span className={`${greatVibes.className} text-xl`}>
                    {signature.typedValue}
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-16 items-end justify-center border-b border-zinc-400 text-xs text-zinc-500">
            Espacio para firma
        </div>
    );
}

export default function PagarePreviewCompact({
    data,
    signers,
    signatures,
}: PagarePreviewProps) {
    const signer = getPrimarySigner(signers);
    const signature = getSignatureForSigner(signatures, signer?.id);

    return (
        <div className="mx-auto w-full max-w-3xl bg-white p-2 text-[11px] leading-6 text-zinc-800 shadow-sm rounded-sm border border-neutral-300">
            <div className="mb-5 text-center">
                <h1 className="text-xl font-bold uppercase">Pagaré</h1>
                <p className="mt-1 text-xs text-zinc-600">
                    Ciudad: <strong>{F(data.ciudad)}</strong> | Fecha:{" "}
                    <strong>{formatDate(data.fecha)}</strong>
                </p>
            </div>

            <div className=" text-justify">
                <p>
                    Yo <U>{F(data.clienteNombre)}</U>, identificado(a) con C.C.{" "}
                    <U>{F(data.clienteCC)}</U> de <U>{F(data.clienteCCDe)}</U>,
                    residente en <U>{F(data.clienteDireccion)}</U>, con número de
                    contacto <U>{F(data.clienteTelefono)}</U> y correo electrónico{" "}
                    <U>{F(data.clienteEmail)}</U>.
                </p>

                <p>
                    En mi calidad de funcionario(a) de <U>{F(data.clienteFuncionario)}</U>,
                    vinculado(a) desde hace <U>{F(data.clienteDesdeHace)}</U>, autorizo <b>Dimcultura S.A.S.</b>
                    para que descuente de mi salario o de
                    cualquier otro concepto la suma total de <U>{FM(data.sumaTotal)}</U>.
                </p>

                <p>
                    El valor anterior será recaudado en <U>{F(data.numeroCuotas)}</U>{" "}
                    cuotas mensuales consecutivas, por valor de{" "}
                    <U>{FM(data.valorCuota)}</U> cada una, a partir del mes de{" "}
                    <U>{F(data.mesCobro)}</U>, en el municipio de{" "}
                    <U>{F(data.municipioTrabajo)}</U>.
                </p>

                {(data.formaPago || data.banco || data.tipoCuenta || data.numeroCuenta) && (
                    <p>
                        Forma de pago: <U>{F(data.formaPago)}</U>.{" "}
                        {data.banco && (
                            <>
                                Banco: <U>{F(data.banco)}</U>.{" "}
                            </>
                        )}
                        {data.tipoCuenta && (
                            <>
                                Tipo de cuenta: <U>{F(data.tipoCuenta)}</U>.{" "}
                            </>
                        )}
                        {data.numeroCuenta && (
                            <>
                                Número de cuenta: <U>{F(data.numeroCuenta)}</U>.
                            </>
                        )}
                    </p>
                )}

                <p>
                    Declaro que conozco y acepto las condiciones de esta obligación y
                    autorizo expresamente los descuentos aquí indicados hasta cubrir el
                    valor total adeudado.
                </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-zinc-600">
                        Firma del deudor
                    </p>
                    {renderSignature(signature)}
                    <div className="mt-2 text-sm">
                        <p>
                            <strong>Nombre:</strong> {F(data.clienteNombre)}
                        </p>
                        <p>
                            <strong>C.C.:</strong> {F(data.clienteCC)}
                        </p>
                    </div>
                </div>

                <div >
                    <div className="rounded-lg border border-zinc-200 p-1 text-sm">

                        <p>
                            <strong>Total a pagar:</strong> {FM(data.sumaTotal)}
                        </p>
                        <p>
                            <strong>Número de cuotas:</strong> {F(data.numeroCuotas)}
                        </p>
                        <p>
                            <strong>Valor cuota:</strong> {FM(data.valorCuota)}
                        </p>
                        <p>
                            <strong>Inicio de cobro:</strong> {F(data.mesCobro)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}