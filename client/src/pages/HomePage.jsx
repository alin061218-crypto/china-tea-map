import { Link } from 'react-router-dom';
import { useSeason } from '../contexts/SeasonContext';

export default function HomePage() {
  const { season, SEASONS } = useSeason();
  const s = SEASONS[season];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 text-center"
      style={{ background: `var(--season-bg, #faf6f0)` }}>
      {/* 装饰性背景山水 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 30%, ${season === 'spring' ? '#c8dcc0' : season === 'summer' ? '#b5c9b0' : season === 'autumn' ? '#dcc8a0' : '#c0c5d0'} 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(200,192,180,0.3) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 80% 70%, rgba(180,185,200,0.2) 0%, transparent 40%)
          `
        }}
      />

      {/* 主标题 */}
      <div className="relative z-10">
        <div className="text-8xl mb-4">{s.icon}</div>
        <h1 className="text-5xl md:text-7xl font-serif font-black text-ink-darkest mb-4 ink-text tracking-wider">
          茶韵中国
        </h1>
        <p className="text-xl text-ink-medium mb-2 font-light tracking-widest">
          一叶知春秋 · 一盏品山河
        </p>
        <p className="text-sm text-ink-light mb-12">
          探索全国各地的特色茶叶，感受千年茶文化的魅力
        </p>

        {/* CTA */}
        <Link to="/map"
          className="btn-seal text-lg px-10 py-3 no-underline inline-block"
          style={{ fontSize: '18px', padding: '14px 40px' }}>
          {s.icon} 进入茶韵地图
        </Link>

        {/* 四季预览 */}
        <div className="flex gap-4 justify-center mt-16">
          {Object.entries(SEASONS).map(([key, val]) => (
            <Link key={key} to="/map"
              className={`no-underline w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-all
                ${key === season ? 'bg-white/80 shadow-card scale-110' : 'bg-white/40 hover:bg-white/60'}`}>
              <span className="text-2xl">{val.icon}</span>
              <span className="text-xs text-ink-medium mt-1">{val.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
