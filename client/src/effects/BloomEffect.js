const BLOOM_COLORS = {
  spring: {
    core: 'rgba(245, 237, 224, 0.22)',
    glow: 'rgba(154, 145, 132, 0.105)',
    diffusion: 'rgba(122, 137, 124, 0.065)',
  },
  summer: {
    core: 'rgba(246, 235, 218, 0.21)',
    glow: 'rgba(158, 146, 128, 0.1)',
    diffusion: 'rgba(126, 137, 121, 0.06)',
  },
  autumn: {
    core: 'rgba(243, 231, 216, 0.22)',
    glow: 'rgba(158, 139, 123, 0.105)',
    diffusion: 'rgba(132, 128, 113, 0.065)',
  },
  winter: {
    core: 'rgba(239, 242, 240, 0.2)',
    glow: 'rgba(136, 148, 151, 0.095)',
    diffusion: 'rgba(117, 132, 135, 0.06)',
  },
};

export const BloomEffect = {
  initialState: {
    active: false,
    region: null,
    pulseKey: 0,
    palette: BLOOM_COLORS.spring,
    intensity: 1,
    motionScale: 1,
    diffusionScale: 1,
  },

  trigger({ region, season = 'spring' }) {
    const profile = region?.atmosphereProfile;
    return {
      active: Boolean(region?.path),
      region,
      pulseKey: 0,
      palette: BLOOM_COLORS[season] || BLOOM_COLORS.spring,
      intensity: profile?.bloomIntensity ?? 1,
      motionScale: profile?.motionScale ?? 1,
      diffusionScale: profile?.diffusionScale ?? 1,
    };
  },

  clear(currentState) {
    return {
      ...currentState,
      active: false,
      region: null,
    };
  },
};
