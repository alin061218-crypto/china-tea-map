/**
 * 现代茶饮工具 - 从产地茶数据展开"现代消费形态"产品点
 * 供 TeaMap / TeaDetailPanel / TeaCatalogPopup 使用
 */

// 展开 demoTeas 中所有 modern_forms 为独立产品点（含原料产地 anchor 坐标）
export function getModernProducts(teas = []) {
  const products = [];
  for (const tea of teas) {
    const forms = Array.isArray(tea.modern_forms) ? tea.modern_forms : [];
    for (const form of forms) {
      const anchor = form.anchor || {};
      products.push({
        // 唯一 id：产地茶 id + 品牌 + 产品
        id: `${tea.id}__${form.brand}__${form.product}`,
        name: form.product,
        brand: form.brand,
        type: form.type,
        note: form.note,
        beverage_chain: tea.beverage_chain || '',
        // 溯源反链：回到原料产地茶
        anchorTeaId: tea.id,
        anchorTeaName: tea.name,
        anchorProvince: tea.province,
        anchorCity: tea.city,
        // 视觉：沿用产地茶的大气氛围
        categoryEn: tea.categoryEn,
        // 独立造点：优先用 anchor（原料产地城市附近），缺省回退到产地茶坐标
        latitude: typeof anchor.latitude === 'number' ? anchor.latitude : tea.latitude,
        longitude: typeof anchor.longitude === 'number' ? anchor.longitude : tea.longitude,
      });
    }
  }
  return products;
}

// 某产地茶是否挂载了现代形态
export function hasModernForms(tea) {
  return Array.isArray(tea?.modern_forms) && tea.modern_forms.length > 0;
}

// 按产品 id 反查产地茶 id（详情面板反链用）
export function findAnchorTeaId(products, productId) {
  return products.find((product) => product.id === productId)?.anchorTeaId || null;
}

// ── 现代茶饮视觉资产 ──
// 产品名 → 真实产品图（images/products/ 下，品牌/电商公开产品图，仅学术展示）
const PRODUCT_REAL_IMAGE_MAP = {
  栀栀乌龙: '/images/products/果子熟了/栀栀乌龙-单瓶白底.jpg',
  金桂乌龙: '/images/products/果子熟了/金桂乌龙-白底.jpg',
  茉莉龙井: '/images/products/果子熟了/茉莉龙井-白底.jpg',
  玫瑰红茶: '/images/products/果子熟了/玫瑰红茶-白底.jpg',
  冰红茶: '/images/products/康师傅/冰红茶-白底.jpg',
  绿茶: '/images/products/统一/绿茶-白底.jpg',
  茉莉奶绿: '/images/products/茶百道/茉莉奶绿-大杯白底.jpg',
  金凤茶王: '/images/products/喜茶/金凤茶王-奶盖.jpg',
  丝袜奶茶: '/images/products/港式茶饮/丝袜奶茶.jpg',
  茉莉花窨制花源: '/images/products/原料产地/茉莉花蕾-白底.jpg',
};

// 产品名 → 水墨插画文件名（images/beverage/ 下，真实图缺失时兜底）
const PRODUCT_IMAGE_MAP = {
  栀栀乌龙: 'zhizhi-wulong.jpg',
  金桂乌龙: 'jingui-wulong.jpg',
  茉莉龙井: 'moli-longjing.jpg',
  玫瑰红茶: 'meigui-hongcha.jpg',
  冰红茶: 'bing-hongcha.jpg',
  绿茶: 'lvcha.jpg',
  茉莉奶绿: 'moli-nailv.jpg',
  金凤茶王: 'jinfeng-chawang.jpg',
  丝袜奶茶: 'sima-naicha.jpg',
  茉莉花窨制花源: 'moli-huayuan.jpg',
};

// 产品详情主图：真实产品图优先，缺省回退水墨插画（缺省 null，由调用方兜底）
export function getProductImageSrc(productName) {
  if (PRODUCT_REAL_IMAGE_MAP[productName]) return PRODUCT_REAL_IMAGE_MAP[productName];
  const ink = PRODUCT_IMAGE_MAP[productName];
  return ink ? `/images/beverage/${ink}` : null;
}

// 兼容旧调用：返回插画文件名（仅水墨插画）
export function getProductImage(productName) {
  return PRODUCT_IMAGE_MAP[productName] || null;
}

// 地图 marker 徽标：按产品类型选择瓶装茶 / 奶茶杯 / 花源
export function getProductMarkerIcon(productType) {
  if (productType === '瓶装即饮茶') return '/images/beverage-icons/bottle.png';
  if (productType === '原料产地') return '/images/beverage-icons/flower.png';
  return '/images/beverage-icons/cup.png';
}
