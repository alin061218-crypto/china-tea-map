import { EventBus, EventPayload, EventUnsubscribe } from '../core/event-bus';
import { AnimId } from './anim-id';

export interface AnimationEvent {
  id: AnimId;
  source: string;
  payload?: Record<string, unknown>;
}

export class AnimationEngine {
  private unsubscribe: EventUnsubscribe | null = null;

  constructor(private readonly eventBus: EventBus) {}

  start(): void {
    if (this.unsubscribe) return;

    this.unsubscribe = this.eventBus.subscribe('NAV', 'state:changed', (payload) => {
      const animId = payload.animTrigger as AnimId | undefined;
      if (!animId) return;

      this.emit({
        id: animId,
        source: 'NAV',
        payload,
      });
    });
  }

  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  emit(event: AnimationEvent): void {
    this.eventBus.publish('ANIM', 'animation:requested', event as unknown as EventPayload);
  }
}
