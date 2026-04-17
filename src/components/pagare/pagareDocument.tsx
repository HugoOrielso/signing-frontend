// import React from 'react'
// import { SignatureBlock } from './signaureBlock'
// import { formatCurrency, formatDateText, safeText } from './utils'

// const pagareDocument = ({ contract }: { contract: any }) => {
//     return (
//         <div>


//             <div className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800 md:grid-cols-2">
//                 <p>
//                     <span className="font-semibold">Pagaré No.:</span>{" "}
//                     {pagareNumber ?? safeText(contract.contractNumber || contract.id)}
//                 </p>
//                 <p>
//                     <span className="font-semibold">Lugar y fecha de suscripción:</span>{" "}
//                     {safeText(data.ciudad)}, {formatDateText(data.fecha)}
//                 </p>
//                 <p>
//                     <span className="font-semibold">Valor total:</span> {valorTotalLetras} (
//                     {formatCurrency(valorTotal)})
//                 </p>
//                 <p>
//                     <span className="font-semibold">Plazo:</span> {numeroCuotas} cuotas
//                     mensuales
//                 </p>
//                 <p>
//                     <span className="font-semibold">Interés corriente:</span>{" "}
//                     {interesCorriente}
//                 </p>
//                 <p>
//                     <span className="font-semibold">Interés de mora:</span> {interesMora}
//                 </p>
//                 <p>
//                     <span className="font-semibold">Acreedor:</span> {acreedorNombre}
//                 </p>
//                 <p>
//                     <span className="font-semibold">NIT acreedor:</span> {acreedorNit}
//                 </p>
//                 <p className="md:col-span-2">
//                     <span className="font-semibold">Lugar de pago:</span> {ciudadPago}
//                 </p>
//             </div>

//             <article className="mt-8 space-y-5 text-justify text-[15px] leading-7 text-neutral-900">
//                 <p>
//                     Yo, <strong>{safeText(data.clienteNombre)}</strong>, mayor de edad,
//                     identificado(a) con cédula de ciudadanía No.{" "}
//                     <strong>{safeText(data.clienteCC)}</strong> de{" "}
//                     <strong>{safeText(data.clienteCCDe)}</strong>, domiciliado(a) en{" "}
//                     <strong>{safeText(data.clienteDireccion)}</strong>, con número de
//                     contacto <strong>{safeText(data.clienteTelefono)}</strong> y correo
//                     electrónico <strong>{safeText(data.clienteEmail)}</strong>, actuando en
//                     calidad de <strong>DEUDOR</strong>, por medio del presente documento
//                     declaro:
//                 </p>

//                 <p>
//                     <strong>PRIMERO. OBJETO:</strong> Que pagaré incondicionalmente, de
//                     manera indivisible y a la orden de <strong>{acreedorNombre}</strong>, o
//                     de quien represente sus derechos, o de quien en el futuro ostente
//                     legítimamente la calidad de acreedor, la suma de{" "}
//                     <strong>{valorTotalLetras}</strong> ({formatCurrency(valorTotal)}),
//                     junto con los intereses corrientes y moratorios a que haya lugar, de
//                     conformidad con las condiciones aquí pactadas.
//                 </p>

//                 <p>
//                     <strong>SEGUNDO. INTERESES:</strong> Sobre la suma adeudada reconoceré
//                     intereses corrientes a la tasa de <strong>{interesCorriente}</strong>,
//                     sin que exceda la tasa máxima legal permitida. En caso de mora en el
//                     pago total o parcial de cualquiera de las cuotas pactadas, reconoceré
//                     intereses moratorios a la tasa de <strong>{interesMora}</strong>,
//                     liquidados sobre las sumas vencidas y no pagadas.
//                 </p>

//                 <p>
//                     <strong>TERCERO. PLAZO Y FORMA DE PAGO:</strong> La obligación
//                     contenida en este pagaré será pagada en <strong>{numeroCuotas}</strong>{" "}
//                     cuotas mensuales, iguales y sucesivas, cada una por valor de{" "}
//                     <strong>{valorCuotaLetras}</strong> ({formatCurrency(valorCuota)}). La
//                     primera cuota deberá pagarse a partir del mes de{" "}
//                     <strong>{safeText(data.mesCobro)}</strong> y las demás en forma mensual
//                     y consecutiva hasta la cancelación total de la obligación.
//                 </p>

//                 <p>
//                     <strong>CUARTO. RELACIÓN CON LA LIBRANZA:</strong> El presente pagaré
//                     respalda las obligaciones derivadas de la libranza y/o autorización de
//                     descuento suscrita por el deudor a favor de{" "}
//                     <strong>{acreedorNombre}</strong>. En consecuencia, el deudor reconoce
//                     que los pagos podrán ser recaudados mediante descuento de nómina
//                     conforme a la autorización otorgada de manera separada. La existencia de
//                     la libranza no limita, modifica ni reemplaza la fuerza ejecutiva del
//                     presente pagaré.
//                 </p>

//                 <p>
//                     <strong>QUINTO. MORA:</strong> El simple retardo en el pago de
//                     cualquiera de las cuotas pactadas constituirá en mora al deudor, sin
//                     necesidad de requerimiento judicial o extrajudicial, ni constitución en
//                     mora previa.
//                 </p>

