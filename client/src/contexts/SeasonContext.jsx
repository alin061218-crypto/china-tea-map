import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SeasonContext = createContext(null);

// 月份→季节映射
function monthToSeason(m) {
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

// 季节中文
export const SEASONS = {
  spring: { name: '春', icon: '🌸', emoji: '梅' },
  summer: { name: '夏', icon: '🪷', emoji: '荷' },
  autumn: { name: '秋', icon: '🌼', emoji: '菊' },
  winter: { name: '冬', icon: '❄️', emoji: '梅' },
};

export function SeasonProvider({ children }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [season, setSeason] = useState(monthToSeason(month));

  // 同步 data-season 属性到 html
  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  const setMonthAndSync = useCallback((m) => {
    const mm = ((m - 1 + 12) % 12) + 1; // 1-12 循环
    setMonth(mm);
    setSeason(monthToSeason(mm));
  }, []);

  const prevMonth = useCallback(() => setMonthAndSync(month - 1), [month, setMonthAndSync]);
  const nextMonth = useCallback(() => setMonthAndSync(month + 1), [month, setMonthAndSync]);

  const setSeasonDirect = useCallback((s) => {
    setSeason(s);
    // 切换到该季节的中间月份
    const map = { spring: 4, summer: 7, autumn: 10, winter: 1 };
    setMonth(map[s] || month);
  }, [month]);

  return (
    <SeasonContext.Provider value={{
      month, season, SEASONS,
      prevMonth, nextMonth, setMonth: setMonthAndSync, setSeason: setSeasonDirect,
    }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be inside SeasonProvider');
  return ctx;
}
