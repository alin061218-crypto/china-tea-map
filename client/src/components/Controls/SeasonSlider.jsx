import { useSeason, SEASONS, SEASON_ORDER } from '../../contexts/SeasonContext';

export default function SeasonSlider() {
  const { season, setSeason } = useSeason();
  const idx = SEASON_ORDER.indexOf(season);

  const handleClick = (i) => {
    setSeason(SEASON_ORDER[i]);
  };

  return (
    <div className="flex items-center gap-1 relative px-1">
      {/* 轨道 */}
      <div className="relative flex items-center h-8"
        style={{ background: 'rgba(200,190,175,0.2)', borderRadius: '16px', padding: '2px 4px' }}>
        {/* 选中指示器 */}
        <div className="absolute h-7 rounded-2xl transition-all duration-500"
          style={{
            left: `${idx * 56 + 2}px`, width: '52px',
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }} />
        {/* 刻度按钮 */}
        {SEASON_ORDER.map((key, i) => (
          <button key={key} onClick={() => handleClick(i)}
            className="relative z-10 w-14 h-7 rounded-2xl flex items-center justify-center gap-0.5
              text-xs font-medium transition-colors duration-500 border-none cursor-pointer"
            style={{
              color: key === season ? 'var(--ink-dark)' : 'var(--ink-light)',
              background: 'transparent',
              fontFamily: 'inherit',
            }}>
            <span className="text-sm">{SEASONS[key].emoji}</span>
            {SEASONS[key].name}
          </button>
        ))}
      </div>
    </div>
  );
}
