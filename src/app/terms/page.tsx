import { Footer } from "@/components/home/Footer";
import Header from "@/components/home/Header";

export default function TermsAndConditionsPage() {
  const sections = [
    {
      title: "Aceptación de los términos",
      text: `Al acceder, consultar, cargar información, validar identidad, aceptar documentos o firmar electrónicamente a través de esta plataforma, el usuario declara haber leído, entendido y aceptado estos términos y condiciones.`,
    },
    {
      title: "Identificación del usuario",
      text: `El usuario declara que la información suministrada es veraz, completa, actualizada y corresponde a su identidad real. Cualquier uso de datos falsos, incompletos o de terceros sin autorización será responsabilidad exclusiva del usuario.`,
    },
    {
      title: "Validez jurídica de los mensajes de datos",
      text: `Las partes reconocen que los documentos electrónicos, mensajes de datos, registros digitales, comprobantes de aceptación, evidencias tecnológicas y comunicaciones generadas en esta plataforma podrán tener validez jurídica y fuerza probatoria conforme a la normativa colombiana aplicable, especialmente la Ley 527 de 1999.`,
    },
    {
      title: "Firma electrónica",
      text: `El usuario acepta que la firma realizada mediante esta plataforma podrá efectuarse a través de mecanismos electrónicos como códigos OTP, validación por correo electrónico, número celular, aceptación expresa, trazabilidad técnica, dirección IP, fecha, hora, dispositivo, validación documental, biometría o cualquier otro mecanismo razonable de autenticación.`,
      extra: `De acuerdo con la Ley 527 de 1999 y el Decreto 2364 de 2012, la firma electrónica podrá ser usada para identificar al firmante y vincularlo con el contenido del documento firmado, siempre que el mecanismo utilizado permita acreditar su confiabilidad, autenticidad e integridad.`,
    },
    {
      title: "Consentimiento expreso",
      text: `Al marcar la casilla de aceptación, hacer clic en “Firmar”, ingresar un código de verificación, dibujar una firma, escribir su nombre como firma o completar cualquier acción equivalente, el usuario manifiesta su consentimiento libre, previo, expreso e informado para suscribir electrónicamente el documento correspondiente.`,
    },
    {
      title: "Fuerza vinculante",
      text: `El usuario reconoce que la firma electrónica realizada en esta plataforma produce efectos jurídicos vinculantes para las partes y que el documento firmado electrónicamente podrá ser exigible en los mismos términos que un documento suscrito físicamente, según la legislación colombiana aplicable.`,
    },
    {
      title: "Evidencias electrónicas",
      text: `Para efectos de seguridad, auditoría, trazabilidad y prueba, la plataforma podrá conservar evidencias electrónicas asociadas al proceso de firma, incluyendo, entre otras: fecha y hora de acceso, fecha y hora de firma, dirección IP, navegador, dispositivo, correo electrónico, número celular, código OTP, estado del documento, historial de visualización, aceptación de términos y registros técnicos relacionados.`,
    },
    {
      title: "Integridad del documento",
      text: `Una vez firmado electrónicamente, el documento podrá ser almacenado con mecanismos de control que permitan verificar su integridad, evitar alteraciones no autorizadas y conservar evidencia del contenido aceptado por el usuario al momento de la firma.`,
    },
    {
      title: "Responsabilidad del usuario",
      text: `El usuario es responsable por la custodia de sus dispositivos, correos electrónicos, números telefónicos, códigos de verificación, claves de acceso y demás mecanismos utilizados para autenticarse o firmar electrónicamente. Cualquier uso indebido causado por negligencia del usuario será responsabilidad del mismo.`,
    },
    {
      title: "Protección de datos personales",
      text: `El tratamiento de datos personales se realizará conforme a la Ley 1581 de 2012 y demás normas concordantes sobre protección de datos personales en Colombia. El usuario autoriza el tratamiento de sus datos para finalidades relacionadas con identificación, autenticación, gestión documental, firma electrónica, conservación de evidencias, cumplimiento contractual, soporte, auditoría y obligaciones legales.`,
    },
    {
      title: "Información financiera, crediticia o comercial",
      text: `Cuando el proceso implique información financiera, crediticia, comercial o de servicios, el tratamiento de dicha información se realizará conforme a la Ley 1266 de 2008 y las normas que la modifiquen, adicionen o complementen.`,
    },
    {
      title: "Uso probatorio",
      text: `El usuario acepta que los documentos electrónicos, firmas, registros de auditoría, trazabilidad, mensajes de datos, comprobantes de aceptación y demás evidencias generadas por la plataforma podrán ser utilizados como medio de prueba ante autoridades administrativas, judiciales, arbitrales o cualquier tercero competente.`,
    },
    {
      title: "Disponibilidad de la plataforma",
      text: `La plataforma podrá presentar interrupciones temporales por mantenimiento, actualizaciones, fallas técnicas, eventos de fuerza mayor o causas ajenas al control del operador. Se procurará mantener la disponibilidad del servicio, sin que ello implique una garantía absoluta de funcionamiento ininterrumpido.`,
    },
    {
      title: "Modificaciones",
      text: `Estos términos y condiciones podrán ser actualizados en cualquier momento. La versión vigente será la publicada en esta página al momento del acceso, aceptación o firma electrónica.`,
    },
    {
      title: "Ley aplicable",
      text: `Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia relacionada con el uso de la plataforma, la aceptación de documentos o la firma electrónica será resuelta ante las autoridades competentes conforme a la legislación colombiana.`,
    },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe,transparent_35%),linear-gradient(to_bottom,#f8fafc,#eef2ff)] px-5 py-10 text-slate-900">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
            <div className="border-b border-slate-100 bg-linear-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-white md:px-10 md:py-10">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 ring-1 ring-white/20">
                Documento legal
              </span>

              <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
                Términos y condiciones de uso y firma electrónica
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Aquí encontrarás las condiciones aplicables al uso de la
                plataforma, validación de identidad, aceptación de documentos y
                firma electrónica.
              </p>

              <div className="mt-6 inline-flex rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/15">
                Última actualización:{" "}
                <strong className="ml-1 text-white">
                  {new Date().toLocaleDateString("es-CO")}
                </strong>
              </div>
            </div>

            <div className="space-y-4 p-5 md:p-8">
              {sections.map((section, index) => (
                <article
                  key={section.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:p-6"
                >
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm">
                      {index + 1}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-950 md:text-xl">
                        {section.title}
                      </h2>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {section.text}
                      </p>

                      {section.extra && (
                        <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                          {section.extra}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}

            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}