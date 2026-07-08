import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const ease = [0.25, 0.1, 0.1, 1];

function Field({ label, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-xl border border-white/60 bg-white/36 px-3 text-sm text-[var(--ink)] outline-none transition focus:border-[rgba(142,113,83,.38)] focus:bg-white/52"
      />
    </label>
  );
}

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    setSubmitting(false);
  }, [isOpen, mode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(err.message || '操作失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(72,52,37,.08)] px-4 py-6 backdrop-blur-[2px]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="relative w-full max-w-[390px] overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.82)] p-5 shadow-[0_24px_80px_rgba(93,70,49,.16)] backdrop-blur-2xl"
            onClick={(event) => event.stopPropagation()}
            initial={{ y: 16, scale: 0.98, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 14, scale: 0.985, opacity: 0, filter: 'blur(3px)' }}
            transition={{ duration: 0.68, ease }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="auth-modal-title" className="font-serif text-2xl font-semibold text-[var(--ink)]">
                  {mode === 'login' ? '登录' : '注册'}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">把你的茶迹留在这张地图上。</p>
              </div>
              <button type="button" className="icon-button" onClick={onClose} title="关闭">x</button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-full bg-white/30 p-1">
              <button
                type="button"
                className={`ui-pill min-h-9 px-3 text-sm ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                登录
              </button>
              <button
                type="button"
                className={`ui-pill min-h-9 px-3 text-sm ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                注册
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Field label="用户名" value={username} onChange={setUsername} autoComplete="username" />
              {mode === 'register' && (
                <Field label="邮箱" type="email" value={email} onChange={setEmail} autoComplete="email" />
              )}
              <Field label="密码" type="password" value={password} onChange={setPassword} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />

              <div className="min-h-[18px] text-xs leading-5 text-red-500">{error}</div>

              <button type="submit" className="ui-pill active h-11 w-full text-sm font-semibold" disabled={submitting}>
                {submitting ? '请稍候' : mode === 'login' ? '登录' : '注册'}
              </button>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
