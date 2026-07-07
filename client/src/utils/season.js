export function getMonths(value = '') {
  return String(value).match(/\d+/g)?.map(Number) || [];
}

export function normalizeSeasonText(value = '') {
  const text = String(value).toLowerCase();
  const result = [];
  if (text.includes('spring') || text.includes('春')) result.push('spring');
  if (text.includes('summer') || text.includes('夏')) result.push('summer');
  if (text.includes('autumn') || text.includes('fall') || text.includes('秋')) result.push('autumn');
  if (text.includes('winter') || text.includes('冬')) result.push('winter');
  return result;
}
