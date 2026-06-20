import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('密码至少6位'); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('注册成功！');
      nav('/map');
    } catch (err) {
      toast.error(err.response?.data?.error || '注册失败');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="card-scroll w-full max-w-sm p-8 mx-4">
        <h2 className="text-2xl font-serif font-bold text-center mb-6">注 册</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
            placeholder="用户名" required
            className="w-full px-4 py-3 rounded-xl border border-ink-wash/40 bg-white/70 text-ink-dark placeholder-ink-light focus:outline-none focus:border-tea-green" />
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            type="email" placeholder="邮箱" required
            className="w-full px-4 py-3 rounded-xl border border-ink-wash/40 bg-white/70 text-ink-dark placeholder-ink-light focus:outline-none focus:border-tea-green" />
          <input value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            type="password" placeholder="密码（至少6位）" required
            className="w-full px-4 py-3 rounded-xl border border-ink-wash/40 bg-white/70 text-ink-dark placeholder-ink-light focus:outline-none focus:border-tea-green" />
          <button type="submit" disabled={loading}
            className="btn-seal w-full py-3 text-base">
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="text-center text-sm text-ink-light mt-4">
          已有账号？<Link to="/login" className="text-tea-green no-underline hover:underline">登录</Link>
        </p>
      </div>
    </div>
  );
}
