// Renders the Tea Atlas administration console.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import TeaManager from '../components/Admin/TeaManager';
import UserManager from '../components/Admin/UserManager';

const tabs = [
  ['dashboard', '数据看板', <svg key="d" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="M3.5 10h17" /><path d="M7 7h.01M10.5 7h.01" /></svg>],
  ['teas', '茶品管理', <svg key="t" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1.2 3.4a6.5 6.5 0 0 1-11.6 0L5 8Z" /><path d="M8 8V5.5a4 4 0 0 1 8 0V8" /><path d="M12 18.5V21" /><path d="M9 21h6" /></svg>],
  ['users', '用户管理', <svg key="u" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19.5c1-2.7 3-4 5.5-4s4.5 1.3 5.5 4" /><circle cx="17" cy="9.5" r="2.4" /><path d="M17.5 15.6c1.8.4 3 1.5 3.4 3.4" /></svg>],
];

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      {/* 左侧内容 */}
      <main className="flex-1 overflow-y-auto p-6">
        <header className="relative mb-6 flex items-center gap-4 overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.55)] p-5 backdrop-blur-sm">
          <img
            src="/images/admin/dashboard-ink-teapot.jpg"
            alt=""
            className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full object-cover opacity-[0.16] mix-blend-multiply"
            aria-hidden="true"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--ink)]/6">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--ink)]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9h14l-1.2 3.2a6.4 6.4 0 0 1-11.6 0L5 9Z" />
              <path d="M8.2 9V6.8a3.8 3.8 0 0 1 7.6 0V9" />
              <path d="M12 18.3V21M9 21h6" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold tracking-wide text-[var(--ink)]">茶韵中国 · 管理后台</h1>
            <p className="mt-0.5 text-sm text-[var(--ink-soft)]">茶品 · 用户 · 数据一览</p>
          </div>
          <div className="ml-auto hidden text-right text-xs text-[var(--ink-faint)] md:block">
            数据与地图实时同步
            <div className="mt-1 h-px w-full bg-[var(--ink)]/10" />
          </div>
        </header>
        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'teas' && <TeaManager />}
        {tab === 'users' && <UserManager />}
      </main>

      {/* 右侧导航 */}
      <aside className="flex w-52 shrink-0 flex-col border-l border-white/60 bg-[rgba(255,249,241,.78)] p-5 backdrop-blur-2xl">
        <Link to="/" className="mb-8 block font-serif text-lg font-semibold tracking-wide text-[var(--ink)]">
          Tea Atlas
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {tabs.map(([key, label, icon]) => (
            <button
              key={key}
              type="button"
              className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-left text-sm transition ${
                tab === key
                  ? 'bg-white/50 font-semibold text-[var(--ink)] shadow-sm'
                  : 'text-[var(--ink-soft)] hover:bg-white/30'
              }`}
              onClick={() => setTab(key)}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        <Link
          to="/"
          className="mt-auto rounded-xl px-4 py-2.5 text-center text-sm text-[var(--ink-soft)] hover:bg-white/30"
        >
          返回地图
        </Link>
      </aside>
    </div>
  );
}
