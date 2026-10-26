/**
 * 茶类通用知识：工艺 / 茶具 / 茶水比例 / 存储保鲜
 * 依据公开茶文化科普资料整理（制茶工艺、品茶方法、存茶指南），仅用于毕业设计学术展示。
 * key 与 demoTeas 的 categoryEn 对应（green/red/oolong/white/yellow/dark/flower）。
 */
export const TEA_CLASS_KNOWLEDGE = {
  green: {
    name: '绿茶',
    craft: ['杀青', '揉捻', '干燥'],
    ware: '玻璃杯 / 白瓷盖碗',
    ratio: '1:50',
    storage: '最易氧化变质，建议密封避光、冷藏保存，保质期约 6–12 个月。',
  },
  red: {
    name: '红茶',
    craft: ['萎凋', '揉捻', '发酵', '干燥'],
    ware: '白瓷盖碗 / 紫砂壶',
    ratio: '1:40',
    storage: '发酵度高、性质较稳定，密封避光保存，保质期约 2 年。',
  },
  oolong: {
    name: '乌龙茶',
    craft: ['萎凋', '做青（摇青）', '炒青', '揉捻', '烘焙'],
    ware: '紫砂壶 / 盖碗',
    ratio: '1:20',
    storage: '密封避光、常温保存，保质期约 1–2 年。',
  },
  white: {
    name: '白茶',
    craft: ['萎凋', '干燥'],
    ware: '玻璃杯 / 盖碗',
    ratio: '1:50',
    storage: '可常温密封保存，随时间推移转化为更醇厚口感，适合长期存放。',
  },
  yellow: {
    name: '黄茶',
    craft: ['杀青', '闷黄', '干燥'],
    ware: '玻璃杯 / 盖碗',
    ratio: '1:50',
    storage: '工艺独特、产量较少，密封避光冷藏，保质期约 1 年。',
  },
  dark: {
    name: '黑茶 / 普洱茶',
    craft: ['杀青', '揉捻', '渥堆', '干燥'],
    ware: '紫砂壶 / 盖碗',
    ratio: '1:20',
    storage: '适合长期存放，陈化后风味更佳，避光通风处保存，可存放数十年。',
  },
  flower: {
    name: '花茶',
    craft: ['茶坯加工', '窨花（多次）', '复火干燥'],
    ware: '玻璃杯 / 盖碗',
    ratio: '1:50',
    storage: '易吸附异味，密封避光、冷藏保存，保质期约 6–12 个月。',
  },
};

// 品茶通用四要素速查（茶事百科用）
export const BREWING_GUIDE = [
  { key: '水温控制', detail: '不同茶类需要不同水温：绿茶 80–85℃，乌龙茶 95–100℃，红茶 95–100℃，白茶 85–90℃。' },
  { key: '冲泡时间', detail: '避免过度浸泡导致苦涩：第一泡 30–45 秒，第二泡 45–60 秒，第三泡 60–90 秒。' },
  { key: '茶具选择', detail: '紫砂壶适乌龙茶、普洱茶；玻璃杯适绿茶、花茶；盖碗适各类茶叶。' },
  { key: '茶水比例', detail: '绿茶 1:50，乌龙茶 1:20，红茶 1:40——茶叶重量与水量之比。' },
];

// 六大茶类工艺链概览（茶事百科用）
export const CRAFT_OVERVIEW = [
  { name: '绿茶', chain: '杀青 → 揉捻 → 干燥', note: '不发酵，保留鲜爽' },
  { name: '红茶', chain: '萎凋 → 揉捻 → 发酵 → 干燥', note: '全发酵，红汤红叶' },
  { name: '乌龙茶', chain: '萎凋 → 做青 → 炒青 → 揉捻 → 烘焙', note: '半发酵，花香岩韵' },
  { name: '白茶', chain: '萎凋 → 干燥', note: '微发酵，自然清甜' },
  { name: '黄茶', chain: '杀青 → 闷黄 → 干燥', note: '闷黄工艺，黄汤黄叶' },
  { name: '黑茶', chain: '杀青 → 揉捻 → 渥堆 → 干燥', note: '后发酵，陈香醇厚' },
];

