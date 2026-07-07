import type { TransitionPipeline } from '../animation/transition-pipeline';
import type { AnimId } from '../animation/anim-id';
import type { EventBus, EventChannel, EventPayload, EventUnsubscribe } from '../core/event-bus';
import type { CameraState } from '../map/core/camera-state';
import type { NavStateSnapshot } from '../map/nav/nav-state-machine';
import type { RenderSyncController } from '../ui/render-sync';

export type RuntimeSystem = EventChannel;

export interface RuntimeEvent {
  system: RuntimeSystem;
  type: string;
  payload?: EventPayload;
}

export interface RuntimeAction {
  target: RuntimeSystem;
  type: string;
  payload?: EventPayload;
}

export interface RuntimeControllerState {
  nav: NavStateSnapshot | null;
  camera: CameraState | null;
  animation: Record<string, unknown> | null;
  content: Record<string, unknown> | null;
  ui: Record<string, unknown> | null;
  locks: {
    navigation: boolean;
    camera: boolean;
  };
}

export interface RuntimeControllerDeps {
  eventBus: EventBus;
  transitionPipeline: TransitionPipeline;
  renderSync: RenderSyncController;
}

const STANDARD_EVENTS: Array<Pick<RuntimeEvent, 'system' | 'type'>> = [
  { system: 'NAV', type: 'state:changed' },
  { system: 'MAP', type: 'camera:changed' },
  { system: 'ANIM', type: 'animation:requested' },
  { system: 'ANIM', type: 'transition:queued' },
  { system: 'CONTENT', type: 'content:resolved' },
  { system: 'UI', type: 'render:requested' },
];

function cloneState(state: RuntimeControllerState): RuntimeControllerState {
  return {
    nav: state.nav ? { ...state.nav } : null,
    camera: state.camera ? { ...state.camera } : null,
    animation: state.animation ? { ...state.animation } : null,
    content: state.content ? { ...state.content } : null,
    ui: state.ui ? { ...state.ui } : null,
    locks: { ...state.locks },
  };
}

export class RuntimeController {
  private readonly state: RuntimeControllerState = {
    nav: null,
    camera: null,
    animation: null,
    content: null,
    ui: null,
    locks: {
      navigation: false,
      camera: false,
    },
  };

  private subscriptions: EventUnsubscribe[] = [];
  private isPublishingOwnAction = false;

  constructor(private readonly deps: RuntimeControllerDeps) {}

  start(): void {
    if (this.subscriptions.length > 0) return;

    this.subscriptions = STANDARD_EVENTS.map(({ system, type }) => (
      this.deps.eventBus.subscribe(system, type, (payload) => {
        if (this.isPublishingOwnAction) return;
        this.handleEvent({ system, type, payload });
      })
    ));
  }

  stop(): void {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions = [];
  }

  handleEvent(event: RuntimeEvent): RuntimeControllerState {
    const payload = event.payload ?? {};

    if (event.system === 'NAV') {
      if (event.type === 'LOCK_NAVIGATION') this.state.locks.navigation = Boolean(payload.locked);
      if (payload.nav && !this.state.locks.navigation) this.state.nav = payload.nav as NavStateSnapshot;
    }

    if (event.system === 'MAP') {
      if (event.type === 'OVERRIDE_CAMERA') this.state.locks.camera = Boolean(payload.locked);
      if (payload.camera && !this.state.locks.camera) this.state.camera = payload.camera as CameraState;
    }

    if (event.system === 'ANIM') {
      this.state.animation = { type: event.type, ...payload };
    }

    if (event.system === 'CONTENT') {
      this.state.content = { type: event.type, ...payload };
    }

    if (event.system === 'UI') {
      this.state.ui = { type: event.type, ...payload };
    }

    if (payload.animTrigger) {
      this.deps.transitionPipeline.enqueue({
        type: event.type,
        animTrigger: payload.animTrigger as AnimId,
      });
    }

    return this.syncState();
  }

  dispatch(action: RuntimeAction): RuntimeControllerState {
    const payload = action.payload ?? {};
    const state = this.handleEvent({
      system: action.target,
      type: action.type,
      payload,
    });

    this.isPublishingOwnAction = true;
    try {
      this.deps.eventBus.publish(action.target, action.type, payload);
    } finally {
      this.isPublishingOwnAction = false;
    }

    return state;
  }

  syncState(): RuntimeControllerState {
    this.deps.renderSync.sync({
      nav: this.state.nav,
      camera: this.state.camera,
      animation: this.state.animation,
    });

    return cloneState(this.state);
  }

  getState(): RuntimeControllerState {
    return cloneState(this.state);
  }
}
