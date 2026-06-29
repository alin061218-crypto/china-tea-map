import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SeasonContext = createContext(null);

export const SEASON_ORDER = ['spring', 'summer', 'autumn', 'winter'];

export const SEASONS = {
  spring: { name: '春', emoji: '🌸', color: '#9db89a', bg: '#f0f5ed' },
  summer: { name: '夏', emoji: '🪷', color: '#c4a87c', bg: '#faf5ed' },
  autumn: { name: '秋', emoji: '🍂', color: '#c4956a', bg: '#faf0e5' },
  winter: { name: '冬', emoji: '❄️', color: '#9aa8b8', bg: '#f2f4f6' },
};

function getCurrentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

export function SeasonProvider({ children }) {
  const [season, setSeasonState] = useState(getCurrentSeason);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    document.documentElement.setAttribute('data-season', season);
  }, [season]);

  const setSeason = useCallback((s) => {
    setSeasonState(s);
    const map = { spring: 4, summer: 7, autumn: 10, winter: 1 };
    setMonth(map[s] || 4);
  }, []);

  const nextSeason = useCallback(() => {
    const idx = SEASON_ORDER.indexOf(season);
    setSeason(SEASON_ORDER[(idx + 1) % 4]);
  }, [season, setSeason]);

  const prevSeason = useCallback(() => {
    const idx = SEASON_ORDER.indexOf(season);
    setSeason(SEASON_ORDER[(idx + 3) % 4]);
  }, [season, setSeason]);

  return (
    <SeasonContext.Provider value={{
      season, month, SEASONS, SEASON_ORDER,
      setSeason, nextSeason, prevSeason, setMonth,
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
