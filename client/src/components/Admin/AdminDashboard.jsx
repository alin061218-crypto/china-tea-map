// Shows the admin overview metrics.
import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

const cards = [
  ['茶品总数', 'totalTeas'],
  ['用户总数', 'totalUsers'],
  ['收藏总数', 'totalFavorites'],
  ['打卡总数', 'totalCheckins'],
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    adminAPI.getStats()
      .then(({ data }) => {
        if (mounted) setStats(data.stats);
      })
      .catch((err) => {
        if (mounted) setError(err.message || '统计数据加载失败');
      });
    return () => { mounted = false; };
  }, []);

  if (error) {
    return <div className="rounded-2xl bg-white/30 p-6 text-sm text-red-400">{error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(([label, key]) => (
        <section key={key} className="rounded-2xl bg-white/30 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,.42)]">
          <div className="text-sm text-[var(--ink-soft)]">{label}</div>
          <div className="mt-3 font-serif text-4xl font-semibold text-[var(--ink)]">{stats?.[key] ?? '...'}</div>
        </section>
      ))}
    </div>
  );
}