//                 <p>
//                     <strong>SEXTO. CLÁUSULA ACELERATORIA:</strong> El tenedor legítimo de
//                     este pagaré podrá declarar vencido anticipadamente el plazo de todas las
//                     cuotas pendientes y exigir de inmediato el pago total de la obligación,
//                     judicial o extrajudicialmente, en cualquiera de los siguientes casos: a)
//                     cuando el deudor incurra en mora en el pago de una o más cuotas; b)
//                     cuando el deudor incumpla cualquiera de las obligaciones contenidas en
//                     este pagaré o en la libranza relacionada; c) cuando termine, se suspenda
//                     o se modifique la relación laboral o contractual que sirve de base al
//                     descuento por nómina; d) cuando los descuentos de nómina no puedan
//                     realizarse por cualquier causa; e) cuando se inicie proceso de
//                     insolvencia, embargo o persecución judicial de bienes del deudor; f) en
//                     los demás casos previstos en la ley.
//                 </p>

//                 <p>
//                     <strong>SÉPTIMO. PAGO DIRECTO EN AUSENCIA DE DESCUENTO:</strong> En caso
//                     de que por cualquier motivo no sea posible efectuar el descuento por
//                     nómina, el deudor se obliga a pagar directamente las cuotas pendientes
//                     en las fechas pactadas, sin que ello implique novación de la obligación
//                     ni modificación de las condiciones del presente pagaré.
//                 </p>

//                 <p>
//                     <strong>OCTAVO. GASTOS DE COBRANZA:</strong> Serán a cargo del deudor
//                     todos los gastos y costos que ocasione el cobro judicial o extrajudicial
//                     de la obligación, incluidos honorarios de abogado, costas, agencias en
//                     derecho, impuestos y demás erogaciones legalmente procedentes.
//                 </p>

//                 <p>
//                     <strong>NOVENO. CESIÓN Y ENDOSO:</strong> El acreedor queda expresamente
//                     facultado para ceder, negociar, endosar, transferir o enajenar a
//                     cualquier título el presente pagaré y los derechos incorporados en él,
//                     sin necesidad de notificación previa al deudor.
//                 </p>

//                 <p>
//                     <strong>DÉCIMO. AUTORIZACIÓN DE CONSULTA Y REPORTE:</strong> El deudor
//                     autoriza de manera expresa, previa, informada e irrevocable a{" "}
//                     <strong>{acreedorNombre}</strong>, o a quien represente sus derechos, o
//                     a quien en el futuro ostente la calidad de acreedor, para consultar,
//                     reportar, procesar, solicitar, actualizar, aclarar, retirar y divulgar
//                     ante operadores de información, centrales de riesgo y demás bases de
//                     datos legalmente autorizadas, toda la información referente al
//                     nacimiento, modificación, ejecución, cumplimiento, incumplimiento y
//                     extinción de las obligaciones a su cargo, en los términos de la ley
//                     aplicable.
//                 </p>

//                 <p>
//                     <strong>DÉCIMO PRIMERO. LUGAR DE CUMPLIMIENTO:</strong> Para todos los
//                     efectos legales, el lugar de cumplimiento de las obligaciones derivadas
//                     del presente pagaré será la ciudad de <strong>{ciudadPago}</strong>.
//                 </p>

//                 <p>
//                     <strong>DÉCIMO SEGUNDO. MÉRITO EJECUTIVO:</strong> El deudor reconoce
//                     expresamente que el presente documento presta mérito ejecutivo y contiene
//                     una obligación clara, expresa y exigible.
//                 </p>

//                 <p>
//                     <strong>DÉCIMO TERCERO. ACEPTACIÓN:</strong> Declaro que he leído,
//                     entendido y aceptado integralmente el contenido del presente pagaré, y
//                     que lo suscribo de manera libre y voluntaria.
//                 </p>

//                 <p>
//                     En constancia, se suscribe en <strong>{safeText(data.ciudad)}</strong> el
//                     día <strong>{formatDateText(data.fecha)}</strong>.
//                 </p>
//             </article>

//             <div className="mt-12 grid gap-10 md:grid-cols-2">
//                 <div>
//                     <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
//                         El deudor
//                     </h3>
//                     <SignatureBlock signer={deudorSigner} signature={deudorSignature} />
//                     <div className="mt-3 text-sm text-neutral-700">
//                         <p>
//                             <span className="font-medium">Nombre:</span>{" "}
//                             {safeText(data.clienteNombre)}
//                         </p>
//                         <p>
//                             <span className="font-medium">C.C.:</span> {safeText(data.clienteCC)}{" "}
//                             de {safeText(data.clienteCCDe)}
//                         </p>
//                     </div>
//                 </div>

//                 <div>
//                     <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
//                         El acreedor
//                     </h3>
//                     <SignatureBlock signer={acreedorSigner} signature={acreedorSignature} />
//                     <div className="mt-3 text-sm text-neutral-700">
//                         <p>
//                             <span className="font-medium">Razón social:</span> {acreedorNombre}
//                         </p>
//                         <p>
//                             <span className="font-medium">NIT:</span> {acreedorNit}
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default pagareDocument