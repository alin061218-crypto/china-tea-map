import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!user) { nav('/login'); return; }
    if (!isAdmin) { nav('/'); }
  }, [user, isAdmin, nav]);

  if (!user || !isAdmin) return null;

  const tabs = [
    { to: '/admin', label: '📊 概览', exact: true },
    { to: '/admin/teas', label: '🍵 茶叶管理' },
    { to: '/admin/users', label: '👥 用户管理' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-serif font-bold mb-2">管理员后台</h1>
        <p className="text-sm text-ink-light mb-6">茶韵中国管理系统</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(t => (
            <Link key={t.to} to={t.to}
              className={`px-5 py-2 rounded-button text-sm no-underline transition-colors
                ${(t.exact ? loc.pathname === t.to : loc.pathname.startsWith(t.to))
                  ? 'bg-seal-red text-white' : 'bg-white/60 text-ink-medium hover:bg-white'}`}>
              {t.label}
            </Link>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}
