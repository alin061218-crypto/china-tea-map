export const ANIM_IDS = {
  ZOOM_IN: 'ANIM-001',
  ZOOM_OUT: 'ANIM-002',
  NODE_FOCUS: 'ANIM-010',
  DRILL_DOWN: 'ANIM-020',
  STORY_ENTER: 'ANIM-030',
} as const;

export type AnimId = typeof ANIM_IDS[keyof typeof ANIM_IDS];

export const ANIM_LABELS: Record<AnimId, string> = {
  [ANIM_IDS.ZOOM_IN]: 'zoom in',
  [ANIM_IDS.ZOOM_OUT]: 'zoom out',
  [ANIM_IDS.NODE_FOCUS]: 'node focus',
  [ANIM_IDS.DRILL_DOWN]: 'drill down',
  [ANIM_IDS.STORY_ENTER]: 'story enter',
};
