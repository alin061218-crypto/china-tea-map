// Manages user records from the admin API.
import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
        <table className="w-full min-w-[760px] border-separate border-spacing-y-1 text-left text-sm">
          <thead className="text-xs text-[var(--ink-faint)]">
            <tr>
              <th className="px-3 py-2">用户名</th>
              <th className="px-3 py-2">邮箱</th>
              <th className="px-3 py-2">角色</th>
              <th className="px-3 py-2">注册时间</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="hover:bg-white/20">
                <td className="rounded-l-xl px-3 py-3 font-semibold text-[var(--ink)]">{item.username}</td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{item.email}</td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{item.role}</td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{item.created_at}</td>
                <td className="rounded-r-xl px-3 py-3">
                  <button
                    type="button"
                    className="ui-pill min-h-8 px-3 text-xs text-red-400 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={item.id === user?.id}
                    onClick={() => removeUser(item)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
