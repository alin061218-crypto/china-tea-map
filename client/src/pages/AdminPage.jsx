// Renders the Tea Atlas administration console.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminDashboard from '../components/Admin/AdminDashboard';
import TeaManager from '../components/Admin/TeaManager';
import UserManager from '../components/Admin/UserManager';

const tabs = [
  ['dashboard', '数据看板'],
  ['teas', '茶品管理'],
  ['users', '用户管理'],
];

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      {/* 左侧内容 */}
      <main className="flex-1 overflow-y-auto p-6">
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
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`rounded-xl px-4 py-2.5 text-left text-sm transition ${
                tab === key
                  ? 'bg-white/50 font-semibold text-[var(--ink)] shadow-sm'
                  : 'text-[var(--ink-soft)] hover:bg-white/30'
              }`}
              onClick={() => setTab(key)}
            >
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
