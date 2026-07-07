import { useEffect, useRef, useState } from 'react';
import { EffectController } from '../../effects/EffectController';

export default function MapEffectLayer({ transform, introState = 'active' }) {
  const [effects, setEffects] = useState(() => EffectController.getSnapshot());
  const bloomRef = useRef(null);
  const bloom = effects.bloom;
  const atmosphere = effects.atmosphere;

  useEffect(() => EffectController.subscribe(setEffects), []);

  useEffect(() => {
    if (bloomRef.current) {
      const el = bloomRef.current;
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    }
  }, [bloom.region?.id]);

  return (
    <div
      className="map-effect-layer"
      data-intro-state={introState}
      style={{
        '--atmosphere-tone': atmosphere.tone,
        '--atmosphere-warmth': atmosphere.warmth,
        '--region-atmosphere-tone': atmosphere.regionTone,
        '--region-atmosphere-warmth': atmosphere.regionWarmth,
        '--atmosphere-mist': atmosphere.mist,
        '--atmosphere-opacity': atmosphere.opacity,
        '--atmosphere-mist-opacity': atmosphere.mistOpacity,
        '--atmosphere-blur': atmosphere.blur,
      }}
      aria-hidden="true"
    >
      <div className="map-atmosphere-overlay" />
      <div className="map-mist-overlay" />
      <svg width="100%" height="100%" className="absolute inset-0 block overflow-visible">
        <defs>
          <filter id="provinceBloomGlow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="softGlow" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="58" result="diffusion" />
            <feMerge>
              <feMergeNode in="diffusion" />
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {bloom.active && bloom.region?.path && (
          <g transform={transform}>
            <g
              key={bloom.region.id}
              ref={bloomRef}
              className="map-bloom-group"
              filter="url(#provinceBloomGlow)"
              style={{
                '--bloom-core': bloom.palette.core,
                '--bloom-glow': bloom.palette.glow,
                '--bloom-diffusion': bloom.palette.diffusion,
                '--bloom-core-opacity': (0.38 * bloom.intensity).toFixed(3),
                '--bloom-glow-opacity': (0.52 * bloom.intensity).toFixed(3),
                '--bloom-diffusion-opacity': (0.66 * bloom.intensity * bloom.diffusionScale).toFixed(3),
                '--bloom-pulse-duration': `${Math.round(2180 * bloom.motionScale)}ms`,
              }}
            >
              <path className="map-bloom-diffusion" d={bloom.region.path} />
              <path className="map-bloom-glow" d={bloom.region.path} />
              <path className="map-bloom-core" d={bloom.region.path} />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
