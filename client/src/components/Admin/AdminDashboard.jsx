// 数据看板：统计卡（水墨图标）+ 六大茶类分布 + 省份 Top 茶产地
import { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../../services/api';

// 茶类固定顺序 + 水墨低饱和色系（与全局 --ink 系协调）
const CATEGORY_META = [
  { key: '绿茶', en: 'green', color: '#6f8f5f' },
  { key: '红茶', en: 'black', color: '#a0684a' },
  { key: '乌龙茶', en: 'oolong', color: '#8d7b56' },
  { key: '白茶', en: 'white', color: '#9a948a' },
  { key: '黄茶', en: 'yellow', color: '#b59a5a' },
  { key: '黑茶', en: 'dark', color: '#51493f' },
  { key: '花茶', en: 'flower', color: '#8f6d84' },
];

// 水墨风格线性图标（stroke 沿用墨色）
const Icon = ({ path, className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {path}
  </svg>
);

const CARD_ICONS = {
  totalTeas: <Icon path={<><path d="M5 8h14l-1.2 3.4a6.5 6.5 0 0 1-11.6 0L5 8Z" /><path d="M8 8V5.5a4 4 0 0 1 8 0V8" /><path d="M12 18.5V21" /><path d="M9 21h6" /></>} />,
  totalUsers: <Icon path={<><circle cx="12" cy="8" r="3.4" /><path d="M5.5 19.5c1.2-3 3.6-4.5 6.5-4.5s5.3 1.5 6.5 4.5" /></>} />,
  totalFavorites: <Icon path={<><path d="M12 20s-7-4.4-9-8.3C1.6 8.6 3.4 5.6 6.6 5.6c1.9 0 3.4 1.1 4.4 2.6" /><path d="M12 20s7-4.4 9-8.3c1.4-3.1-.4-6.1-3.6-6.1-1.9 0-3.4 1.1-4.4 2.6" /></>} />,
  totalCheckins: <Icon path={<><circle cx="12" cy="12" r="8.2" /><path d="M12 8v4.2l3 1.8" /></>} />,
};

function StatCard({ label, keyName, value }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white/30 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.42)]">
      <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-[var(--ink)]/4" aria-hidden="true" />
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--ink-soft)]">{label}</div>
        <div className="text-[var(--ink-faint)]">{CARD_ICONS[keyName]}</div>
      </div>
      <div className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">{value ?? '...'}</div>
    </section>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [teas, setTeas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    adminAPI.getStats()
      .then(({ data }) => { if (mounted) setStats(data.stats); })
      .catch((err) => { if (mounted) setError(err.message || '统计数据加载失败'); });
    adminAPI.getTeas()
      .then(({ data }) => { if (mounted) setTeas(data.teas || []); })
      .catch(() => { /* 图表数据失败不影响统计卡 */ });
    return () => { mounted = false; };
  }, []);

  // 六大茶类分布（排除山脉标记）
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const t of teas) {
      if (t.is_mountain) continue;
      counts[t.category] = (counts[t.category] || 0) + 1;
    }
    return CATEGORY_META.map((meta) => ({ ...meta, count: counts[meta.key] || 0 }));
  }, [teas]);

  // 省份 Top（排除山脉标记）
  const provinceTop = useMemo(() => {
    const counts = {};
    for (const t of teas) {
      if (t.is_mountain) continue;
      counts[t.province] = (counts[t.province] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [teas]);

  const maxCategory = Math.max(1, ...categoryCounts.map((c) => c.count));
  const maxProvince = Math.max(1, ...provinceTop.map((p) => p.count));

  if (error && !stats) {
    return <div className="rounded-2xl bg-white/30 p-6 text-sm text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-5">
      {/* 统计卡 */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="茶品总数" keyName="totalTeas" value={stats?.totalTeas} />
        <StatCard label="用户总数" keyName="totalUsers" value={stats?.totalUsers} />
        <StatCard label="收藏总数" keyName="totalFavorites" value={stats?.totalFavorites} />
        <StatCard label="打卡总数" keyName="totalCheckins" value={stats?.totalCheckins} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 六大茶类分布 */}
        <section className="rounded-2xl bg-white/30 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.42)]">
          <h3 className="mb-4 font-serif text-base font-semibold text-[var(--ink)]">六大茶类分布</h3>
          <div className="space-y-2.5">
            {categoryCounts.map((c) => (
              <div key={c.key} className="flex items-center gap-3 text-xs">
                <span className="w-14 shrink-0 text-[var(--ink-soft)]">{c.key}</span>
                <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-[var(--ink)]/8">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{ width: `${(c.count / maxCategory) * 100}%`, background: c.color, opacity: 0.82 }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right font-semibold text-[var(--ink)]">{c.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categoryCounts.map((c) => (
              <span key={c.en} className="flex items-center gap-1.5 rounded-full bg-white/40 px-2.5 py-1 text-xs text-[var(--ink-soft)]">
                <img src={`/images/tea-icons/${c.en}.png`} alt="" className="h-4 w-4 object-contain" />
                {c.key} · {c.count}
              </span>
            ))}
          </div>
        </section>

        {/* 省份 Top */}
        <section className="rounded-2xl bg-white/30 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.42)]">
          <h3 className="mb-4 font-serif text-base font-semibold text-[var(--ink)]">省份茶产地 Top 6</h3>
          {provinceTop.length === 0 ? (
            <div className="text-sm text-[var(--ink-faint)]">暂无数据</div>
          ) : (
            <div className="space-y-2.5">
              {provinceTop.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 text-xs">
                  <span className={`w-5 shrink-0 text-center font-serif ${i < 3 ? 'font-semibold text-[var(--ink)]' : 'text-[var(--ink-faint)]'}`}>{i + 1}</span>
                  <span className="w-16 shrink-0 text-[var(--ink-soft)]">{p.name}</span>
                  <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-[var(--ink)]/8">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[var(--ink)] transition-all duration-700"
                      style={{ width: `${(p.count / maxProvince) * 100}%`, opacity: 0.55 + (0.1 * (maxProvince - i)) }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right font-semibold text-[var(--ink)]">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
