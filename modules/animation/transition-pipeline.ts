import { EventBus } from '../core/event-bus';
import { ANIM_IDS, AnimId } from './anim-id';

export interface StateChange {
  type: string;
  nodeId?: string | null;
  zoomDirection?: 'in' | 'out';
  animTrigger?: AnimId | null;
}

export interface TransitionQueueItem {
  animId: AnimId;
  stateChange: StateChange;
}

export class TransitionPipeline {
  private readonly queue: TransitionQueueItem[] = [];

  constructor(private readonly eventBus: EventBus) {}

  resolveAnimId(stateChange: StateChange): AnimId | null {
    if (stateChange.animTrigger) return stateChange.animTrigger;
    if (stateChange.type === 'nodeFocus') return ANIM_IDS.NODE_FOCUS;
    if (stateChange.type === 'drillDown') return ANIM_IDS.DRILL_DOWN;
    if (stateChange.type === 'storyEnter') return ANIM_IDS.STORY_ENTER;
    if (stateChange.zoomDirection === 'in') return ANIM_IDS.ZOOM_IN;
    if (stateChange.zoomDirection === 'out') return ANIM_IDS.ZOOM_OUT;
    return null;
  }

  enqueue(stateChange: StateChange): TransitionQueueItem | null {
    const animId = this.resolveAnimId(stateChange);
    if (!animId) return null;

    const item = { animId, stateChange };
    this.queue.push(item);
    this.eventBus.publish('ANIM', 'transition:queued', item);
    return item;
  }

  executeNext(): TransitionQueueItem | null {
    const item = this.queue.shift() ?? null;
    if (item) this.eventBus.publish('ANIM', 'transition:execute', item);
    return item;
  }

  getQueue(): TransitionQueueItem[] {
    return [...this.queue];
  }
}
