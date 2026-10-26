import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 茶友留墨 —— 留言板
 * 像在宣纸上题字：右侧滑出，宣纸底色，红色印章点缀。
 */
function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function MessageBoard({ isOpen, onClose, teas = [] }) {
  const { user, isAdmin } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [teaName, setTeaName] = useState('');
  const [content, setContent] = useState('');

  // 打开时拉取留言
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    messageAPI.getAll()
      .then(({ data }) => setList(data?.messages || []))
      .catch(() => toast.error('留墨加载失败'))
      .finally(() => setLoading(false));
    // 登录用户自动带昵称
    if (user?.username) setNickname(user.username);
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) {
      toast.error('写下你的名号与字句再落墨');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await messageAPI.create({
        nickname: nickname.trim(),
        content: content.trim(),
        tea_name: teaName || null,
      });
      if (data?.message) {
        setList((prev) => [data.message, ...prev]);
        setContent('');
        setTeaName('');
        toast.success('留墨已落纸');
      }
    } catch (err) {
      toast.error(err.message || '落墨失败，再试一次');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要抹去这条留墨吗？')) return;
    try {
      await messageAPI.remove(id);
      setList((prev) => prev.filter((m) => m.id !== id));
      toast.success('已抹去');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || '删除失败');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[rgba(72,52,37,.045)] px-3 py-4 backdrop-blur-[1.5px]"
          onClick={onClose}
        >
          <motion.aside
            className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.92)] shadow-[0_24px_80px_rgba(93,70,49,.18)] backdrop-blur-2xl"
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.1, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <header className="flex items-center justify-between px-4 pt-3 pb-2">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">茶友留墨</h2>
                <p className="mt-0.5 text-[11px] text-[var(--ink-faint)]">
                  山水之间，落墨一笔茶缘
                </p>
              </div>
              <button type="button" className="icon-button" onClick={onClose} title="收起">x</button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pb-5">
              {/* 落墨表单 */}
              <form onSubmit={handleSubmit} className="rounded-[20px] bg-white/40 p-3 ring-1 ring-[rgba(156,123,82,.18)]">
                <div className="flex items-center gap-2">
                  {/* 红色印章感圆点 */}
                  <span className="inline-block h-5 w-5 shrink-0 rounded-[4px] bg-[#b5544a] shadow-[inset_0_-1px_2px_rgba(0,0,0,.2)]" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="你的名号"
                    maxLength={20}
                    className="w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 text-sm text-[var(--ink)] outline-none transition focus:border-[rgba(156,123,82,.4)]"
                  />
                </div>
                <select
                  value={teaName}
                  onChange={(e) => setTeaName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 text-sm text-[var(--ink-soft)] outline-none transition focus:border-[rgba(156,123,82,.4)]"
                >
                  <option value="">— 题在哪款茶下？（可选）—</option>
                  {teas.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} · {t.province}{t.city}</option>
                  ))}
                </select>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写几句茶感、一段旅途、或一句想说的话……"
                  rows={3}
                  maxLength={200}
                  className="mt-2 w-full resize-none rounded-xl border border-transparent bg-white/60 px-3 py-2 text-sm leading-6 text-[var(--ink)] outline-none transition focus:border-[rgba(156,123,82,.4)]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--ink-faint)]">{content.length}/200</span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-[#b5544a] px-5 py-1.5 text-sm text-[#fdf6ec] shadow-[0_6px_18px_rgba(181,84,74,.35)] transition hover:bg-[#a3463d] disabled:opacity-60"
                  >
                    {submitting ? '落墨中…' : '落 墨'}
                  </button>
                </div>
              </form>

              {/* 留言列表 */}
              <div className="mt-4 space-y-2.5">
                {loading && <p className="py-6 text-center text-xs text-[var(--ink-faint)]">研墨中…</p>}
                {!loading && list.length === 0 && (
                  <div className="rounded-[20px] bg-white/30 py-8 text-center">
                    <p className="font-serif text-sm text-[var(--ink-soft)]">还没有留墨</p>
                    <p className="mt-1 text-[11px] text-[var(--ink-faint)]">来做第一个在这方山水里题字的人</p>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {list.map((m) => (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-[18px] bg-white/45 p-3 ring-1 ring-[rgba(156,123,82,.14)]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-4 w-4 shrink-0 rounded-[3px] bg-[#b5544a]/85" />
                        <span className="text-sm font-semibold text-[var(--ink)]">{m.nickname}</span>
                        {m.tea_name && (
                          <span className="rounded-full bg-[rgba(143,174,140,.18)] px-2 py-0.5 text-[10px] text-[#5a7a58]">
                            {m.tea_name}
                          </span>
                        )}
                        <span className="ml-auto text-[10px] text-[var(--ink-faint)]">{formatTime(m.created_at)}</span>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(m.id)}
                            title="管理员删除"
                            className="ml-1 rounded px-1.5 py-0.5 text-[10px] text-[#b5544a]/70 transition hover:bg-[#b5544a]/10 hover:text-[#b5544a]"
                          >
                            删
                          </button>
                        )}
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[var(--ink-soft)]">{m.content}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

MessageBoard.displayName = 'MessageBoard';
export default MessageBoard;
