const SEASON_PRESETS = {
  spring: {
    season: 'spring',
    tone: 'rgba(137, 145, 135, 0.075)',
    warmth: 'rgba(168, 153, 139, 0.035)',
    regionTone: 'rgba(137, 145, 135, 0)',
    regionWarmth: 'rgba(168, 153, 139, 0)',
    mist: 'rgba(251, 249, 244, 0.16)',
    opacity: 0.34,
    mistOpacity: 0.1,
    blur: '30px',
  },
  summer: {
    season: 'summer',
    tone: 'rgba(144, 142, 131, 0.078)',
    warmth: 'rgba(169, 154, 135, 0.038)',
    regionTone: 'rgba(144, 142, 131, 0)',
    regionWarmth: 'rgba(169, 154, 135, 0)',
    mist: 'rgba(251, 248, 241, 0.15)',
    opacity: 0.32,
    mistOpacity: 0.09,
    blur: '30px',
  },
  autumn: {
    season: 'autumn',
    tone: 'rgba(146, 137, 128, 0.082)',
    warmth: 'rgba(170, 146, 128, 0.04)',
    regionTone: 'rgba(146, 137, 128, 0)',
    regionWarmth: 'rgba(170, 146, 128, 0)',
    mist: 'rgba(250, 246, 240, 0.155)',
    opacity: 0.33,
    mistOpacity: 0.1,
    blur: '32px',
  },
  winter: {
    season: 'winter',
    tone: 'rgba(132, 142, 145, 0.08)',
    warmth: 'rgba(202, 207, 205, 0.045)',
    regionTone: 'rgba(132, 142, 145, 0)',
    regionWarmth: 'rgba(202, 207, 205, 0)',
    mist: 'rgba(247, 249, 248, 0.17)',
    opacity: 0.35,
    mistOpacity: 0.11,
    blur: '34px',
  },
};

export const AtmosphereEffect = {
  initialState: SEASON_PRESETS.spring,

  fromSeason(season) {
    return SEASON_PRESETS[season] || SEASON_PRESETS.spring;
  },

  withRegionProfile(season, profile) {
    const preset = this.fromSeason(season);
    if (!profile) return preset;

    return {
      ...preset,
      regionTone: profile.tone,
      regionWarmth: profile.warmth,
      mistOpacity: Number((preset.mistOpacity * (profile.mistScale ?? 1)).toFixed(3)),
    };
  },
};
