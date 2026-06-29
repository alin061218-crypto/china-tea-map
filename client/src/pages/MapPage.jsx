import { useState, useEffect, useCallback, useRef } from 'react';
import { useSeason } from '../contexts/SeasonContext';
import { useAuth } from '../contexts/AuthContext';
import { teaAPI } from '../services/api';
import TeaMap from '../components/Map/TeaMap';
import TeaDetailCard from '../components/Map/TeaDetailCard';
import BottomControlBar from '../components/Controls/BottomControlBar';
import TeaCatalogPopup from '../components/Controls/TeaCatalogPopup';
import CloudAnimation from '../components/Effects/CloudAnimation';
import Snowfall from '../components/Effects/Snowfall';

export default function MapPage() {
  const { season } = useSeason();
  const { user } = useAuth();

  const [teas, setTeas] = useState([]);
  const [stats, setStats] = useState({ teaCities: 0, totalTeas: 0 });
  const [selectedTea, setSelectedTea] = useState(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    teaAPI.getAll().then(r => setTeas(r.data.teas)).catch(() => {});
    teaAPI.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleTeaSelect = useCallback((tea) => setSelectedTea(tea), []);

  const seasonTeas = teas.filter(t => t.seasons?.includes(season) && !t.is_mountain);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col relative paper-bg"
      style={{ transition: `background-color var(--season-transition)` }}>

      {/* 雾流动效 */}
      <CloudAnimation />

      {/* 顶部信息栏 */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-3 pb-2"
        style={{ background: 'linear-gradient(180deg, rgba(250,246,240,0.95) 0%, transparent 100%)' }}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'rgba(180,200,170,0.3)' }}>
              🍵
            </div>
            <h1 className="text-base font-serif font-bold text-ink-darkest tracking-wider">茶韵中国</h1>
          </div>
          <p className="text-xs text-ink-light tracking-wide">
            已打卡<span className="text-seal-red font-medium mx-0.5">{user ? 0 : '—'}</span>茶区 / 共<span className="text-ink-medium mx-0.5">{stats.teaCities}</span>产区，
            <span className="text-seal-red font-medium mx-0.5">{stats.totalTeas}</span>款茶品
          </p>
          <p className="text-xs text-ink-light mt-0.5">
            {seasonTeas.length > 0 && `🌸 当季可采 ${seasonTeas.length} 种`}
          </p>
        </div>
      </div>

      {/* 地图区域 */}
      <div ref={mapRef} className="flex-1 relative">
        {teas.length > 0 ? (
          <TeaMap teas={teas} onTeaSelect={handleTeaSelect} />
        ) : (
          <div className="flex items-center justify-center h-full text-ink-light text-sm">加载中...</div>
        )}
      </div>

      {/* 详情弹窗 */}
      {selectedTea && (
        <TeaDetailCard tea={selectedTea} onClose={() => setSelectedTea(null)} />
      )}

      {/* 雪花特效（仅冬季） */}
      <Snowfall />

      {/* 底部控制栏 */}
      <div className="relative z-30">
        <BottomControlBar
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onReset={() => {}}
          onCatalogOpen={() => setCatalogOpen(true)}
        />
      </div>

      {/* 茶信录弹窗 */}
      <TeaCatalogPopup
        teas={teas}
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onTeaSelect={handleTeaSelect}
      />
    </div>
  );
}
