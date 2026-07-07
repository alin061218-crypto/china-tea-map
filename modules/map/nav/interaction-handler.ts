import { focusNode as focusCameraNode, setZoomLevel, ZoomLevel } from '../core/camera-state';
import { transitionTo, getNavState, NavStateSnapshot } from './nav-state-machine';

export interface InteractionResult {
  navState: NavStateSnapshot;
  cameraFocusNode: string | null;
}

function result(nodeId: string | null): InteractionResult {
  return {
    navState: getNavState(),
    cameraFocusNode: nodeId,
  };
}

export function selectNode(nodeId: string): InteractionResult {
  transitionTo('Focused', { selectedNodeId: nodeId, focusedNodeId: nodeId });
  focusCameraNode(nodeId);
  return result(nodeId);
}

export function focusNode(nodeId: string): InteractionResult {
  transitionTo('Focused', { focusedNodeId: nodeId });
  focusCameraNode(nodeId);
  return result(nodeId);
}

export function zoomToNode(nodeId: string, zoomLevel: ZoomLevel): InteractionResult {
  setZoomLevel(zoomLevel);
  focusCameraNode(nodeId);
  return result(nodeId);
}

export function drillDown(nodeId: string): InteractionResult {
  transitionTo('Drilled', { selectedNodeId: nodeId, focusedNodeId: nodeId });
  focusCameraNode(nodeId);
  return result(nodeId);
}

export function drillUp(parentNodeId: string | null): InteractionResult {
  transitionTo(parentNodeId ? 'Focused' : 'Idle', {
    selectedNodeId: parentNodeId,
    focusedNodeId: parentNodeId,
    storyNodeId: null,
  });
  focusCameraNode(parentNodeId);
  return result(parentNodeId);
}

export function enterStory(storyNodeId: string): InteractionResult {
  transitionTo('StoryMode', { storyNodeId });
  return result(getNavState().focusedNodeId);
}

export function exitStory(): InteractionResult {
  const navState = getNavState();
  transitionTo(navState.focusedNodeId ? 'Focused' : 'Idle', { storyNodeId: null });
  return result(navState.focusedNodeId);
}
