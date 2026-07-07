/**
 * Tea category icon: simple ink-wash style SVG for each tea type.
 * Used in catalog list and detail fallback as small identifier icons.
 */

const ICONS = {
  '绿茶': (
    <g>
      <ellipse cx="22" cy="20" rx="10" ry="14" fill="rgba(143,174,140,0.25)" stroke="rgba(100,140,105,0.55)" strokeWidth="1.2" />
      <line x1="22" y1="6" x2="22" y2="16" stroke="rgba(100,140,105,0.5)" strokeWidth="1" />
      <path d="M18 8 Q22 3 26 8" fill="none" stroke="rgba(100,140,105,0.4)" strokeWidth="0.8" />
      <path d="M14 12 Q22 6 24 11" fill="none" stroke="rgba(100,140,105,0.3)" strokeWidth="0.7" />
      <path d="M22 34 L22 42" stroke="rgba(140,120,100,0.3)" strokeWidth="0.8" />
    </g>
  ),
  '红茶': (
    <g>
      <path d="M12 14 L32 14 Q36 14 36 20 L36 30 Q36 36 30 36 L14 36 Q8 36 8 30 L8 20 Q8 14 12 14 Z" fill="rgba(194,140,111,0.22)" stroke="rgba(160,100,70,0.5)" strokeWidth="1.2" />
      <ellipse cx="22" cy="25" rx="8" ry="4" fill="rgba(180,110,70,0.2)" />
      <path d="M32 18 Q38 16 36 11" fill="none" stroke="rgba(160,100,70,0.3)" strokeWidth="1" />
      <path d="M32 22 Q39 20 38 14" fill="none" stroke="rgba(160,100,70,0.2)" strokeWidth="0.7" />
      <path d="M17 36 L17 40 M27 36 L27 40" stroke="rgba(160,100,70,0.3)" strokeWidth="1" />
    </g>
  ),
  '乌龙茶': (
    <g>
      <ellipse cx="22" cy="24" rx="9" ry="12" fill="rgba(180,140,100,0.2)" stroke="rgba(140,100,60,0.5)" strokeWidth="1.2" />
      <path d="M18 16 Q22 10 26 16" fill="none" stroke="rgba(140,110,70,0.4)" strokeWidth="1" />
      <path d="M14 20 Q22 12 28 20" fill="none" stroke="rgba(140,110,70,0.3)" strokeWidth="0.7" />
      <path d="M16 28 Q22 24 28 28" fill="rgba(160,120,80,0.18)" />
      <path d="M22 36 L22 42" stroke="rgba(140,100,60,0.3)" strokeWidth="0.8" />
      <path d="M15 38 L15 41 M29 38 L29 41" stroke="rgba(140,100,60,0.2)" strokeWidth="0.6" />
    </g>
  ),
  '白茶': (
    <g>
      <path d="M22 6 Q24 14 22 26 Q20 14 22 6 Z" fill="rgba(200,195,185,0.3)" stroke="rgba(160,155,145,0.5)" strokeWidth="0.8" />
      <path d="M22 8 Q26 16 22 28 Q18 16 22 8 Z" fill="rgba(210,205,195,0.25)" />
      <ellipse cx="22" cy="22" rx="3" ry="6" fill="rgba(190,185,175,0.3)" />
      <path d="M22 34 Q20 38 19 42" stroke="rgba(160,155,145,0.3)" strokeWidth="0.8" />
      <path d="M22 34 Q24 38 25 42" stroke="rgba(160,155,145,0.25)" strokeWidth="0.7" />
      <circle cx="22" cy="20" r="1" fill="rgba(180,175,165,0.5)" />
      <circle cx="21" cy="18" r="0.7" fill="rgba(180,175,165,0.4)" />
      <circle cx="23" cy="19" r="0.8" fill="rgba(180,175,165,0.45)" />
    </g>
  ),
  '黄茶': (
    <g>
      <ellipse cx="22" cy="20" rx="10" ry="13" fill="rgba(210,190,130,0.22)" stroke="rgba(170,145,80,0.5)" strokeWidth="1.2" />
      <path d="M16 12 Q22 5 28 12" fill="none" stroke="rgba(170,145,80,0.4)" strokeWidth="1" />
      <path d="M14 17 Q22 9 30 17" fill="none" stroke="rgba(170,145,80,0.25)" strokeWidth="0.7" />
      <path d="M18 26 Q22 22 26 26" fill="rgba(190,165,100,0.2)" />
      <circle cx="22" cy="18" r="1.5" fill="rgba(180,155,90,0.35)" />
      <path d="M22 33 L22 42" stroke="rgba(160,140,90,0.3)" strokeWidth="0.8" />
    </g>
  ),
  '黑茶': (
    <g>
      <rect x="10" y="12" width="24" height="18" rx="4" fill="rgba(100,85,65,0.3)" stroke="rgba(80,65,50,0.55)" strokeWidth="1.3" />
      <line x1="10" y1="18" x2="34" y2="18" stroke="rgba(80,65,50,0.35)" strokeWidth="0.8" />
      <line x1="10" y1="24" x2="34" y2="24" stroke="rgba(80,65,50,0.25)" strokeWidth="0.6" />
      <path d="M14 30 Q17 26 20 30 Q23 34 26 30 Q29 26 32 30" fill="none" stroke="rgba(90,75,55,0.3)" strokeWidth="0.7" />
      <path d="M22 6 L22 12" stroke="rgba(80,65,50,0.3)" strokeWidth="0.8" />
      <path d="M16 7 Q22 4 28 7" fill="none" stroke="rgba(80,65,50,0.2)" strokeWidth="0.6" />
    </g>
  ),
  '花茶': (
    <g>
      <circle cx="22" cy="20" r="5" fill="rgba(220,160,170,0.3)" />
      <ellipse cx="22" cy="16" rx="3" ry="4" fill="rgba(230,180,180,0.25)" />
      <ellipse cx="18" cy="18" rx="3" ry="4" fill="rgba(225,175,175,0.25)" />
      <ellipse cx="26" cy="18" rx="3" ry="4" fill="rgba(225,170,170,0.25)" />
      <ellipse cx="19" cy="22" rx="3" ry="4" fill="rgba(220,180,175,0.25)" />
      <ellipse cx="25" cy="22" rx="3" ry="4" fill="rgba(220,175,175,0.25)" />
      <circle cx="22" cy="20" r="2.5" fill="rgba(250,210,140,0.4)" />
      <path d="M22 28 L22 34" stroke="rgba(160,140,130,0.35)" strokeWidth="0.8" />
      <path d="M18 28 Q20 32 22 34 Q24 32 26 28" fill="rgba(180,160,150,0.2)" />
    </g>
  ),
};

export default function TeaCategoryIcon({ category, size = 44 }) {
  const icon = ICONS[category];
  if (!icon) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
