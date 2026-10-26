// 用户管理：头像圆图 + 角色徽标 + 注册时间
import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function Avatar({ user }) {
  if (user.avatar) {
    return <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/50" />;
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)]/10 font-serif text-sm font-semibold text-[var(--ink)] ring-1 ring-white/50">
      {user.username?.slice(0, 1) || '茶'}
    </div>
  );
}

export default function UserManager() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setError('');
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || '用户加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function removeUser(target) {
    if (target.id === user?.id) return;
    if (!window.confirm(`确认删除用户 ${target.username}？`)) return;
    if (!window.confirm('删除后无法恢复，仍要继续吗？')) return;
    await adminAPI.deleteUser(target.id);
    loadUsers();
  }

  return (
    <section className="rounded-[26px] bg-white/20 p-4">
      <div className="mb-4 text-sm text-[var(--ink-soft)]">{loading ? '加载中...' : `共 ${users.length} 位用户`}</div>
      {error && <div className="mb-3 rounded-2xl bg-white/30 p-3 text-sm text-red-400">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-1 text-left text-sm">
          <thead className="text-xs text-[var(--ink-faint)]">
            <tr>
              <th className="px-3 py-2">用户</th>
              <th className="px-3 py-2">邮箱</th>
              <th className="px-3 py-2">角色</th>
              <th className="px-3 py-2">注册时间</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="hover:bg-white/20">
                <td className="rounded-l-xl px-3 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={item} />
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-[var(--ink)]">
                        {item.username}
                        {item.id === user?.id && <span className="text-xs font-normal text-[var(--ink-faint)]">(当前账号)</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{item.email || '—'}</td>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${
                    item.role === 'admin'
                      ? 'bg-[var(--ink)] text-[var(--paper)]'
                      : 'bg-[var(--ink)]/8 text-[var(--ink-soft)]'
                  }`}>
                    {item.role === 'admin' ? '管理员' : '普通用户'}
                  </span>
                </td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{item.created_at}</td>
                <td className="rounded-r-xl px-3 py-3">
                  <button
                    type="button"
                    className="ui-pill min-h-8 px-3 text-xs text-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={item.id === user?.id || item.role === 'admin'}
                    title={item.role === 'admin' ? '不能删除管理员' : ''}
                    onClick={() => removeUser(item)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-10 text-center text-sm text-[var(--ink-faint)]">暂无用户</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
