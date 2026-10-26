// 茶品管理：缩略图列 + 搜索 + 分类筛选 + 完整表单（含现代茶饮关联字段）
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
  category_en: '',
  slug: '',
  maturity_months: '',
  seasons: '',
  local_characteristics: '',
  appearance: '',
  history: '',
  spirit: '',
  meaning: '',
  brewing_temp: '',
  brewing_time: '',
  story: '',
  checkin_spots: '',
  modern_forms: '',
  beverage_chain: '',
  image_url: '',
  is_mountain: 0,
};

const textFields = [
  ['name', '名称'],
  ['province', '省份'],
  ['city', '城市'],
  ['category', '分类'],
  ['category_en', '分类标识'],
  ['slug', '图片ID(slug)'],
  ['maturity_months', '采制月份'],
  ['seasons', '季节'],
  ['brewing_temp', '冲泡水温'],
  ['brewing_time', '冲泡时长'],
  ['image_url', '图片路径'],
  ['beverage_chain', '现代茶饮溯源链'],
];

const longFields = [
  ['local_characteristics', '地方风俗'],
  ['appearance', '外形'],
  ['history', '历史'],
  ['spirit', '精神'],
  ['meaning', '寓意'],
  ['story', '文化故事'],
];

const CATEGORY_OPTIONS = [
  ['绿茶', 'green'], ['红茶', 'black'], ['乌龙茶', 'oolong'],
  ['白茶', 'white'], ['黄茶', 'yellow'], ['黑茶', 'dark'], ['花茶', 'flower'],
];

// 数据库行 → 表单值（JSON 列转为可编辑文本）
function rowToForm(tea) {
  let spots = '';
  try {
    const arr = typeof tea.checkin_spots === 'string' ? JSON.parse(tea.checkin_spots) : tea.checkin_spots;
    spots = Array.isArray(arr) ? arr.join('\n') : '';
  } catch (e) { /* 保留空 */ }
  let forms = '';
  try {
    const arr = typeof tea.modern_forms === 'string' ? JSON.parse(tea.modern_forms) : tea.modern_forms;
    forms = Array.isArray(arr) ? JSON.stringify(arr, null, 2) : '';
  } catch (e) { forms = tea.modern_forms || ''; }
  return {
    ...emptyTea,
    ...tea,
    checkin_spots: spots,
    modern_forms: forms,
    is_mountain: tea.is_mountain ? 1 : 0,
  };
}

function TeaForm({ tea, onClose, onSaved }) {
  const [form, setForm] = useState(() => (tea ? rowToForm(tea) : { ...emptyTea }));
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
        // 打卡点：每行一个 → JSON 数组
        checkin_spots: form.checkin_spots.split('\n').map((s) => s.trim()).filter(Boolean),
        // 现代茶饮关联：保留 JSON 字符串原样（后端解析）
        modern_forms: form.modern_forms.trim() || null,
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
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">打卡点（每行一个）</span>
            <textarea className="min-h-20 w-full rounded-xl border border-white/60 bg-white/36 px-3 py-2 text-sm leading-6 text-[var(--ink)] outline-none" value={form.checkin_spots ?? ''} onChange={(event) => update('checkin_spots', event.target.value)} placeholder={'例如：\n西湖风景名胜区\n龙井村'} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[var(--ink-soft)]">现代茶饮关联（JSON 数组）</span>
            <textarea className="min-h-28 w-full rounded-xl border border-white/60 bg-white/36 px-3 py-2 font-mono text-xs leading-5 text-[var(--ink)] outline-none" value={form.modern_forms ?? ''} onChange={(event) => update('modern_forms', event.target.value)} placeholder='[{"type":"瓶装即饮茶","brand":"果子熟了","product":"栀栀乌龙","note":"说明文字","anchor":{"province":"福建","city":"武夷山","latitude":28.08,"longitude":118.32}}]' />
          </label>
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

function TeaThumb({ tea }) {
  if (tea.is_mountain) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ink)]/8 text-[var(--ink-faint)]" title="山脉区域">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18h18L15 8l-3.5 5-2.5-3L3 18Z" />
        </svg>
      </div>
    );
  }
  const src = `/images/tea/${tea.category_en || 'green'}/${tea.slug || tea.id}.jpg`;
  return (
    <img
      src={src}
      alt={tea.name}
      className="h-10 w-10 rounded-lg object-cover shadow-sm"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = `/images/tea-icons/${tea.category_en || 'green'}.png`;
      }}
    />
  );
}

