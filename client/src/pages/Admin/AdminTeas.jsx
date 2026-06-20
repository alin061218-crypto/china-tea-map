import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const emptyTea = {
  name: '', province: '', city: '', latitude: '', longitude: '',
  category: '', maturity_months: '', seasons: '', local_characteristics: '',
  appearance: '', history: '', spirit: '', meaning: '', is_mountain: 0
};

export default function AdminTeas() {
  const [teas, setTeas] = useState([]);
  const [edit, setEdit] = useState(null); // null=列表, object=编辑, 'new'=新增
  const [form, setForm] = useState(emptyTea);

  const load = async () => {
    const { data } = await adminAPI.getTeas();
    setTeas(data.teas);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (edit === 'new') {
        await adminAPI.createTea({ ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) });
        toast.success('已添加');
      } else {
        await adminAPI.updateTea(edit.id, { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) });
        toast.success('已更新');
      }
      setEdit(null); setForm(emptyTea); load();
    } catch (err) { toast.error(err.response?.data?.error || '保存失败'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除？')) return;
    await adminAPI.deleteTea(id);
    toast.success('已删除');
    load();
  };

  const startEdit = (tea) => { setEdit(tea); setForm({ ...tea }); };
  const startNew = () => { setEdit('new'); setForm(emptyTea); };

  if (edit) {
    return (
      <div className="card-scroll p-6">
        <h3 className="text-lg font-serif font-bold mb-4">{edit === 'new' ? '新增茶叶' : '编辑茶叶'}</h3>
        <div className="grid grid-cols-2 gap-3">
          {['name','province','city','category','maturity_months','seasons','latitude','longitude'].map(f => (
            <input key={f} placeholder={f} value={form[f] || ''} onChange={e => setForm({...form, [f]: e.target.value})}
              className="px-3 py-2 rounded-lg border border-ink-wash/40 bg-white/70 text-sm" />
          ))}
          {['local_characteristics','appearance','history','spirit','meaning'].map(f => (
            <textarea key={f} placeholder={f} value={form[f] || ''} onChange={e => setForm({...form, [f]: e.target.value})}
              className="col-span-2 px-3 py-2 rounded-lg border border-ink-wash/40 bg-white/70 text-sm" rows={2} />
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} className="btn-seal text-sm">保存</button>
          <button onClick={() => setEdit(null)} className="btn-ghost text-sm">取消</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-ink-light">共 {teas.length} 条</span>
        <button onClick={startNew} className="btn-seal text-sm">+ 新增茶叶</button>
      </div>
      <div className="card-scroll overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-wash/30 text-left text-ink-light">
              <th className="p-3">名称</th><th className="p-3">省份</th><th className="p-3">类别</th>
              <th className="p-3">类型</th><th className="p-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {teas.map(t => (
              <tr key={t.id} className="border-b border-ink-wash/10 hover:bg-white/40">
                <td className="p-3 font-medium">{t.name}</td>
                <td className="p-3">{t.province}</td>
                <td className="p-3">{t.category}</td>
                <td className="p-3">{t.is_mountain ? '⛰️山脉' : '🍵茶叶'}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => startEdit(t)} className="text-tea-green hover:underline text-xs">编辑</button>
                  <button onClick={() => handleDelete(t.id)} className="text-seal-red hover:underline text-xs">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
