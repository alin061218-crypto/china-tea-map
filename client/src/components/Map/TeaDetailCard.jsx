import { useState, useEffect } from 'react';
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
        setIsFav(false); toast.success('已取消收藏');
      } else {
        await favAPI.add(tea.id);
        setIsFav(true); toast.success('已收藏');
      }
    } catch (err) { toast.error(err.response?.data?.error || '操作失败'); }
  };

  if (!tea) return null;

  const months = tea.maturity_months?.match(/\d+/g)?.map(Number) || [];

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={onClose}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* 详情卡片 */}
      <div className="relative w-full max-w-[420px] h-full overflow-auto slide-in-right z-50"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(250,246,240,0.97) 100%)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(200,192,180,0.3)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
        }}>

        {/* 关闭按钮 */}
        <button onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-ink-medium z-10
            hover:bg-ink-wash/20 transition-colors text-lg">
          ✕
        </button>

        {/* 茶叶插画区 */}
        <div className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(200,220,200,0.3) 0%, rgba(240,235,225,0.3) 100%)',
          }}>
          <div className="text-8xl drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
            🍵
          </div>
          {/* 装饰性墨点 */}
          <div className="absolute bottom-4 right-8 w-16 h-16 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #3d3d3d 0%, transparent 70%)' }} />
          <div className="absolute top-6 left-8 w-12 h-12 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #7a9a6e 0%, transparent 70%)' }} />
        </div>

        {/* 内容区 */}
        <div className="px-6 py-5 space-y-4">
          {/* 头部 */}
          <div>
            <p className="text-xs text-ink-light mb-0.5 tracking-wide">{tea.province} · {tea.city}</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-serif font-bold text-ink-darkest">{tea.name}</h2>
              <button onClick={toggleFav} className={`text-xl transition-transform ${isFav ? 'scale-110' : ''}`}>
                {isFav ? '❤️' : '🤍'}
              </button>
            </div>
            {tea.category && (
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: tea.category === '绿茶' ? '#e8f0e4' : tea.category === '红茶' ? '#f0e4e4' :
                    tea.category === '乌龙茶' ? '#f0ebe0' : tea.category === '白茶' ? '#f0f0f0' :
                    tea.category === '黄茶' ? '#f5f0e0' : '#efe8e0',
                  color: tea.category === '绿茶' ? '#4a7a3e' : tea.category === '红茶' ? '#8b3a3a' :
                    tea.category === '乌龙茶' ? '#8b6a3a' : tea.category === '白茶' ? '#6a6a6a' :
                    tea.category === '黄茶' ? '#8b7a3a' : '#6a4a3a',
                }}>
                {tea.category}
              </span>
            )}
          </div>

          {/* 当地饮用特色 */}
          {tea.local_characteristics && (
            <Section title="🍵 当地饮用特色">
              <p className="text-sm text-ink-medium leading-relaxed">{tea.local_characteristics}</p>
            </Section>
          )}

          {/* 外观形状 */}
          {tea.appearance && (
            <Section title="👁️ 外观形状">
              <p className="text-sm text-ink-medium">{tea.appearance}</p>
            </Section>
          )}

          {/* 历史故事 */}
          {tea.history && (
            <Section title="📜 历史故事">
              <p className="text-sm text-ink-medium leading-relaxed">{tea.history}</p>
            </Section>
          )}

          {/* 精神寓意 */}
          {(tea.spirit || tea.meaning) && (
            <Section title="💫 精神寓意">
              <p className="text-sm font-medium text-ink-dark">{tea.spirit}</p>
              {tea.meaning && <p className="text-sm text-ink-medium mt-1">{tea.meaning}</p>}
            </Section>
          )}

          {/* 采茶月历 */}
          {months.length > 0 && (
            <Section title="📅 采茶月历">
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 12 }, (_, i) => {
                  const m = i + 1;
                  const active = months.includes(m);
                  return (
                    <div key={i} className="aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all"
                      style={{
                        background: active ? '#7a9a6e' : '#e8e4dc',
                        color: active ? '#fff' : '#aaa',
                      }}>
                      {m}月
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* 品茗好去处 */}
          {tea.city && (
            <Section title="📍 品茗好去处">
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(122,154,110,0.08)' }}>
                  <span className="text-sm">🏔️</span>
                  <div>
                    <p className="text-sm font-medium text-ink-dark">{tea.city}本地茶园</p>
                    <p className="text-xs text-ink-light">探寻最地道的{tea.name}原产地</p>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* 收藏打卡按钮 */}
          {user && (
            <button onClick={toggleFav}
              className="w-full py-3.5 rounded-button text-base font-serif font-bold transition-all duration-300"
              style={{
                background: isFav ? '#e8dcc8' : '#7a9a6e',
                color: isFav ? '#5d3a1a' : '#fff',
              }}>
              {isFav ? '❤️ 已收藏' : '🍵 收藏打卡'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 子组件
function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-ink-dark mb-1.5 font-serif tracking-wide">{title}</h4>
      {children}
    </div>
  );
}