export default function TeaManager() {
  const [teas, setTeas] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

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

  const visibleTeas = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return teas.filter((tea) => {
      if (filter === 'mountain' && !tea.is_mountain) return false;
      if (filter !== 'all' && filter !== 'mountain' && (tea.is_mountain || tea.category !== filter)) return false;
      if (kw) {
        const hay = `${tea.name} ${tea.province} ${tea.city} ${tea.category} ${tea.category_en || ''}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [teas, search, filter]);

  async function removeTea(tea) {
    if (!window.confirm(`确认删除 ${tea.name}？`)) return;
    if (!window.confirm('删除后无法恢复，仍要继续吗？')) return;
    await adminAPI.deleteTea(tea.id);
    loadTeas();
  }

  return (
    <section className="rounded-[26px] bg-white/20 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="h-9 w-56 rounded-xl border border-white/60 bg-white/36 px-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            placeholder="搜索名称 / 省份 / 城市 / 分类"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="h-9 rounded-xl border border-white/60 bg-white/36 px-3 text-sm text-[var(--ink)] outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">全部分类</option>
            {CATEGORY_OPTIONS.map(([label, en]) => (
              <option key={en} value={label}>{label}</option>
            ))}
            <option value="mountain">山脉区域</option>
          </select>
          <span className="text-sm text-[var(--ink-soft)]">{loading ? '加载中...' : `共 ${visibleTeas.length} / ${teas.length} 条`}</span>
        </div>
        <button type="button" className="ui-pill active" onClick={() => setEditing({})}>新增茶品</button>
      </div>
      {error && <div className="mb-3 rounded-2xl bg-white/30 p-3 text-sm text-red-400">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-y-1 text-left text-sm">
          <thead className="text-xs text-[var(--ink-faint)]">
            <tr>
              <th className="px-3 py-2">茶品</th>
              <th className="px-3 py-2">省份</th>
              <th className="px-3 py-2">分类</th>
              <th className="px-3 py-2">冲泡</th>
              <th className="px-3 py-2">现代茶饮</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {visibleTeas.map((tea) => {
              let modernCount = 0;
              try {
                const arr = typeof tea.modern_forms === 'string' ? JSON.parse(tea.modern_forms) : tea.modern_forms;
                modernCount = Array.isArray(arr) ? arr.length : 0;
              } catch (e) { modernCount = 0; }
              return (
                <tr key={tea.id} className="hover:bg-white/20">
                  <td className="rounded-l-xl px-3 py-3">
                    <div className="flex items-center gap-3">
                      <TeaThumb tea={tea} />
                      <div>
                        <div className="font-semibold text-[var(--ink)]">{tea.name}</div>
                        {tea.is_mountain ? (
                          <div className="text-xs text-[var(--ink-faint)]">山脉 / 无产茶区域</div>
                        ) : (
                          <div className="text-xs text-[var(--ink-faint)]">{tea.city}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[var(--ink-soft)]">{tea.province}</td>
                  <td className="px-3 py-3 text-[var(--ink-soft)]">
                    <span className="flex items-center gap-1.5">
                      {!tea.is_mountain && (
                        <img src={`/images/tea-icons/${tea.category_en || 'green'}.png`} alt="" className="h-4 w-4 object-contain" />
                      )}
                      {tea.category || '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[var(--ink-soft)]">
                    {tea.brewing_temp ? `${tea.brewing_temp} · ${tea.brewing_time || ''}` : '—'}
                  </td>
                  <td className="px-3 py-3 text-[var(--ink-soft)]">
                    {modernCount > 0 ? <span className="rounded-full bg-[var(--ink)]/8 px-2.5 py-1 text-xs text-[var(--ink)]">{modernCount} 个产品</span> : '—'}
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="ui-pill min-h-8 px-3 text-xs" onClick={() => setEditing(tea)}>编辑</button>
                      <button type="button" className="ui-pill min-h-8 px-3 text-xs text-red-400 hover:bg-red-50" onClick={() => removeTea(tea)}>删除</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visibleTeas.length === 0 && (
              <tr>
                <td colSpan="6" className="px-3 py-10 text-center text-sm text-[var(--ink-faint)]">没有匹配的茶品</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {editing && <TeaForm tea={editing.id ? editing : null} onClose={() => setEditing(null)} onSaved={loadTeas} />}
      </AnimatePresence>
    </section>
  );
}
