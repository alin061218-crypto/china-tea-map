import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { getMonths } from '../../utils/season.js';

const DEFAULT_CATEGORIES = ['全部', '绿茶', '红茶', '乌龙茶', '白茶', '黄茶', '黑茶', '花茶'];
const CATEGORY_ICON_FILES = {
  '绿茶': 'green',
  '红茶': 'red',
  '乌龙茶': 'oolong',
  '白茶': 'white',
  '黄茶': 'yellow',
  '黑茶': 'dark',
  '花茶': 'flower',
};

function categoryIconSrc(category) {
  return `/images/category/${CATEGORY_ICON_FILES[category] || 'green'}.png`;
}

function TeaCatalogPopup({ teas, isOpen, onClose, onTeaSelect }) {
  const [category, setCategory] = useState('全部');
  const categories = useMemo(() => ['全部', ...DEFAULT_CATEGORIES.filter((item) => item !== '全部' && teas.some((tea) => tea.category === item))], [teas]);
  const filtered = useMemo(() => category === '全部' ? teas : teas.filter((tea) => tea.category === category), [category, teas]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4" onClick={onClose}>
          <motion.div
            className="absolute inset-0 bg-[rgba(72,52,37,.045)] backdrop-blur-[1.5px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .82, ease: [0.25, 0.1, 0.1, 1] }}
          />
          <motion.section
            className="catalog-panel relative mb-5 flex flex-col"
            initial={{ y: 44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 44, opacity: 0 }}
            transition={{ duration: .92, ease: [0.25, 0.1, 0.1, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center pt-3"><span className="h-1 w-10 rounded-full bg-[rgba(150,125,95,.34)]" /></div>
            <header className="flex items-center justify-between px-5 py-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">茶信录</h3>
                <p className="mt-1 text-xs text-[var(--ink-faint)]">按茶类与采制时令查找产区</p>
              </div>
              <button type="button" onClick={onClose} className="icon-button" title="关闭">×</button>
            </header>
            <div className="flex gap-2 overflow-x-auto px-5 pb-3">
              {categories.map((item) => (
                <button key={item} type="button" onClick={() => setCategory(item)} className={`ui-pill text-sm ${category === item ? 'active' : ''}`}>{item}</button>
              ))}
            </div>
            <div className="overflow-y-auto px-5 pb-5">
              <div className="space-y-2">
                {filtered.map((tea) => {
                  const months = getMonths(tea.maturity_months).slice(0, 3);
                  return (
                    <button
                      type="button"
                      key={tea.id}
                      onClick={() => { onTeaSelect?.(tea); onClose(); }}
                      className="grid w-full grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 rounded-[20px] bg-white/26 p-3 text-left transition duration-[920ms] ease-out hover:bg-white/38"
                    >
                      <img
                        src={categoryIconSrc(tea.category)}
                        alt={tea.category}
                        className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[var(--ink)]">{tea.name}</span>
                        <span className="mt-1 block truncate text-xs text-[var(--ink-faint)]">{tea.province} · {tea.city} · {tea.category}</span>
                      </span>
                      <span className="flex flex-wrap justify-end gap-1">
                        {months.length ? months.map((month) => <span key={month} className="month-tag active">{month}月</span>) : <span className="month-tag">四季</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

TeaCatalogPopup.displayName = 'TeaCatalogPopup';

export default TeaCatalogPopup;
