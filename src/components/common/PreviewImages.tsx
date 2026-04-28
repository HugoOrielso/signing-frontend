import { X } from "lucide-react";
import Image from "next/image";

type PreviewModalProps = {
  previewUrl: string | null;
  onClose: () => void;
};

export function PreviewModal({ previewUrl, onClose }: PreviewModalProps) {
  if (!previewUrl) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 px-6 py-8">
      <div className="relative flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
          <h2 className="text-base font-semibold text-slate-900">
            Previsualización
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 cursor-pointer text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 bg-slate-100">
          <div className="absolute inset-0 z-1000 flex items-center justify-center">
            <div className="relative h-full w-full max-w-4xl">
              <Image
                src={previewUrl}
                alt="preview"
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}