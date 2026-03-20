'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/axiosClient';
import type { Contract, ContractDocumentItem } from '@/types/libranza';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DetailsDialogHeader } from './details/detailsDialogHeader';
import { DetailsDialogBody } from './details/detailsDialogBody';

export function ContractDetailDialog({
    contract,
    open,
    onOpenChange,
}: {
    contract: Contract | null;
    open: boolean;
    onOpenChange: (value: boolean) => void;
}) {
    const [docs, setDocs] = useState<ContractDocumentItem[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!contract?.token || !open) return;
        api
            .get(`/contracts/public/${contract.token}/documents`)
            .then((res) => setDocs(res.data.documents ?? []))
            .catch(() => setDocs([]))
            .finally(() => setDocsLoading(false));
    }, [contract?.token, open]);


    if (!contract) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="h-[92vh] w-[95vw] max-w-[95vw] overflow-hidden p-0 sm:h-[90vh] sm:w-[92vw] sm:max-w-[92vw] lg:w-[88vw] lg:max-w-[88vw] xl:max-w-6xl">
                    <DetailsDialogHeader contract={contract} />

                    <DetailsDialogBody
                        contract={contract}
                        docs={docs}
                        docsLoading={docsLoading}
                        onPreview={(url) => setPreviewUrl(url)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
                <DialogContent className="max-h-[92vh] w-[95vw] max-w-5xl overflow-hidden p-0">
                    <DialogHeader className="border-b px-4 py-3">
                        <DialogTitle className="text-base">Previsualización</DialogTitle>
                    </DialogHeader>

                    <div className="relative h-[75vh] w-full bg-black/5">
                        {previewUrl && (
                            <Image
                                src={previewUrl}
                                alt="preview"
                                fill
                                className="object-contain"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                unoptimized
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}