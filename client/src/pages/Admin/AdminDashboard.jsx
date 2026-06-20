import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getStats().then(r => setStats(r.data.stats)).catch(() => {});
  }, []);

  if (!stats) return <p className="text-ink-light">加载中...</p>;

  const cards = [
    { label: '茶叶总数', value: stats.totalTeas, icon: '🍵', color: '#7a9a6e' },
    { label: '茶城市', value: stats.teaCities, icon: '🏙️', color: '#b8956a' },
    { label: '山脉区域', value: stats.mountainAreas, icon: '⛰️', color: '#6b7b8d' },
    { label: '注册用户', value: stats.totalUsers, icon: '👥', color: '#c4b5c9' },
    { label: '收藏数', value: stats.totalFavorites, icon: '❤️', color: '#e85d75' },
    { label: '打卡数', value: stats.totalCheckins, icon: '📍', color: '#d4a574' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map(c => (
        <div key={c.label} className="card-scroll p-5 text-center">
          <div className="text-3xl mb-2">{c.icon}</div>
          <div className="text-3xl font-bold font-serif" style={{ color: c.color }}>{c.value}</div>
          <div className="text-sm text-ink-light mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
