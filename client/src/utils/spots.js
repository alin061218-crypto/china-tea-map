export function spotsFor(tea) {
  const city = tea.city || tea.province || '本地';
  return [
    { name: `${city}茶山步道`, desc: `沿山势寻找${tea.name}原产地风土。` },
    { name: `${city}古茶村`, desc: '看老茶树、老作坊与日常饮茶礼俗。' },
    { name: `${city}茶文化馆`, desc: '梳理茶史、器具与地方茶俗脉络。' },
    { name: `${tea.name}制茶工坊`, desc: '体验采青、萎凋、揉捻或焙火工序。' },
  ];
}
