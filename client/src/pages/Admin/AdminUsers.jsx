import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminAPI.getUsers().then(r => setUsers(r.data.users)).catch(() => {});
  }, []);

  const toggleRole = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    await adminAPI.updateUser(u.id, { role: newRole });
    toast.success(`已设为 ${newRole}`);
    const r = await adminAPI.getUsers();
    setUsers(r.data.users);
  };

  const handleDelete = async (u) => {
    if (!confirm(`确认删除用户 "${u.username}"？`)) return;
    try {
      await adminAPI.deleteUser(u.id);
      toast.success('已删除');
      setUsers(users.filter(x => x.id !== u.id));
    } catch (err) { toast.error(err.response?.data?.error || '删除失败'); }
  };

  return (
    <div>
      <p className="text-sm text-ink-light mb-4">共 {users.length} 位用户</p>
      <div className="card-scroll overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-wash/30 text-left text-ink-light">
              <th className="p-3">用户名</th><th className="p-3">邮箱</th>
              <th className="p-3">角色</th><th className="p-3">注册时间</th><th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-ink-wash/10 hover:bg-white/40">
                <td className="p-3 font-medium">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-seal-red/10 text-seal-red' : 'bg-tea-green/10 text-tea-green'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-ink-light">{u.created_at?.split('T')[0]}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => toggleRole(u)} className="text-tea-green hover:underline text-xs">
                    {u.role === 'admin' ? '降为用户' : '升为管理'}
                  </button>
                  <button onClick={() => handleDelete(u)} className="text-seal-red hover:underline text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
