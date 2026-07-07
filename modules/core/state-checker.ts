import { CameraState } from '../map/core/camera-state';
import { getNode } from '../map/core/node-registry';
import { NavStateSnapshot } from '../map/nav/nav-state-machine';
import { TransitionQueueItem } from '../animation/transition-pipeline';

export interface StateIssue {
  type: 'node mismatch' | 'camera desync' | 'animation overflow';
  message: string;
}

export interface StateCheckerInput {
  nav: NavStateSnapshot;
  camera: CameraState;
  animationQueue: TransitionQueueItem[];
  maxAnimationQueueSize?: number;
}

export function checkStateConsistency(input: StateCheckerInput): StateIssue[] {
  const issues: StateIssue[] = [];
  const maxAnimationQueueSize = input.maxAnimationQueueSize ?? 8;

  if (input.nav.focusedNodeId && !getNode(input.nav.focusedNodeId)) {
    issues.push({
      type: 'node mismatch',
      message: `Focused node does not exist: ${input.nav.focusedNodeId}`,
    });
  }

  if (input.camera.currentFocusNode !== input.nav.focusedNodeId) {
    issues.push({
      type: 'camera desync',
      message: 'Camera focus node does not match navigation focus node.',
    });
  }

  if (input.animationQueue.length > maxAnimationQueueSize) {
    issues.push({
      type: 'animation overflow',
      message: `Animation queue size ${input.animationQueue.length} exceeds ${maxAnimationQueueSize}.`,
    });
  }

  return issues;
}
