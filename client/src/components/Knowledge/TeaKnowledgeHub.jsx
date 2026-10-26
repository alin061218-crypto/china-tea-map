import { AnimatePresence, motion } from 'framer-motion';

import {
  TEA_CLASS_PROFILES,
  TEA_CLASS_KNOWLEDGE,
  BREWING_GUIDE,
  CRAFT_OVERVIEW,
  CRAFT_STEPS,
} from '../../data/teaKnowledge.js';

function SectionTitle({ children }) {
  return (
    <div className="mb-2 mt-5 flex items-center gap-2 first:mt-0">
      <span className="inline-block h-[14px] w-[3px] rounded-full bg-[rgba(139,127,174,.55)]" />
      <span className="text-sm font-semibold text-[var(--ink)]">{children}</span>
    </div>
  );
}

function Img({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(event) => { event.currentTarget.style.display = 'none'; }}
    />
  );
}

/**
 * 茶事百科独立板块：六大茶类档案 / 制茶工艺全景 / 品茶方法 / 存储保鲜
 * 知识依据公开茶文化科普资料整理，图片来源于网络，仅学术展示。
 */
function TeaKnowledgeHub({ isOpen, onClose }) {
  const profiles = Object.values(TEA_CLASS_PROFILES);
  const storageList = Object.values(TEA_CLASS_KNOWLEDGE);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
          <motion.div
            className="absolute inset-0 bg-[rgba(72,52,37,.05)] backdrop-blur-[1.5px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .82, ease: [0.25, 0.1, 0.1, 1] }}
          />
          <motion.section
            className="relative flex max-h-[86vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.92)] shadow-[0_24px_80px_rgba(93,70,49,.16)] backdrop-blur-2xl"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: .92, ease: [0.25, 0.1, 0.1, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between px-5 py-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">茶事百科</h3>
                <p className="mt-1 text-xs text-[var(--ink-faint)]">六大茶类 · 制茶工艺 · 品鉴 · 存茶</p>
              </div>
              <button type="button" onClick={onClose} className="icon-button" title="关闭">×</button>
            </header>

            <div className="overflow-y-auto px-5 pb-6">
              {/* ① 六大茶类档案 */}
              <SectionTitle>六大茶类档案</SectionTitle>
              <div className="space-y-3">
                {profiles.map((profile) => (
                  <div key={profile.name} className="overflow-hidden rounded-2xl bg-white/40">
                    <div className="flex gap-3 p-3">
                      <Img src={profile.image} alt={profile.name} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[rgba(139,127,174,.14)] px-2 py-0.5 text-[11px] text-[var(--ink-soft)]">{profile.name}</span>
                          <span className="text-[11px] text-[var(--ink-faint)]">汤色 {profile.teaColor}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">{profile.intro}</p>
                        <p className="mt-1 text-[11px] leading-5 text-[var(--ink-faint)]">代表茶：{profile.represent.join('、')}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/40 bg-white/26 px-3 py-2">
                      <p className="text-xs leading-6 text-[var(--ink-soft)]">工艺：{profile.craft.join(' → ')}</p>
                      <p className="text-xs leading-6 text-[var(--ink-soft)]">口感：{profile.taste} · 茶具：{profile.ware} · 茶水比：{profile.ratio}</p>
                      <p className="text-xs leading-6 text-[var(--ink-soft)]">存茶：{profile.storage}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ② 制茶工艺全景 */}
              <SectionTitle>制茶工艺全景</SectionTitle>
              <div className="space-y-2">
                {CRAFT_STEPS.map((step) => (
                  <div key={step.name} className="flex gap-3 rounded-2xl bg-white/30 p-3">
                    {step.image && <Img src={step.image} alt={step.name} className="h-16 w-24 flex-shrink-0 rounded-xl object-cover" />}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">{step.name}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-2xl bg-white/30 px-3 py-3">
                <p className="text-sm font-semibold text-[var(--ink)]">六大茶类工艺差异</p>
                {CRAFT_OVERVIEW.map((item) => (
                  <p key={item.name} className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">{item.name}：{item.chain}（{item.note}）</p>
                ))}
              </div>

              {/* ③ 品茶方法 · 四要素 */}
              <SectionTitle>品茶方法 · 四要素</SectionTitle>
              <div className="mb-2 flex gap-3 rounded-2xl bg-white/30 p-3">
                <Img src="/images/knowledge/teaware.jpg" alt="茶具" className="h-16 w-24 flex-shrink-0 rounded-xl object-cover" />
                <p className="text-xs leading-5 text-[var(--ink-soft)]">
                  茶具选择决定香气与滋味的呈现：紫砂壶适乌龙茶、普洱茶，玻璃杯适绿茶、花茶，盖碗适各类茶叶。
                </p>
              </div>
              <div className="space-y-2">
                {BREWING_GUIDE.map((item) => (
                  <div key={item.key} className="rounded-2xl bg-white/30 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.key}</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">{item.detail}</p>
                  </div>
                ))}
              </div>

              {/* ④ 茶叶存储与保鲜 */}
              <SectionTitle>茶叶存储与保鲜</SectionTitle>
              <div className="mb-2 flex gap-3 rounded-2xl bg-white/30 p-3">
                <Img src="/images/knowledge/storage.jpg" alt="存茶罐" className="h-16 w-24 flex-shrink-0 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--ink)]">存储四大关键因素</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                    避光保存 · 防潮控湿（密封容器） · 温度控制（20–25℃） · 远离异味（厨房、香水、香料）。
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {storageList.map((item) => (
                  <div key={item.name} className="rounded-2xl bg-white/30 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.name}</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">{item.storage}</p>
                  </div>
                ))}
              </div>

              {/* 来源标注 */}
              <p className="mt-4 px-1 text-[11px] leading-5 text-[var(--ink-faint)]">
                知识依据公开茶文化科普资料整理，图片来源于网络，仅用于毕业设计学术研究，非商业用途。
              </p>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

TeaKnowledgeHub.displayName = 'TeaKnowledgeHub';

export default TeaKnowledgeHub;
