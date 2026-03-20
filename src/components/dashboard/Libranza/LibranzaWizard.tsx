'use client';

import { useLibranzaStore } from '@/store/libranzaStore';
import LibranzaStepForm from './LibranzaStepForm';
import LibranzaStepPreview from './LibranzaStepPreview';
import LibranzaControlHeader from './LibranzaControlHeader';
import { Separator } from '@/components/ui/separator';

export default function LibranzaWizard() {
  const step = useLibranzaStore((state) => state.step);

  return (
    <div className="min-h-screen font-sans">
      
      <LibranzaControlHeader />
      <Separator/>

      <main className="mx-auto  px-5 py-10">
        {step === 1 && <LibranzaStepForm />}
        {step === 2 && <LibranzaStepPreview />}
      </main>
    </div>
  );
}