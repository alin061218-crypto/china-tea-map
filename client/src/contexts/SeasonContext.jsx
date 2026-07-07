import { createContext, useCallback, useContext, useState } from 'react';
import { normalizeSeasonText } from '../utils/season';

export { normalizeSeasonText };

const SeasonContext = createContext(null);

export const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'];

export const SEASONS = {
  spring: { name: '春', label: '春季', color: '#8fae8c', tone: '青绿薄雾', month: 4 },
  summer: { name: '夏', label: '夏季', color: '#c2a46f', tone: '暖杏柔光', month: 7 },
  autumn: { name: '秋', label: '秋季', color: '#c08358', tone: '焦糖金橘', month: 10 },
  winter: { name: '冬', label: '冬季', color: '#8799a8', tone: '冷灰覆雪', month: 1 },
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function SeasonProvider({ children }) {
  const [season, setSeasonState] = useState(getCurrentSeason);
  const [month, setMonth] = useState(SEASONS[getCurrentSeason()].month);

  const setSeason = useCallback((nextSeason) => {
    if (!SEASON_ORDER.includes(nextSeason)) return;
    setSeasonState(nextSeason);
    setMonth(SEASONS[nextSeason].month);
  }, []);

  return (
    <SeasonContext.Provider value={{ season, month, setMonth, setSeason, SEASONS, SEASON_ORDER }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (!context) throw new Error('useSeason must be used inside SeasonProvider');
  return context;
}
