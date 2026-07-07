import type { CameraMaterialBehavior, SemanticEvent } from './behavior-rules';

export const EXPERIENCE_RHYTHM = {
  entry: 'slow_emergence',
  navigation: 'fluid_continuous',
  interaction: 'soft_responsive',
  story_mode: 'deep_slowing',
  exit: 'gentle_release',
} as const;

export type ExperienceRhythm = typeof EXPERIENCE_RHYTHM[keyof typeof EXPERIENCE_RHYTHM];

export interface TimingRange {
  min: number;
  max: number;
}

export interface ExperienceTiming {
  delay: number;
  duration: number;
  easing: string;
  perceptual_note: string;
}

export interface SemanticTimingProfile {
  semantic_event: SemanticEvent;
  rhythm: ExperienceRhythm;
  delayRange: TimingRange;
  durationRange: TimingRange;
  easing: string;
  perceptual_note: string;
}

export interface ResolvedSemanticTiming {
  semantic_event: SemanticEvent;
  timing: ExperienceTiming;
}

export interface SemanticTimingRequest {
  event: SemanticEvent;
  context?: string;
}

export interface ResolvedTimingMetadata {
  semantic_event: SemanticEvent;
  context: string | null;
  delay: number;
  duration: number;
  easing: string;
  perceptualNote: string;
}

export interface CameraRhythmRequest {
  event: SemanticEvent;
  region?: string | null;
}

export interface ResolvedCameraRhythm {
  event: SemanticEvent;
  region: string | null;
  motion: string;
  zoom: string;
  drift: string;
}

export const SEMANTIC_TIMING_MAP: Record<SemanticEvent, SemanticTimingProfile> = {
  INK_WASH_BLOOM: {
    semantic_event: 'INK_WASH_BLOOM',
    rhythm: EXPERIENCE_RHYTHM.entry,
    delayRange: { min: 0, max: 0 },
    durationRange: { min: 1200, max: 2000 },
    easing: 'ease-out-soft',
    perceptual_note: 'ink spreads gradually into paper texture',
  },
  FLORAL_EMERGENCE: {
    semantic_event: 'FLORAL_EMERGENCE',
    rhythm: EXPERIENCE_RHYTHM.interaction,
    delayRange: { min: 200, max: 400 },
    durationRange: { min: 900, max: 1500 },
    easing: 'organic-bloom',
    perceptual_note: 'flowers emerge slowly from ink density',
  },
  PAPER_SETTLE_FADE: {
    semantic_event: 'PAPER_SETTLE_FADE',
    rhythm: EXPERIENCE_RHYTHM.exit,
    delayRange: { min: 0, max: 0 },
    durationRange: { min: 800, max: 1200 },
    easing: 'natural-fade',
    perceptual_note: 'paper dissolves gently into background',
  },
  INK_SINK_FLOW: {
    semantic_event: 'INK_SINK_FLOW',
    rhythm: EXPERIENCE_RHYTHM.navigation,
    delayRange: { min: 0, max: 0 },
    durationRange: { min: 1500, max: 2500 },
    easing: 'gravity-soft',
    perceptual_note: 'ink sinks downward into deeper layers',
  },
  INK_RISE_REVEAL: {
    semantic_event: 'INK_RISE_REVEAL',
    rhythm: EXPERIENCE_RHYTHM.navigation,
    delayRange: { min: 0, max: 120 },
    durationRange: { min: 1200, max: 2000 },
    easing: 'surface-reveal-soft',
    perceptual_note: 'ink rises back through the wash as structure returns',
  },
  INK_SCENE_EXPAND: {
    semantic_event: 'INK_SCENE_EXPAND',
    rhythm: EXPERIENCE_RHYTHM.story_mode,
    delayRange: { min: 100, max: 300 },
    durationRange: { min: 1800, max: 3000 },
    easing: 'breathing-expand',
    perceptual_note: 'scene unfolds like wet ink spreading outward',
  },
  WASH_CONTRACT_RESTORE: {
    semantic_event: 'WASH_CONTRACT_RESTORE',
    rhythm: EXPERIENCE_RHYTHM.story_mode,
    delayRange: { min: 100, max: 240 },
    durationRange: { min: 1400, max: 2200 },
    easing: 'breathing-contract',
    perceptual_note: 'the wash recedes gradually as map clarity returns',
  },
  SOFT_INK_CONVERGENCE: {
    semantic_event: 'SOFT_INK_CONVERGENCE',
    rhythm: EXPERIENCE_RHYTHM.interaction,
    delayRange: { min: 0, max: 0 },
    durationRange: { min: 1000, max: 1600 },
    easing: 'center-pull-soft',
    perceptual_note: 'ink gathers gently toward focal point',
  },
};

