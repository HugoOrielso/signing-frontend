'use client';

import LibranzaStepForm from './LibranzaStepForm';

export default function LibranzaWizard() {

  return (
    <div className="min-h-screen font-sans">
      <main className="mx-auto bg-zinc-50 p-4">
        <LibranzaStepForm />
      </main>
    </div>
  );
}