'use client';

import { useLibranzaStore } from '@/store/libranzaStore';
import LibranzaStepForm from './LibranzaStepForm';
import LibranzaStepPreview from './LibranzaStepPreview';
import LibranzaControlHeader from './LibranzaControlHeader';
import { Separator } from '@/components/ui/common/separator';
import LibranzaUploadDocuments from '@/app/dashboard/upload-documents/[id]/page';

export default function LibranzaWizard() {
  const step = useLibranzaStore((state) => state.step);

  return (
    <div className="min-h-screen font-sans">
      
      <LibranzaControlHeader />
      <Separator/>

      <main className="mx-auto  p-4">
        {step === 1 && <LibranzaStepForm />}
        {step === 2 && <LibranzaUploadDocuments />}
        {step === 3 && <LibranzaStepPreview />}
      </main>
    </div>
  );
}