// ── 茶事百科详细档案（独立板块用） ──
// 每类：定义 / 工艺 / 代表茶 / 口感 / 汤色 / 茶具 / 比例 / 存茶 / 配图（images/knowledge/ 下）
export const TEA_CLASS_PROFILES = {
  green: {
    name: '绿茶',
    intro: '不发酵茶，经杀青固定品质，最大程度保留鲜爽本味。',
    craft: ['杀青', '揉捻', '干燥'],
    represent: ['西湖龙井', '碧螺春', '恩施玉露'],
    taste: '清汤绿叶，鲜爽回甘',
    teaColor: '绿黄明亮',
    ware: '玻璃杯 / 白瓷盖碗',
    ratio: '1:50',
    storage: '最易氧化变质，建议密封避光、冷藏保存，保质期约 6–12 个月。',
    image: '/images/knowledge/green.jpg',
  },
  red: {
    name: '红茶',
    intro: '全发酵茶，茶多酚充分氧化，茶汤红艳、滋味甜醇。',
    craft: ['萎凋', '揉捻', '发酵', '干燥'],
    represent: ['正山小种', '祁门红茶', '滇红'],
    taste: '红汤红叶，香甜醇厚',
    teaColor: '红艳明亮',
    ware: '白瓷盖碗 / 紫砂壶',
    ratio: '1:40',
    storage: '发酵度高、性质较稳定，密封避光保存，保质期约 2 年。',
    image: '/images/knowledge/red.jpg',
  },
  oolong: {
    name: '乌龙茶',
    intro: '半发酵茶，介于绿茶与红茶之间，兼具花香与醇厚。',
    craft: ['萎凋', '做青（摇青）', '炒青', '揉捻', '烘焙'],
    represent: ['铁观音', '大红袍', '凤凰单丛'],
    taste: '花香馥郁，岩韵回甘',
    teaColor: '金黄明亮',
    ware: '紫砂壶 / 盖碗',
    ratio: '1:20',
    storage: '密封避光、常温保存，保质期约 1–2 年。',
    image: '/images/knowledge/oolong.jpg',
  },
  white: {
    name: '白茶',
    intro: '微发酵茶，仅经萎凋与干燥，工艺最接近自然。',
    craft: ['萎凋', '干燥'],
    represent: ['白毫银针', '白牡丹', '寿眉'],
    taste: '毫香清雅，自然清甜',
    teaColor: '杏黄透亮',
    ware: '玻璃杯 / 盖碗',
    ratio: '1:50',
    storage: '可常温密封保存，随时间推移转化为更醇厚口感，适合长期存放。',
    image: '/images/knowledge/white.jpg',
  },
  yellow: {
    name: '黄茶',
    intro: '轻发酵茶，经"闷黄"工序形成黄汤黄叶的独特风格。',
    craft: ['杀青', '闷黄', '干燥'],
    represent: ['君山银针', '蒙顶黄芽', '霍山黄芽'],
    taste: '黄汤黄叶，醇和鲜爽',
    teaColor: '杏黄明亮',
    ware: '玻璃杯 / 盖碗',
    ratio: '1:50',
    storage: '工艺独特、产量较少，密封避光冷藏，保质期约 1 年。',
    image: '/images/knowledge/yellow.jpg',
  },
  dark: {
    name: '黑茶 / 普洱茶',
    intro: '后发酵茶，经渥堆发酵，越陈越香、滋味醇厚。',
    craft: ['杀青', '揉捻', '渥堆', '干燥'],
    represent: ['普洱茶', '六堡茶', '安化黑茶'],
    taste: '陈香醇厚，回甘绵长',
    teaColor: '红浓明亮',
    ware: '紫砂壶 / 盖碗',
    ratio: '1:20',
    storage: '适合长期存放，陈化后风味更佳，避光通风处保存，可存放数十年。',
    image: '/images/knowledge/dark.jpg',
  },
  flower: {
    name: '花茶',
    intro: '以茶坯吸收鲜花香气窨制而成，花香与茶香交融。',
    craft: ['茶坯加工', '窨花（多次）', '复火干燥'],
    represent: ['茉莉花茶', '桂花乌龙', '玫瑰花茶'],
    taste: '花香鲜灵，清芬悠远',
    teaColor: '黄绿明亮',
    ware: '玻璃杯 / 盖碗',
    ratio: '1:50',
    storage: '易吸附异味，密封避光、冷藏保存，保质期约 6–12 个月。',
    image: '/images/knowledge/flower.jpg',
  },
};

// 制茶通用工艺步骤详解（制茶工艺全景章节用）
export const CRAFT_STEPS = [
  { name: '采摘', detail: '清晨露水未干时采摘，以一芽一叶或一芽二叶为最佳，确保鲜嫩度与品质。', image: '/images/knowledge/craft-pick.jpg' },
  { name: '萎凋', detail: '鲜叶摊放于竹筛自然失水、叶质变软，为后续工艺做准备。', image: '/images/knowledge/craft-wither.jpg' },
  { name: '杀青', detail: '高温钝化酶活性、固定品质，是绿茶、黄茶、黑茶的关键工序。' },
  { name: '揉捻', detail: '通过手工或机械揉捻破坏叶细胞、释放茶汁，形成特有条索外形。' },
  { name: '发酵 / 做青', detail: '红茶全发酵氧化，乌龙茶做青形成花香岩韵，塑造各自风味。' },
  { name: '干燥', detail: '烘干或晒干去除多余水分，固定品质，便于储存与运输。' },
];
