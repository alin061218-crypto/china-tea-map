import { EventBus } from './event-bus';
import { AnimationEngine } from '../animation/anim-engine';
import { TransitionPipeline } from '../animation/transition-pipeline';
import { RenderSyncController } from '../ui/render-sync';

export interface Runtime {
  eventBus: EventBus;
  animationEngine: AnimationEngine;
  transitionPipeline: TransitionPipeline;
  renderSync: RenderSyncController;
  start: () => void;
  stop: () => void;
}

export function createRuntime(): Runtime {
  const eventBus = new EventBus();
  const animationEngine = new AnimationEngine(eventBus);
  const transitionPipeline = new TransitionPipeline(eventBus);
  const renderSync = new RenderSyncController(eventBus);

  return {
    eventBus,
    animationEngine,
    transitionPipeline,
    renderSync,
    start: () => {
      animationEngine.start();
      eventBus.publish('MAP', 'runtime:started', {});
    },
    stop: () => {
      animationEngine.stop();
      eventBus.clear();
    },
  };
}
