export const NAV_STATES = ['Idle', 'Focused', 'Drilled', 'StoryMode', 'DetailMode'] as const;

export type NavState = typeof NAV_STATES[number];

export interface NavStateSnapshot {
  state: NavState;
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  storyNodeId: string | null;
}

const allowedTransitions: Record<NavState, NavState[]> = {
  Idle: ['Focused'],
  Focused: ['Idle', 'Drilled', 'DetailMode', 'StoryMode'],
  Drilled: ['Focused', 'DetailMode', 'StoryMode'],
  StoryMode: ['Focused', 'Drilled'],
  DetailMode: ['Focused', 'Drilled'],
};

const snapshot: NavStateSnapshot = {
  state: 'Idle',
  selectedNodeId: null,
  focusedNodeId: null,
  storyNodeId: null,
};

export function getNavState(): NavStateSnapshot {
  return { ...snapshot };
}

export function canTransition(from: NavState, to: NavState): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export function transitionTo(nextState: NavState, patch: Partial<Omit<NavStateSnapshot, 'state'>> = {}): NavStateSnapshot {
  if (snapshot.state !== nextState && !canTransition(snapshot.state, nextState)) {
    throw new Error(`Invalid navigation transition: ${snapshot.state} -> ${nextState}`);
  }

  snapshot.state = nextState;
  Object.assign(snapshot, patch);
  return getNavState();
}

export function resetNavState(): NavStateSnapshot {
  snapshot.state = 'Idle';
  snapshot.selectedNodeId = null;
  snapshot.focusedNodeId = null;
  snapshot.storyNodeId = null;
  return getNavState();
}
