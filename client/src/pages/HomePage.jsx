import { Link } from 'react-router-dom';
import { useSeason, SEASONS } from '../contexts/SeasonContext';
import CloudAnimation from '../components/Effects/CloudAnimation';

export default function HomePage() {
  const { season } = useSeason();
  const s = SEASONS[season];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center relative overflow-hidden paper-bg">

      {/* 云雾背景 */}
      <CloudAnimation />

      {/* 远山装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 80% 80% at 30% 90%, rgba(160,175,155,0.4) 0%, transparent 60%),
              radial-gradient(ellipse 60% 70% at 70% 85%, rgba(175,160,145,0.3) 0%, transparent 55%),
              radial-gradient(ellipse 70% 60% at 50% 95%, rgba(190,185,175,0.25) 0%, transparent 50%)
            `,
            transition: 'all var(--season-transition)',
          }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center text-4xl"
          style={{ background: 'rgba(200,220,200,0.25)', backdropFilter: 'blur(8px)' }}>
          🍵
        </div>

        {/* 标题 */}
        <h1 className="text-5xl md:text-6xl font-serif font-black text-ink-darkest mb-3 tracking-wider"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          茶韵中国
        </h1>
        <p className="text-base text-ink-medium mb-1 tracking-widest">一叶知春秋 · 一盏品山河</p>
        <p className="text-xs text-ink-light mb-10">探索全国各地的特色茶叶，感受千年茶文化魅力</p>

        {/* CTA */}
        <Link to="/map"
          className="btn-cta text-lg px-10 py-3.5 no-underline"
          style={{ fontSize: '17px', padding: '14px 44px', fontFamily: 'inherit' }}>
          {s.emoji} 进入茶韵地图
        </Link>

        {/* 四季预览 */}
        <div className="flex gap-3 justify-center mt-14">
          {Object.entries(SEASONS).map(([key, val]) => (
            <Link key={key} to="/map"
              className={`no-underline w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-500
                ${key === season ? 'bg-white/80 shadow-card scale-110' : 'bg-white/40 hover:bg-white/60'}`}>
              <span className="text-xl">{val.emoji}</span>
              <span className="text-2xs text-ink-light mt-0.5" style={{ fontSize: '10px' }}>{val.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
