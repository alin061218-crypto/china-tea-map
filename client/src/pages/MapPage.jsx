import { useRef, useState } from 'react';

import TeaMap from '../components/Map/TeaMap';
import BottomControlBar from '../components/Navigation/BottomControlBar';
import TeaDetailPanel from '../components/Tea/TeaDetailPanel';
import TeaCatalogPopup from '../components/Tea/TeaCatalogPopup';
import CloudAnimation from '../components/Effects/CloudAnimation';

import { demoTeas } from '../data/demoTeas';

export default function MapPage() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedTea, setSelectedTea] = useState(null);
  const mapRef = useRef(null);

  return (
    <div className="ink-scene">
      <CloudAnimation />

      <main className="map-layer">
        <TeaMap
          ref={mapRef}
          teas={demoTeas}
          onTeaSelect={(tea) => {
            setSelectedTea(tea);
          }}
        />
      </main>

      <BottomControlBar
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onReset={() => mapRef.current?.reset()}
        onCatalogOpen={() => setCatalogOpen(true)}
      />

      {selectedTea !== null && (
        <TeaDetailPanel tea={selectedTea} onClose={() => setSelectedTea(null)} />
      )}

      <TeaCatalogPopup
        teas={demoTeas}
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onTeaSelect={(tea) => {
          setSelectedTea(tea);
        }}
      />
    </div>
  );
}