export const INTERACTION_LATENCY_RULES = {
  ui_response: {
    range: { min: 0, max: 80 },
    perceptual_note: 'instant perception; user response must feel immediate',
  },
  state_update: {
    range: { min: 80, max: 200 },
    perceptual_note: 'map and navigation state synchronize after initial perception',
  },
  camera_motion_start: {
    range: { min: 150, max: 300 },
    perceptual_note: 'material motion begins slightly after perception',
  },
} as const;

export const CAMERA_RHYTHM_MODEL: Record<CameraMaterialBehavior, string> = {
  diffusion_focus: 'slow accumulation',
  ink_drift: 'continuous flow',
  paper_depth_sink: 'weighted descent',
  floral_focus_emergence: 'delayed bloom',
};

export const STORY_MODE_TIME_BEHAVIOR = {
  INK_SCENE_EXPAND: {
    rhythm: EXPERIENCE_RHYTHM.story_mode,
    perceptual_note: 'time slows as ink settles into memory',
  },
  WASH_CONTRACT_RESTORE: {
    rhythm: EXPERIENCE_RHYTHM.exit,
    perceptual_note: 'normal rhythm returns gradually without abrupt speed change',
  },
} as const;

function midpoint(range: TimingRange): number {
  return Math.round((range.min + range.max) / 2);
}

function resolveTimingProfile(semantic_event: SemanticEvent): ResolvedSemanticTiming {
  const profile = SEMANTIC_TIMING_MAP[semantic_event];

  return {
    semantic_event,
    timing: {
      delay: midpoint(profile.delayRange),
      duration: midpoint(profile.durationRange),
      easing: profile.easing,
      perceptual_note: profile.perceptual_note,
    },
  };
}

function cameraRhythmForEvent(event: SemanticEvent): Omit<ResolvedCameraRhythm, 'event' | 'region'> {
  switch (event) {
    case 'INK_WASH_BLOOM':
      return { motion: 'diffusion_focus', zoom: 'global_to_region_diffusion', drift: 'slow_paper_breath' };
    case 'FLORAL_EMERGENCE':
      return { motion: 'floral_focus_emergence', zoom: 'petal_near_focus', drift: 'soft_bloom_drift' };
    case 'INK_SINK_FLOW':
      return { motion: 'paper_depth_sink', zoom: 'layer_depth_descent', drift: 'weighted_ink_pull' };
    case 'INK_RISE_REVEAL':
      return { motion: 'diffusion_focus', zoom: 'surface_layer_return', drift: 'upward_wash_reveal' };
    case 'INK_SCENE_EXPAND':
      return { motion: 'diffusion_focus', zoom: 'story_scene_unfold', drift: 'memory_wash_spread' };
    case 'WASH_CONTRACT_RESTORE':
      return { motion: 'ink_drift', zoom: 'atlas_clarity_return', drift: 'receding_wash' };
    case 'SOFT_INK_CONVERGENCE':
      return { motion: 'diffusion_focus', zoom: 'focal_ink_gather', drift: 'center_pull_soft' };
    case 'PAPER_SETTLE_FADE':
      return { motion: 'ink_drift', zoom: 'paper_rest_field', drift: 'gentle_release' };
    default:
      return { motion: 'ink_drift', zoom: 'paper_rest_field', drift: 'continuous_flow' };
  }
}

export function resolveSemanticTiming(semantic_event: SemanticEvent): ResolvedSemanticTiming;
export function resolveSemanticTiming(request: SemanticTimingRequest): ResolvedTimingMetadata;
export function resolveSemanticTiming(input: SemanticEvent | SemanticTimingRequest): ResolvedSemanticTiming | ResolvedTimingMetadata {
  if (typeof input === 'string') return resolveTimingProfile(input);

  const resolved = resolveTimingProfile(input.event);
  return {
    semantic_event: input.event,
    context: input.context ?? null,
    delay: resolved.timing.delay,
    duration: resolved.timing.duration,
    easing: resolved.timing.easing,
    perceptualNote: resolved.timing.perceptual_note,
  };
}

export function resolveCameraRhythm(behavior: CameraMaterialBehavior): string;
export function resolveCameraRhythm(request: CameraRhythmRequest): ResolvedCameraRhythm;
export function resolveCameraRhythm(input: CameraMaterialBehavior | CameraRhythmRequest): string | ResolvedCameraRhythm {
  if (typeof input === 'string') {
    return CAMERA_RHYTHM_MODEL[input];
  }

  return {
    event: input.event,
    region: input.region ?? null,
    ...cameraRhythmForEvent(input.event),
  };
}

export function describeCameraRhythm(behavior: CameraMaterialBehavior): string {
  return CAMERA_RHYTHM_MODEL[behavior];
}
