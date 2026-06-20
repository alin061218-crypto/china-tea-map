import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const loc = useLocation();

  const links = [
    { to: '/', label: '首页' },
    { to: '/map', label: '茶韵地图' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 h-14 flex items-center justify-between px-6"
      style={{ background: 'rgba(250,246,240,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(200,192,180,0.3)' }}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <span className="text-2xl">🍵</span>
        <span className="text-lg font-serif font-bold text-ink-darkest tracking-wide">茶韵中国</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {links.map(l => (
          <Link key={l.to} to={l.to}
            className={`px-4 py-1.5 rounded-button text-sm transition-colors no-underline
              ${loc.pathname === l.to ? 'bg-seal-red text-white' : 'text-ink-medium hover:text-ink-darkest hover:bg-white/60'}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link to="/profile" className="btn-ghost text-sm no-underline">
              👤 {user.username}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn-ghost text-sm no-underline text-seal-red">
                管理
              </Link>
            )}
            <button onClick={logout} className="btn-ghost text-sm">
              退出
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost text-sm no-underline">登录</Link>
            <Link to="/register" className="btn-seal text-sm no-underline">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
}
