const CULTURAL_ATMOSPHERE_PROFILES = {
  north: {
    id: 'north',
    tone: 'rgba(111, 129, 137, 0.07)',
    warmth: 'rgba(160, 150, 132, 0.022)',
    wash: 'rgba(111, 129, 137, 0.38)',
    stroke: 'rgba(220, 228, 226, 0.52)',
    dot: 'rgba(72, 91, 82, 0.56)',
    bloomIntensity: 0.84,
    teaDensity: 0.88,
    motionScale: 1.1,
    diffusionScale: 0.9,
    mistScale: 0.94,
  },
  south: {
    id: 'south',
    tone: 'rgba(155, 118, 98, 0.065)',
    warmth: 'rgba(186, 137, 101, 0.035)',
    wash: 'rgba(178, 124, 102, 0.40)',
    stroke: 'rgba(244, 226, 208, 0.52)',
    dot: 'rgba(91, 104, 62, 0.6)',
    bloomIntensity: 1.08,
    teaDensity: 1.08,
    motionScale: 0.98,
    diffusionScale: 1.08,
    mistScale: 1.06,
  },
  mountain: {
    id: 'mountain',
    tone: 'rgba(104, 119, 104, 0.062)',
    warmth: 'rgba(143, 132, 112, 0.018)',
    wash: 'rgba(100, 124, 102, 0.36)',
    stroke: 'rgba(229, 235, 219, 0.50)',
    dot: 'rgba(63, 91, 64, 0.5)',
    bloomIntensity: 0.82,
    teaDensity: 0.84,
    motionScale: 1.16,
    diffusionScale: 0.88,
    mistScale: 1.1,
  },
  river: {
    id: 'river',
    tone: 'rgba(112, 137, 130, 0.06)',
    warmth: 'rgba(164, 145, 124, 0.028)',
    wash: 'rgba(106, 138, 130, 0.37)',
    stroke: 'rgba(232, 234, 220, 0.52)',
    dot: 'rgba(66, 104, 80, 0.57)',
    bloomIntensity: 0.98,
    teaDensity: 1,
    motionScale: 1.04,
    diffusionScale: 1.02,
    mistScale: 1.02,
  },
};

const REGION_SUFFIX_PATTERN = /\u7701|\u5e02|\u81ea\u6cbb\u533a|\u58ee\u65cf|\u56de\u65cf|\u7ef4\u543e\u5c14|\u7279\u522b\u884c\u653f\u533a/g;

export function normalizeRegionName(value = '') {
  return String(value).replace(REGION_SUFFIX_PATTERN, '');
}

export function getRegionAtmosphereProfile({ longitude, latitude } = {}) {
  const lon = Number(longitude);
  const lat = Number(latitude);
  let profileId = 'river';

  if (Number.isFinite(lon) && Number.isFinite(lat)) {
    if (lat >= 33 || (lat >= 31.6 && lon < 116)) profileId = 'north';
    if (lon <= 105 || (lat <= 32 && lon <= 106.8)) profileId = 'mountain';
    if (lat <= 26.8 && lon >= 108) profileId = 'south';
    if (lat >= 27 && lat <= 32.5 && lon >= 108 && lon <= 122.5) profileId = 'river';
  }

  return CULTURAL_ATMOSPHERE_PROFILES[profileId];
}

export function getRegionAtmosphereProfiles() {
  return CULTURAL_ATMOSPHERE_PROFILES;
}
