import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { favAPI, checkinAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [cityInput, setCityInput] = useState('');

  useEffect(() => {
    if (user) {
      favAPI.getAll().then(r => setFavorites(r.data.favorites)).catch(() => {});
      checkinAPI.getAll().then(r => setCheckins(r.data.checkins)).catch(() => {});
    }
  }, [user]);

  const handleCheckin = async () => {
    if (!cityInput.trim()) return;
    try {
      await checkinAPI.add(cityInput.trim());
      toast.success(`已打卡：${cityInput.trim()}`);
      setCityInput('');
      const r = await checkinAPI.getAll();
      setCheckins(r.data.checkins);
    } catch (err) { toast.error(err.response?.data?.error || '打卡失败'); }
  };

  const removeFav = async (teaId) => {
    await favAPI.remove(teaId);
    setFavorites(f => f.filter(x => x.id !== teaId));
    toast.success('已取消收藏');
  };

  const removeCheckin = async (id) => {
    await checkinAPI.remove(id);
    setCheckins(c => c.filter(x => x.id !== id));
    toast.success('已删除打卡');
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-light mb-4">请先登录</p>
          <Link to="/login" className="btn-seal no-underline">去登录</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* 用户信息 */}
      <div className="card-scroll p-6 mb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-tea-green/20 flex items-center justify-center text-2xl">🍵</div>
        <div>
          <h2 className="text-xl font-serif font-bold">{user.username}</h2>
          <p className="text-sm text-ink-light">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 收藏列表 */}
        <div className="card-scroll p-6">
          <h3 className="text-lg font-serif font-bold mb-4">❤️ 我的收藏 ({favorites.length})</h3>
          {favorites.length === 0 ? (
            <p className="text-ink-light text-sm">还没有收藏茶叶，去<Link to="/map" className="text-tea-green">地图</Link>探索吧</p>
          ) : (
            <div className="space-y-3">
              {favorites.map(tea => (
                <div key={tea.id} className="flex justify-between items-center p-3 rounded-xl bg-white/60">
                  <div>
                    <div className="font-medium text-sm">{tea.name}</div>
                    <div className="text-xs text-ink-light">{tea.province} {tea.city} · {tea.category}</div>
                  </div>
                  <button onClick={() => removeFav(tea.id)} className="text-seal-red text-sm hover:underline">取消</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 打卡列表 */}
        <div className="card-scroll p-6">
          <h3 className="text-lg font-serif font-bold mb-4">📍 我的打卡 ({checkins.length})</h3>
          <div className="flex gap-2 mb-4">
            <input value={cityInput} onChange={e => setCityInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheckin()}
              placeholder="输入城市名称打卡"
              className="flex-1 px-3 py-2 rounded-xl border border-ink-wash/40 bg-white/70 text-sm focus:outline-none focus:border-tea-green" />
            <button onClick={handleCheckin} className="btn-seal text-sm px-4">打卡</button>
          </div>
          {checkins.length === 0 ? (
            <p className="text-ink-light text-sm">还没有打卡记录</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {checkins.map(c => (
                <span key={c.id} onClick={() => removeCheckin(c.id)}
                  className="px-3 py-1.5 rounded-full bg-tea-green/10 text-tea-green text-sm cursor-pointer hover:bg-seal-red/10 hover:text-seal-red transition-colors">
                  📍 {c.city_name} ✕
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
