import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { favAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function TeaDetailCard({ tea, onClose }) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (user && tea?.id) {
      favAPI.check(tea.id).then(r => setIsFav(r.data.isFavorited)).catch(() => {});
    }
  }, [user, tea]);

  const toggleFav = async () => {
    if (!user) { toast.error('请先登录'); return; }
    try {
      if (isFav) {
        await favAPI.remove(tea.id);
        setIsFav(false);
      } else {
        await favAPI.add(tea.id);
        setIsFav(true);
      }
    } catch (err) { toast.error(err.response?.data?.error || '操作失败'); }
  };

  if (!tea) return null;
  const months = tea.maturity_months?.match(/\d+/g)?.map(Number) || [];
  const monthLabels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

  // 打卡推荐地点
  const spots = tea.city ? [
    { name: `${tea.city}本地茶园`, desc: `探寻最地道的${tea.name}原产地` },
    { name: `${tea.city}古茶村`, desc: `百年古茶树群落，传统制茶工艺传承` },
    { name: `${tea.city}茶博物馆`, desc: `了解${tea.name}的历史与文化脉络` },
    { name: `${tea.name}制茶工坊`, desc: `亲身体验传统手工制茶技艺` },
  ] : [];

  return (
    <AnimatePresence>
      {tea && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
          {/* 遮罩 */}
          <motion.div className="absolute inset-0"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.08)' }} />

          {/* 详情卡片 */}
          <motion.div className="relative w-full max-w-[420px] h-full overflow-y-auto z-50"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, rgba(255,253,250,0.98) 0%, rgba(250,246,240,0.97) 100%)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(200,190,175,0.3)',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.06)',
            }}>

            {/* ── 顶部操作栏 ── */}
            <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10"
              style={{ background: 'rgba(255,253,250,0.9)', backdropFilter: 'blur(12px)' }}>
              {/* 关闭按钮 */}
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink-medium hover:bg-ink-wash/20 transition-colors">
                ✕
              </button>
              {/* 收藏图标 */}
              <button onClick={toggleFav}
                className={`text-xl transition-all ${isFav ? 'heart-pop' : ''}`}
                style={{ color: isFav ? 'var(--seal-red)' : 'var(--ink-light)' }}>
                {isFav ? '❤️' : '🤍'}
              </button>
            </div>

            {/* ── 茶叶插画区 ── */}
            <div className="mx-5 mb-4 h-56 rounded-2xl flex items-center justify-center overflow-hidden relative"
              style={{
                background: 'linear-gradient(160deg, rgba(180,200,170,0.2) 0%, rgba(230,220,200,0.2) 50%, rgba(240,235,225,0.3) 100%)',
                border: '1px solid rgba(200,190,175,0.2)',
              }}>
              <div className="text-8xl drop-shadow-sm" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.08))' }}>
                🍵
              </div>
              {/* 装饰墨点 */}
              <div className="absolute bottom-4 right-8 w-20 h-20 rounded-full opacity-8"
                style={{ background: 'radial-gradient(circle, #3d3d3d 0%, transparent 70%)' }} />
            </div>

            {/* ── 标题行 ── */}
            <div className="px-5 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-ink-light tracking-wide">{tea.province} · {tea.city}</span>
                {tea.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(139,168,136,0.15)', color: 'var(--cta-green)' }}>
                    {tea.category}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-serif font-bold text-ink-darkest">{tea.name}</h2>
              {(tea.spirit || tea.meaning) && (
                <p className="text-xs text-ink-light mt-1.5 leading-relaxed italic">
                  {tea.meaning || tea.spirit}
                </p>
              )}
            </div>

            {/* ── 打卡推荐板块 ── */}
            {spots.length > 0 && (
              <div className="px-5 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span style={{ color: 'var(--seal-red)' }}>📍</span>
                  <span className="text-sm font-bold text-ink-dark font-serif">打卡推荐</span>
                </div>
                <div className="space-y-1.5">
                  {spots.map((spot, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl transition-colors hover:bg-white/60"
                      style={{ background: 'rgba(250,246,240,0.6)' }}>
                      <span className="text-xs mt-0.5">🏔️</span>
                      <div>
                        <p className="text-sm font-medium text-ink-dark">{spot.name}</p>
                        <p className="text-xs text-ink-light">{spot.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 时令标签板块 ── */}
            {months.length > 0 && (
              <div className="px-5 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span>📅</span>
                  <span className="text-sm font-bold text-ink-dark font-serif">采茶时令</span>
                </div>
                <div className="flex flex-wrap gap-1.5"
                  style={{ background: 'rgba(240,235,225,0.5)', borderRadius: '12px', padding: '8px 10px' }}>
                  {monthLabels.map((label, i) => (
                    <span key={i} className={`month-tag ${months.includes(i + 1) ? 'active' : ''}`}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── 底部打卡收藏按钮 ── */}
            <div className="px-5 pb-6 pt-2">
              {user ? (
                <button onClick={toggleFav}
                  className="btn-cta w-full py-3.5 text-base font-serif"
                  style={{ background: isFav ? 'var(--seal-red)' : 'var(--cta-green)' }}>
                  {isFav ? '❤️ 已收藏' : '🤍 打卡收藏'}
                </button>
              ) : (
                <p className="text-center text-xs text-ink-light">登录后可收藏打卡</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
