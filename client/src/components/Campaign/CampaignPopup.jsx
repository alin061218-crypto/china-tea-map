import { AnimatePresence, motion } from 'framer-motion';

/**
 * 品牌故事宣传区块：果子熟了 × 杨紫
 * 内容基于公开报道整理（见文末引用清单），仅用于毕业设计学术研究，非商业用途。
 * 肖像权约束：本区块不放任何代言人照片、不做任何 AI 重绘。
 */

const TIMELINE = [
  { date: '2024-05-06', event: '官宣杨紫为无糖茶系列代言人', source: '据澎湃新闻报道' },
  { date: '2025-05-07', event: '杨紫升任「全球品牌代言人」', source: '据北京商报报道' },
  { date: '2026-06-01', event: '发布「中国花香茶计划」，杨紫获授联合发起人', source: '据紫牛新闻、Foodaily报道' },
];

function SectionTitle({ children }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="inline-block h-[14px] w-[3px] rounded-full bg-[rgba(139,127,174,.55)]" />
      <span className="text-sm font-semibold text-[var(--ink)]">{children}</span>
    </div>
  );
}

function CampaignPopup({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[rgba(72,52,37,.045)] px-3 py-4 backdrop-blur-[1.5px]" onClick={onClose}>
          <motion.aside
            className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-[26px] border border-white/60 bg-[rgba(255,249,241,.86)] shadow-[0_24px_80px_rgba(93,70,49,.16)] backdrop-blur-2xl"
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ duration: .96, ease: [0.25, 0.1, 0.1, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between px-4 py-3">
              <button type="button" onClick={onClose} className="icon-button" title="关闭">x</button>
              <div className="rounded-full bg-white/36 px-3 py-1 text-xs text-[var(--ink-soft)]">品牌故事 · 案例研究</div>
            </header>

            <div className="overflow-y-auto px-4 pb-5">
              {/* 引言 */}
              <div className="rounded-[20px] bg-[rgba(139,127,174,.12)] p-4">
                <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">果子熟了 × 杨紫</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                  一个"传统茶年轻化传播"的样本：花香 × 原叶的即饮茶，借助大众明星 IP，
                  让年轻人先喝到"茶"，再循着香气认识产地原叶茶。
                </p>
              </div>

              {/* 官方宣传物料 · 杨紫官宣海报 */}
              <section className="mt-4">
                <SectionTitle>官方宣传物料 · 杨紫官宣</SectionTitle>
                <div className="rounded-2xl bg-white/34 p-3">
                  <img
                    src="/images/campaign/杨紫官宣-竖版.jpg"
                    alt="果子熟了无糖茶官宣代言人杨紫（官方宣传海报）"
                    loading="lazy"
                    className="mx-auto w-full max-w-[230px] rounded-xl object-contain"
                  />
                  <p className="mt-2 text-center text-[11px] leading-5 text-[var(--ink-faint)]">
                    "欢迎果子熟了无糖茶代言人杨紫"官宣海报（2024-05）
                  </p>
                </div>
              </section>

              {/* ① 品牌案例卡 */}
              <section className="mt-4">
                <SectionTitle>品牌案例卡 · 果子熟了</SectionTitle>
                <div className="space-y-2">
                  <div className="rounded-2xl bg-white/34 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">品牌定位</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">
                      花香 × 原叶、无糖健康，主张"做年轻人喜欢的饮料"（品牌使命，据品牌官网）。
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/34 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">产品线</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">
                      栀栀乌龙、金桂乌龙、茉莉龙井等 10 余种花香 + 茶香口味，0糖0脂0能量（据北京商报转引 36氪报道及电商在售信息）。
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/34 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">市场表现</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">
                      据 36氪报道，2024 年 3 月–2025 年 2 月销量突破 4 亿瓶（数据口径以媒体公开报道为准）。
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/34 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">包装视觉</p>
                    <p className="mt-1 text-xs leading-6 text-[var(--ink-soft)]">
                      东方美学、水墨与花鸟意象——与本项目的水墨国风地图气质同源。
                    </p>
                  </div>
                </div>
              </section>

              {/* ② 代言人传播分析 */}
              <section className="mt-4">
                <SectionTitle>代言人传播分析 · 杨紫元素</SectionTitle>
                <div className="space-y-2">
                  {TIMELINE.map((item) => (
                    <div key={item.date} className="rounded-2xl bg-white/34 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[rgba(139,127,174,.14)] px-2 py-0.5 text-[11px] text-[var(--ink-soft)]">{item.date}</span>
                        <p className="text-sm font-semibold text-[var(--ink)]">{item.event}</p>
                      </div>
                      <p className="mt-1 text-[11px] text-[var(--ink-faint)]">{item.source}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl bg-white/26 px-3 py-2">
                    <p className="text-xs leading-6 text-[var(--ink-soft)]">
                      传播逻辑：大众明星 IP 降低了年轻人接触茶文化的门槛——花香即饮茶成为许多人的"第一杯茶"，
                      再循着茶底认识产地原叶茶，正是本项目"传统茶年轻化传播"课题的落点。
                    </p>
                  </div>
                </div>
              </section>

              {/* ③ 结论区块 */}
              <section className="mt-4 rounded-[20px] bg-[rgba(123,163,143,.12)] p-4">
                <SectionTitle>茶文化年轻化 · 结论</SectionTitle>
                <p className="text-xs leading-6 text-[var(--ink-soft)]">
                  明星 IP → 花香茶产品 → 认识产地原叶茶 → 回到地图溯源。
                  现代茶饮并非与产地茶割裂，而是产地茶在现代消费语境中的延伸。
                  在地图上切换"现代茶饮"视图，即可看到每瓶茶、每杯奶茶背后的原料产地。
                </p>
              </section>

              {/* 引用与版权 */}
              <section className="mt-4 rounded-[20px] bg-white/26 p-3">
                <p className="text-[11px] leading-5 text-[var(--ink-faint)]">
                  图片来源：果子熟了官方宣传物料，仅用于毕业设计学术研究，非商业用途。
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--ink-faint)]">
                  引用：① 北京商报（2025-05-08）杨紫升任全球品牌代言人；② 紫牛新闻（2026-06-10）"中国花香茶计划"启幕；
                  ③ Foodaily（2026-07-07）杨紫获聘联合发起人；④ 澎湃新闻（2024-10-10）品牌代言营销分析；⑤ 品牌官网 gzsle.com。
                </p>
              </section>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

CampaignPopup.displayName = 'CampaignPopup';

export default CampaignPopup;
