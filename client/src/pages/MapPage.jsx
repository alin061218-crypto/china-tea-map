import { useMemo, useRef, useState } from 'react';

import TeaMap from '../components/Map/TeaMap';
import BottomControlBar from '../components/Navigation/BottomControlBar';
import TeaDetailPanel from '../components/Tea/TeaDetailPanel';
import TeaCatalogPopup from '../components/Tea/TeaCatalogPopup';
import CampaignPopup from '../components/Campaign/CampaignPopup';
import TeaKnowledgeHub from '../components/Knowledge/TeaKnowledgeHub';
import MessageBoard from '../components/Message/MessageBoard';
import CloudAnimation from '../components/Effects/CloudAnimation';
import AuthModal from '../components/Auth/AuthModal';

import { useTeasData } from '../data/useTeasData';
import { getModernProducts } from '../utils/modernTea';

export default function MapPage() {
  const { teas } = useTeasData();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [viewMode, setViewMode] = useState('traditional');
  // 选中内容：{ kind: 'tea' | 'product', data }
  const [selectedItem, setSelectedItem] = useState(null);
  const mapRef = useRef(null);

  const modernProducts = useMemo(() => getModernProducts(teas), [teas]);

  // 产品 → 原料产地茶 反链：切回传统视图并定位产地茶
  const handleBackToOrigin = (teaId) => {
    const tea = teas.find((item) => item.id === teaId);
    if (!tea) return;
    setViewMode('traditional');
    setSelectedItem({ kind: 'tea', data: tea });
    // 等传统视图 marker 渲染后再定位
    setTimeout(() => mapRef.current?.focusTea(teaId), 80);
  };

  return (
    <div className="ink-scene">
      <CloudAnimation />

      <main className="map-layer">
        <TeaMap
          ref={mapRef}
          teas={teas}
          viewMode={viewMode}
          modernProducts={modernProducts}
          onTeaSelect={(tea) => {
            setSelectedItem({ kind: 'tea', data: tea });
          }}
          onProductSelect={(product) => {
            setSelectedItem({ kind: 'product', data: product });
          }}
        />
      </main>

      <BottomControlBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onReset={() => mapRef.current?.reset()}
        onCatalogOpen={() => setCatalogOpen(true)}
        onCampaignOpen={() => setCampaignOpen(true)}
        onKnowledgeOpen={() => setKnowledgeOpen(true)}
        onMessageOpen={() => setMessageOpen(true)}
        onAuthOpen={() => setAuthModalOpen(true)}
      />

      {selectedItem !== null && (
        <TeaDetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onBackToOrigin={handleBackToOrigin}
        />
      )}

      <TeaCatalogPopup
        teas={teas}
        modernProducts={modernProducts}
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onTeaSelect={(tea) => {
          setSelectedItem({ kind: 'tea', data: tea });
        }}
        onProductSelect={(product) => {
          setSelectedItem({ kind: 'product', data: product });
        }}
      />

      <CampaignPopup
        isOpen={campaignOpen}
        onClose={() => setCampaignOpen(false)}
      />

      <TeaKnowledgeHub
        isOpen={knowledgeOpen}
        onClose={() => setKnowledgeOpen(false)}
      />

      <MessageBoard
        isOpen={messageOpen}
        onClose={() => setMessageOpen(false)}
        teas={teas}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
