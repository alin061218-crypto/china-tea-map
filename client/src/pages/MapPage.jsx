import { useState, useEffect, useCallback } from 'react';
import { useSeason } from '../contexts/SeasonContext';
import { useAuth } from '../contexts/AuthContext';
import { teaAPI } from '../services/api';
import ChinaMap from '../components/Map/ChinaMap';
import TeaDetailCard from '../components/Map/TeaDetailCard';
import FallingPetals from '../components/Effects/FallingPetals';

export default function MapPage() {
  const { month, season, prevMonth, nextMonth, SEASONS } = useSeason();
  const { user } = useAuth();
  const s = SEASONS[season];

  const [teas, setTeas] = useState([]);
  const [stats, setStats] = useState({ teaCities: 0, totalTeas: 0 });
  const [selectedTea, setSelectedTea] = useState(null);
  const [seasonFilter, setSeasonFilter] = useState('all');

  useEffect(() => {
    teaAPI.getAll().then(r => setTeas(r.data.teas)).catch(() => {});
    teaAPI.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleTeaSelect = useCallback((tea) => {
    setSelectedTea(tea);
  }, []);

  // 根据筛选过滤
  const filteredFilter = seasonFilter === 'all' ? teas : teas.filter(t => t.seasons?.includes(seasonFilter));
  const seasonTeas = teas.filter(t => t.seasons?.includes(season) && !t.is_mountain);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col relative"
      style={{ background: `var(--season-bg, #faf6f0)` }}>

      {/* 花瓣飘落特效 */}
      <FallingPetals />

      {/* 顶部信息栏 */}
      <div className="text-center py-2.5 px-4">
        <p className="text-sm font-serif text-ink-medium tracking-wider">
          已收录 <span className="text-seal-red text-lg font-bold">{stats.teaCities}</span> 个茶城市 ·
          <span className="text-ink-medium"> {stats.totalTeas}</span> 种名茶
          {user && (
            <span className="ml-2 text-xs text-ink-light">
              | 已打卡 <span className="text-seal-red">{stats.teaCities}</span>/296 城
            </span>
          )}
        </p>
      </div>

      {/* 地图区域 */}
      <div className="flex-1 mx-3 rounded-2xl overflow-hidden border border-ink-wash/20 relative"
        style={{ background: '#faf6f0' }}>
        {teas.length > 0 ? (
          <ChinaMap teas={teas} season={season} onTeaSelect={handleTeaSelect} />
        ) : (
          <div className="flex items-center justify-center h-full text-ink-light">
            <p>加载中...</p>
          </div>
        )}
      </div>

      {/* 详情卡片 */}
      {selectedTea && (
        <TeaDetailCard tea={selectedTea} onClose={() => setSelectedTea(null)} />
      )}

      {/* 底部操作栏 */}
      <div className="bottom-bar mx-3 my-2 px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        {/* 月份导航 */}
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="btn-ghost text-sm px-2.5">◀</button>
          <span className="text-sm font-serif font-bold min-w-[55px] text-center">{month}月</span>
          <button onClick={nextMonth} className="btn-ghost text-sm px-2.5">▶</button>
        </div>

        {/* 季节筛选 */}
        <div className="flex gap-1">
          <button onClick={() => setSeasonFilter('all')}
            className={`btn-ghost text-xs px-3 ${seasonFilter === 'all' ? 'active' : ''}`}>全部</button>
          {Object.entries(SEASONS).map(([key, val]) => (
            <button key={key} onClick={() => setSeasonFilter(seasonFilter === key ? 'all' : key)}
              className={`btn-ghost text-xs px-2.5 ${seasonFilter === key ? 'active' : ''}`}>
              {val.icon}
            </button>
          ))}
        </div>

        {/* 当月统计 */}
        <div className="text-xs text-ink-light">
          {s.icon} 当季可采: <span className="text-seal-red font-medium">{seasonTeas.length}</span> 种
        </div>
      </div>
    </div>
  );
}
