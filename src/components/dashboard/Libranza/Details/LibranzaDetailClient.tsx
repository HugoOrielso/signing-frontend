'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Contract } from '@/types/libranza';
import { DetailsDialogBody } from '@/components/dashboard/dataTable/details/detailsDialogBody';
import { DetailsPageHeader } from './DetailsPageHeader';

export function ContractDetailClient({
  contract,
}: {
  contract: Contract;
}) {
  const docs = contract.documents ?? [];

  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-muted/20">

      {/* Top bar */}
      <div className="border-b bg-background px-4 py-2.5 sm:px-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm  hover:text-foreground cursor-pointer text-main"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
      </div>

      {/* Main content */}
      <div className="mx-auto  p-3 sm:px-6 lg:px-8">

        {/* Header card */}
        <div className="mb-6 rounded-xl border bg-background shadow-sm overflow-hidden">
          <DetailsPageHeader contract={contract} />
        </div>

        {/* Body */}
        <DetailsDialogBody
          contract={contract}
          docs={docs}
          docsLoading={false}
          onPreview={(url) => setPreviewUrl(url)}
        />
      </div>

      {/* Image preview lightbox */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Previsualización</span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="relative h-[75vh] w-full bg-black/5">
              <Image
                src={previewUrl}
                alt="preview"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}