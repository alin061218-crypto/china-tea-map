import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeaCatalogPopup({ teas, isOpen, onClose, onTeaSelect }) {
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const categories = ['全部', '绿茶', '红茶', '乌龙茶', '白茶', '黄茶', '黑茶', '花茶'];

  const filtered = categoryFilter === '全部'
    ? teas.filter(t => !t.is_mountain)
    : teas.filter(t => t.category === categoryFilter);

  const monthLabels = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.06)' }} />
          <motion.div className="relative w-full max-w-lg max-h-[70vh] flex flex-col z-50"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(255,253,250,0.96)',
              backdropFilter: 'blur(24px)',
              borderRadius: '20px 20px 0 0',
              borderTop: '1px solid rgba(200,190,175,0.3)',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.06)',
            }}>

            {/* 顶部拖动条 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(200,190,175,0.5)' }} />
            </div>

            {/* 标题 */}
            <div className="px-5 py-2 flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-ink-darkest">茶信录</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-ink-light hover:bg-ink-wash/20">✕</button>
            </div>

            {/* 分类筛选 */}
            <div className="px-5 py-2 flex gap-1.5 overflow-x-auto">
              {categories.map(c => (
                <button key={c} onClick={() => setCategoryFilter(c)}
                  className={`btn-ghost text-xs whitespace-nowrap ${categoryFilter === c ? 'active font-medium' : ''}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* 茶叶列表 */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <div className="space-y-1">
                {filtered.map(tea => {
                  const months = tea.maturity_months?.match(/\d+/g)?.map(Number) || [];
                  return (
                    <div key={tea.id}
                      onClick={() => { onTeaSelect(tea); onClose(); }}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/70"
                      style={{ background: 'rgba(250,246,240,0.5)' }}>
                      {/* 茶图标 */}
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: 'rgba(200,220,200,0.3)' }}>
                        🍵
                      </div>
                      {/* 茶名+产区 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-dark truncate">{tea.name}</p>
                        <p className="text-xs text-ink-light truncate">{tea.province} · {tea.city} · {tea.category}</p>
                      </div>
                      {/* 月份标签 */}
                      <div className="flex gap-0.5 flex-shrink-0">
                        {months.slice(0, 3).map(m => (
                          <span key={m} className="month-tag active text-xs" style={{ minWidth: '24px', height: '20px', fontSize: '10px' }}>
                            {m}月
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-sm text-ink-light py-10">该分类暂无茶叶</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
