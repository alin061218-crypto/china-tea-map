import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { getMonths } from '../../utils/season.js';

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

function CheckinPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      className="h-3.5 w-3.5 shrink-0 text-[var(--ink-faint)]"
      fill="none"
    >
      <circle cx="7" cy="4.5" r="2.5" fill="currentColor" />
      <path d="M7 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function TeaDetailPanel({ tea, onClose }) {
  const months = useMemo(() => getMonths(tea?.maturity_months), [tea]);

  return (
    <AnimatePresence>
      {tea && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-[rgba(72,52,37,.045)] px-3 py-4 backdrop-blur-[1.5px]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .82, ease: [0.25, 0.1, 0.1, 1] }}
        >
          <motion.aside
            className="relative flex h-full w-full max-w-[410px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.82)] shadow-[0_24px_80px_rgba(93,70,49,.16)] backdrop-blur-2xl"
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: .96, ease: [0.25, 0.1, 0.1, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between px-4 py-3">
              <button type="button" onClick={onClose} className="icon-button" title="Close detail">x</button>
              <div className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">{tea.province} / {tea.city}</div>
            </header>

            <div className="overflow-y-auto px-4 pb-5">
              <div className="mx-auto mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--panel)]">
                <img
                  src={`/images/tea/${tea.categoryEn || 'green'}/${tea.id}.jpg`}
                  alt={tea.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden flex-col items-center gap-1 text-[var(--ink-faint)]">
                  <img
                    src={categoryIconSrc(tea.category)}
                    alt={tea.category}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <span className="text-xs">{tea.name} 图片</span>
                </div>
              </div>

              <section className="mt-4">
                <div className="flex items-end gap-2">
                  <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">{tea.name}</h2>
                  <span className="pb-1 text-xs text-[var(--ink-faint)]">{tea.category}</span>
                </div>
                <p className="mt-3 rounded-2xl bg-white/30 px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">{tea.meaning}</p>
              </section>

              <section className="mt-4">
                <div className="mb-2 text-sm font-semibold text-[var(--ink)]">冲泡指南</div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">水温 {tea.brewingTemp}</span>
                  <span className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">浸泡 {tea.brewingTime}</span>
                </div>
              </section>

              <section className="mt-4">
                <div className="mb-2 text-sm font-semibold text-[var(--ink)]">典故</div>
                <p className="rounded-2xl bg-white/30 p-4 font-serif text-sm italic leading-7 text-[var(--ink-soft)]">{tea.story}</p>
              </section>

              <section className="mt-4 rounded-[20px] bg-white/34 p-3">
                <div className="mb-2 text-sm font-semibold text-[var(--ink)]">打卡地</div>
                <div className="space-y-2">
                  {tea.checkinSpots.map((spot) => (
                    <div key={spot} className="flex items-center gap-2 rounded-2xl bg-white/34 px-3 py-2">
                      <CheckinPinIcon />
                      <p className="text-sm font-semibold text-[var(--ink)]">{spot}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-[20px] bg-white/34 p-3">
                <div className="mb-3 text-sm font-semibold text-[var(--ink)]">Harvest months</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <span key={month} className={`month-tag ${months.includes(month) ? 'active' : ''}`}>{month}</span>
                  ))}
                </div>
              </section>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
