"use client";

import { useEffect, useRef, useState } from "react";
import publicApi from "@/lib/axiosPublicClient";

const INK    = "#1a1a2e";
const GOLD   = "#c9a84c";
const GOLD_D = "#a07830";
const CREAM  = "#f5f0e8";
const BORDER = "#d4c9b0";
const MUTED  = "#7a6e5f";

type DocType = "IMAGEN_GENERAL" | "PDF_ADICIONAL";

interface UploadedDoc {
  id:         string;
  type:       DocType;
  label:      string;
  url:        string;
  mimeType?:  string;
  uploadedAt: string;
}

const SLOTS = [
  { type:"IMAGEN_GENERAL" as DocType, label:"Imagen",   icon:"🖼️", accept:"image/*",      hint:"Foto o imagen de respaldo" },
  { type:"PDF_ADICIONAL"  as DocType, label:"Documento", icon:"📄", accept:".pdf,image/*", hint:"PDF u otro documento" },
];

const MAX_MB = 10;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
function proxyUrl(token: string, docId: string) {
  return `${API_BASE}/contracts/public/${token}/documents/${docId}/view`;
}

export default function DocumentUploader({ token }: { token: string }) {
  const [docs,     setDocs]     = useState<Record<DocType, UploadedDoc | null>>({
    IMAGEN_GENERAL: null, PDF_ADICIONAL: null,
  });
  const [loading,  setLoading]  = useState<DocType | null>(null);
  const [fetching, setFetching] = useState(true);
  const [errors,   setErrors]   = useState<Partial<Record<DocType, string>>>({});
  const [preview,  setPreview]  = useState<string | null>(null);
  const inputRefs = useRef<Partial<Record<DocType, HTMLInputElement | null>>>({});

  useEffect(() => {
    publicApi.get(`/contracts/public/${token}/documents`)
      .then(res => {
        const existing: UploadedDoc[] = res.data.documents ?? [];
        setDocs(prev => {
          const next = { ...prev };
          existing.forEach(d => {
            if (d.type === "IMAGEN_GENERAL" || d.type === "PDF_ADICIONAL") {
              next[d.type] = d;
            }
          });
          return next;
        });
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  async function handleFile(type: DocType, file: File) {
    if (file.size > MAX_MB * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [type]: `Máximo ${MAX_MB}MB` }));
      return;
    }
    setErrors(prev => ({ ...prev, [type]: undefined }));
    setLoading(type);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload  = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const { data } = await publicApi.post(`/contracts/public/${token}/upload-document`, {
        docType: type, fileDataUrl: dataUrl, mimeType: file.type, sizeBytes: file.size,
      });
      setDocs(prev => ({ ...prev, [type]: data.document }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [type]: err?.response?.data?.message ?? "Error al subir" }));
    } finally {
      setLoading(null);
    }
  }

  if (fetching) return (
    <div style={{ marginTop:20, padding:"16px 20px", borderRadius:12,
      border:`1.5px solid ${BORDER}`, background:"white",
      display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:16, height:16, borderRadius:"50%",
        border:`2px solid ${GOLD}`, borderTopColor:"transparent",
        animation:"spin 1s linear infinite", flexShrink:0 }} />
      <p style={{ fontSize:12, color:MUTED, margin:0 }}>Cargando documentos…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ marginTop:20, background:"white", borderRadius:16,
      border:`1.5px solid ${BORDER}`, overflow:"hidden",
      boxShadow:"0 4px 20px rgba(0,0,0,0.05)" }}>
      <div style={{ height:4, background:`linear-gradient(90deg,${BORDER},${GOLD_D})` }}/>
      <div style={{ padding:"22px 28px" }}>

        {/* Título */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <span style={{ fontSize:18 }}>📎</span>
          <div>
            <p style={{ fontFamily:"Playfair Display, serif", fontSize:16, color:INK, margin:0 }}>
              Documentos Adjuntos
            </p>
            <p style={{ fontSize:11, color:MUTED, margin:"2px 0 0" }}>
              Opcional — adjunta documentos de respaldo
            </p>
          </div>
        </div>

        {/* 2 slots */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {SLOTS.map(slot => {
            const uploaded  = docs[slot.type];
            const isLoading = loading === slot.type;
            const error     = errors[slot.type];
            const isPdf     = uploaded?.mimeType?.includes("pdf")
              || uploaded?.url?.includes("/raw/");

            return (
              <div key={slot.type}>
                <input
                  ref={el => { inputRefs.current[slot.type] = el; }}
                  type="file" accept={slot.accept} style={{ display:"none" }}
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(slot.type, f);
                    e.target.value = "";
                  }}
                />
                <div
                  onClick={() => !isLoading && inputRefs.current[slot.type]?.click()}
                  style={{
                    border:`1.5px ${uploaded ? "solid" : "dashed"} ${
                      error ? "#fca5a5" : uploaded ? "#b7dfc9" : BORDER}`,
                    borderRadius:12, minHeight:110, cursor:isLoading?"wait":"pointer",
                    background: uploaded ? "#f0fdf4" : isLoading ? CREAM : "white",
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    textAlign:"center", gap:8, padding:"14px 12px",
                    position:"relative", transition:"all 0.2s",
                  }}>

                  {isLoading ? (
                    <>
                      <div style={{ width:22, height:22, borderRadius:"50%",
                        border:`2px solid ${GOLD}`, borderTopColor:"transparent",
                        animation:"spin 1s linear infinite" }}/>
                      <p style={{ fontSize:11, color:MUTED, margin:0 }}>Subiendo…</p>
                    </>

                  ) : uploaded ? (
                    <>
                      {!isPdf ? (
                        <div onClick={e => { e.stopPropagation(); setPreview(proxyUrl(token, uploaded.id)); }}
                          style={{ width:"100%", height:68, borderRadius:8,
                            overflow:"hidden", cursor:"zoom-in" }}>
                          <img src={proxyUrl(token, uploaded.id)} alt={slot.label}
                            style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        </div>
                      ) : (
                        <a href={proxyUrl(token, uploaded.id)} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize:28, lineHeight:1, textDecoration:"none" }}>
                          📄
                        </a>
                      )}
                      <p style={{ fontSize:11, fontWeight:600, color:"#2d6a4f", margin:0 }}>
                        ✓ {slot.label}
                      </p>
                      <button onClick={e => { e.stopPropagation(); inputRefs.current[slot.type]?.click(); }}
                        style={{ fontSize:10, color:MUTED, background:"none", border:"none",
                          cursor:"pointer", textDecoration:"underline", margin:0, padding:0 }}>
                        Cambiar
                      </button>
                    </>

                  ) : (
                    <>
                      <span style={{ fontSize:28, lineHeight:1 }}>{slot.icon}</span>
                      <p style={{ fontSize:12, fontWeight:600, color:INK, margin:0 }}>
                        {slot.label}
                      </p>
                      <p style={{ fontSize:10, color:MUTED, margin:0, lineHeight:1.4 }}>
                        {slot.hint}
                      </p>
                      <p style={{ fontSize:10, color:BORDER, margin:0 }}>
                        Toca para subir · máx {MAX_MB}MB
                      </p>
                    </>
                  )}

                  {error && (
                    <p style={{ fontSize:10, color:"#dc2626", margin:0,
                      position:"absolute", bottom:6 }}>
                      ⚠ {error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <div onClick={() => setPreview(null)}
          style={{ position:"fixed", inset:0, zIndex:100,
            background:"rgba(26,26,46,0.85)", display:"flex",
            alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ position:"relative", maxWidth:600, width:"100%" }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)}
              style={{ position:"absolute", top:-36, right:0, background:"none",
                border:"none", color:"white", fontSize:15, cursor:"pointer" }}>
              ✕ Cerrar
            </button>
            <img src={preview} alt="preview"
              style={{ width:"100%", borderRadius:12,
                boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}/>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}