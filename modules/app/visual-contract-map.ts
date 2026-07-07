export type VisualIntent = {
  inkDensity: number;
  bloomIntensity: number;
  textureGrain: number;
  motionSoftness: number;
  spatialFocus: number;
};

export type TimingInput = {
  delay: number;
  duration: number;
  easing: string;
  note?: string;
  perceptualNote?: string;
};

export type CameraInput = {
  motion: string;
  zoom: number | string;
  drift: number | string;
};

function numericValue(value: number | string): number {
  if (typeof value === 'number') return value;

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function mapTimingToVisualIntent(timing: TimingInput): VisualIntent {
  const note = timing.note ?? timing.perceptualNote ?? '';

  return {
    inkDensity: timing.duration > 800 ? 0.8 : 0.5,
    bloomIntensity: timing.delay > 300 ? 0.7 : 0.4,
    textureGrain: timing.easing === 'ease-in-out' ? 0.6 : 0.3,
    motionSoftness: note === 'calm' ? 0.9 : 0.5,
    spatialFocus: 0.7,
  };
}

export function mapCameraToVisualIntent(camera: CameraInput): VisualIntent {
  const zoom = numericValue(camera.zoom);
  const drift = numericValue(camera.drift);

  return {
    inkDensity: zoom > 1.2 ? 0.8 : 0.4,
    bloomIntensity: drift > 0.5 ? 0.7 : 0.3,
    textureGrain: camera.motion === 'float' ? 0.6 : 0.4,
    motionSoftness: 0.8,
    spatialFocus: zoom,
  };
}
