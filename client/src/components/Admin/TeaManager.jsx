// Manages tea records from the admin API.
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { adminAPI } from '../../services/api';

const emptyTea = {
  name: '',
  province: '',
  city: '',
  latitude: '',
  longitude: '',
  category: '',
  maturity_months: '',
  seasons: '',
  local_characteristics: '',
  appearance: '',
  history: '',
  spirit: '',
  meaning: '',
  image_url: '',
  is_mountain: 0,
};

const textFields = [
  ['name', '名称'],
  ['province', '省份'],
  ['city', '城市'],
  ['category', '分类'],
  ['maturity_months', '采制月份'],
  ['seasons', '季节'],
  ['image_url', '图片路径'],
];

const longFields = [
  ['local_characteristics', '地方风俗'],
  ['appearance', '外形'],
  ['history', '历史'],
  ['spirit', '精神'],
  ['meaning', '寓意'],
];

function TeaForm({ tea, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({ ...emptyTea, ...tea }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(tea?.id);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        is_mountain: form.is_mountain ? 1 : 0,
      };
      if (isEdit) {
        await adminAPI.updateTea(tea.id, payload);
      } else {
        await adminAPI.createTea(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(72,52,37,.08)] px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.88)] p-5 shadow-[0_24px_80px_rgba(93,70,49,.16)] backdrop-blur-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 18, opacity: 0 }}
        transition={{ duration: 0.42, ease: [0.25, 0.1, 0.1, 1] }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">{isEdit ? '编辑茶品' : '新增茶品'}</h2>
          <button type="button" className="icon-button" onClick={onClose} title="关闭">x</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {textFields.map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">{label}</span>
              <input className="h-11 w-full rounded-xl border border-white/60 bg-white/36 px-3 text-sm text-[var(--ink)] outline-none" value={form[field] ?? ''} onChange={(event) => update(field, event.target.value)} />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">纬度</span>
            <input type="number" step="0.01" className="h-11 w-full rounded-xl border border-white/60 bg-white/36 px-3 text-sm text-[var(--ink)] outline-none" value={form.latitude ?? ''} onChange={(event) => update('latitude', event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">经度</span>
            <input type="number" step="0.01" className="h-11 w-full rounded-xl border border-white/60 bg-white/36 px-3 text-sm text-[var(--ink)] outline-none" value={form.longitude ?? ''} onChange={(event) => update('longitude', event.target.value)} />
          </label>
          <label className="flex items-center gap-2 rounded-xl bg-white/30 px-3 py-3 text-sm text-[var(--ink-soft)]">
            <input type="checkbox" checked={Boolean(form.is_mountain)} onChange={(event) => update('is_mountain', event.target.checked ? 1 : 0)} />
            山脉/无产茶区域
          </label>
        </div>

        <div className="mt-4 grid gap-4">
          {longFields.map(([field, label]) => (
            <label key={field} className="block">
              <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">{label}</span>
              <textarea className="min-h-20 w-full rounded-xl border border-white/60 bg-white/36 px-3 py-2 text-sm leading-6 text-[var(--ink)] outline-none" value={form[field] ?? ''} onChange={(event) => update(field, event.target.value)} />
            </label>
          ))}
        </div>

        <div className="mt-4 min-h-[18px] text-xs text-red-400">{error}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="ui-pill" onClick={onClose}>取消</button>
          <button type="submit" className="ui-pill active" disabled={saving}>{saving ? '保存中' : '保存'}</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default function TeaManager() {
  const [teas, setTeas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const sortedTeas = useMemo(() => teas, [teas]);

  async function loadTeas() {
    setError('');
    setLoading(true);
    try {
      const { data } = await adminAPI.getTeas();
      setTeas(data.teas || []);
    } catch (err) {
      setError(err.message || '茶品加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeas();
  }, []);

  async function removeTea(tea) {
    if (!window.confirm(`确认删除 ${tea.name}？`)) return;
    if (!window.confirm('删除后无法恢复，仍要继续吗？')) return;
    await adminAPI.deleteTea(tea.id);
    loadTeas();
  }

  return (
    <section className="rounded-[26px] bg-white/20 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-[var(--ink-soft)]">{loading ? '加载中...' : `共 ${teas.length} 条茶品`}</div>
        <button type="button" className="ui-pill active" onClick={() => setEditing({})}>新增茶品</button>
      </div>
      {error && <div className="mb-3 rounded-2xl bg-white/30 p-3 text-sm text-red-400">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-separate border-spacing-y-1 text-left text-sm">
          <thead className="text-xs text-[var(--ink-faint)]">
            <tr>
              <th className="px-3 py-2">名称</th>
              <th className="px-3 py-2">省份</th>
              <th className="px-3 py-2">分类</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeas.map((tea) => (
              <tr key={tea.id} className="hover:bg-white/20">
                <td className="rounded-l-xl px-3 py-3 font-semibold text-[var(--ink)]">{tea.name}</td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{tea.province}</td>
                <td className="px-3 py-3 text-[var(--ink-soft)]">{tea.category}</td>
                <td className="rounded-r-xl px-3 py-3">
                  <div className="flex gap-2">
                    <button type="button" className="ui-pill min-h-8 px-3 text-xs" onClick={() => setEditing(tea)}>编辑</button>
                    <button type="button" className="ui-pill min-h-8 px-3 text-xs text-red-400 hover:bg-red-50" onClick={() => removeTea(tea)}>删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {editing && <TeaForm tea={editing.id ? editing : null} onClose={() => setEditing(null)} onSaved={loadTeas} />}
      </AnimatePresence>
    </section>
  );
}
