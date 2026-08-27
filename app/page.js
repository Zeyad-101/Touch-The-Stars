'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import InfoPanel from '@/components/InfoPanel';
import LoadingScreen from '@/components/LoadingScreen';

const SceneCanvas = dynamic(() => import('@/components/SceneCanvas'), {
  ssr: false,
});

export default function Home() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const backTriggerRef = useRef(null);

  const handleBack = () => {
    if (backTriggerRef.current) {
      backTriggerRef.current();
    }
  };

  return (
    <main>
      <LoadingScreen isLoaded={isLoaded} />

      <SceneCanvas
        selectedPlanet={selectedPlanet}
        onSelectPlanet={setSelectedPlanet}
        backTriggerRef={backTriggerRef}
        onLoaded={setIsLoaded}
      />
      <InfoPanel planet={selectedPlanet} onBack={handleBack} />
    </main>
  );
}
