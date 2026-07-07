import { EventBus } from '../core/event-bus';
import { CameraState } from '../map/core/camera-state';
import { NavStateSnapshot } from '../map/nav/nav-state-machine';

export interface RenderSyncState {
  nav: NavStateSnapshot | null;
  camera: CameraState | null;
  animation: Record<string, unknown> | null;
}

export class RenderSyncController {
  private state: RenderSyncState = {
    nav: null,
    camera: null,
    animation: null,
  };

  constructor(private readonly eventBus: EventBus) {}

  sync(partial: Partial<RenderSyncState>): RenderSyncState {
    this.state = { ...this.state, ...partial };
    this.eventBus.publish('UI', 'render:requested', this.getState());
    return this.getState();
  }

  getState(): RenderSyncState {
    return {
      nav: this.state.nav ? { ...this.state.nav } : null,
      camera: this.state.camera ? { ...this.state.camera } : null,
      animation: this.state.animation ? { ...this.state.animation } : null,
    };
  }
}
