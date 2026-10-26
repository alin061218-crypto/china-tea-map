import { Fragment, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { getMonths } from '../../utils/season.js';
import { hasModernForms, getProductImageSrc } from '../../utils/modernTea.js';
import { TEA_CLASS_KNOWLEDGE } from '../../data/teaKnowledge.js';

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

function ModernFormsBlock({ tea }) {
  if (!hasModernForms(tea)) return null;
  return (
    <section className="mt-4 rounded-[20px] bg-white/34 p-3">
      <div className="mb-2 text-sm font-semibold text-[var(--ink)]">现代茶饮 · 茶底溯源</div>
      <div className="space-y-2">
        {tea.modern_forms.map((form, index) => (
          <div key={`${form.brand}-${form.product}-${index}`} className="rounded-2xl bg-white/34 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[rgba(139,127,174,.14)] px-2 py-0.5 text-[11px] text-[var(--ink-soft)]">{form.type}</span>
              <p className="text-sm font-semibold text-[var(--ink)]">{form.brand} · {form.product}</p>
            </div>
            <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">{form.note}</p>
          </div>
        ))}
      </div>
      {tea.beverage_chain && (
        <p className="mt-2 rounded-2xl bg-white/26 px-3 py-2 text-xs leading-6 text-[var(--ink-soft)]">
          溯源链路：{tea.beverage_chain}
        </p>
      )}
    </section>
  );
}

function ProductDetail({ product, onClose, onBackToOrigin }) {
  return (
    <motion.aside
      className="relative flex h-full w-full max-w-[410px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.82)] shadow-[0_24px_80px_rgba(93,70,49,.16)] backdrop-blur-2xl"
      initial={{ x: 32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 32, opacity: 0 }}
      transition={{ duration: .96, ease: [0.25, 0.1, 0.1, 1] }}
      onClick={(event) => event.stopPropagation()}
    >
      <header className="flex items-center justify-between px-4 py-3">
        <button type="button" onClick={onClose} className="icon-button" title="关闭">x</button>
        <div className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">{product.brand} · {product.type}</div>
      </header>

      <div className="overflow-y-auto px-4 pb-5">
        <div className="mx-auto mb-4 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-white/45 p-3">
          <img
            src={getProductImageSrc(product.name) || '/images/beverage/moli-longjing.jpg'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="hidden flex-col items-center gap-1 text-[var(--ink-faint)]">
            <span className="text-xs">{product.name} 图片</span>
          </div>
        </div>

        <section className="mt-4">
          <div className="flex items-end gap-2">
            <h2 className="font-serif text-2xl font-semibold text-[var(--ink)]">{product.name}</h2>
            <span className="pb-1 text-xs text-[var(--ink-faint)]">{product.type}</span>
          </div>
          <p className="mt-3 rounded-2xl bg-white/30 px-4 py-3 text-sm leading-7 text-[var(--ink-soft)]">{product.note}</p>
        </section>

        <section className="mt-4 rounded-[20px] bg-white/34 p-3">
          <div className="mb-2 text-sm font-semibold text-[var(--ink)]">茶底溯源 · 原料产地</div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/34 px-3 py-2">
            <CheckinPinIcon />
            <p className="text-sm font-semibold text-[var(--ink)]">{product.anchorTeaName}</p>
            <span className="text-xs text-[var(--ink-faint)]">{product.anchorProvince} · {product.anchorCity}</span>
          </div>
          {product.beverage_chain && (
            <p className="mt-2 rounded-2xl bg-white/26 px-3 py-2 text-xs leading-6 text-[var(--ink-soft)]">
              溯源链路：{product.beverage_chain}
            </p>
          )}
          <button
            type="button"
            className="ui-pill mt-3 w-full justify-center"
            onClick={() => onBackToOrigin?.(product.anchorTeaId)}
          >
            查看原料产地茶 →
          </button>
        </section>

        <p className="mt-3 px-1 text-[11px] leading-5 text-[var(--ink-faint)]">
          品牌与产品信息依据品牌公开产品信息整理，仅用于学术研究展示。
        </p>
      </div>
    </motion.aside>
  );
}

export default function TeaDetailPanel({ item, onClose, onBackToOrigin }) {
  const product = item?.kind === 'product' ? item.data : null;
  const tea = item?.kind === 'tea' ? item.data : null;
  const months = useMemo(() => getMonths(tea?.maturity_months), [tea]);
  const knowledge = tea ? TEA_CLASS_KNOWLEDGE[tea.categoryEn] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-[rgba(72,52,37,.045)] px-3 py-4 backdrop-blur-[1.5px]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .82, ease: [0.25, 0.1, 0.1, 1] }}
        >
          {product ? (
            <ProductDetail product={product} onClose={onClose} onBackToOrigin={onBackToOrigin} />
          ) : tea ? (
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
                    loading="lazy"
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
                    {knowledge && <span className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">茶水比 {knowledge.ratio}</span>}
                    {knowledge && <span className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">茶具 {knowledge.ware}</span>}
                  </div>
                </section>

                {knowledge && (
                  <>
                    <section className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-[var(--ink)]">制茶工艺</div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {knowledge.craft.map((step, index) => (
                          <Fragment key={step}>
                            {index > 0 && <span className="text-[var(--ink-faint)]">→</span>}
                            <span className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">{step}</span>
                          </Fragment>
                        ))}
                      </div>
                    </section>

                    <section className="mt-4 rounded-[20px] bg-white/34 p-3">
                      <div className="mb-2 text-sm font-semibold text-[var(--ink)]">存茶指南</div>
                      <p className="rounded-2xl bg-white/30 px-3 py-2 text-xs leading-6 text-[var(--ink-soft)]">{knowledge.storage}</p>
                    </section>
                  </>
                )}

                <section className="mt-4">
                  <div className="mb-2 text-sm font-semibold text-[var(--ink)]">典故</div>
                  <p className="rounded-2xl bg-white/30 p-4 font-serif text-sm italic leading-7 text-[var(--ink-soft)]">{tea.story}</p>
                </section>

                <ModernFormsBlock tea={tea} />

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
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
