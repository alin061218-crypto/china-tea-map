import { AnimationEngine } from '../animation/anim-engine';
import { TransitionPipeline } from '../animation/transition-pipeline';
import { contentGraph, ContentGraphEdge } from '../content/core/content-graph';
import { EventBus } from '../core/event-bus';
import { focusNode, getCameraState, resetCameraState, setZoomLevel } from '../map/core/camera-state';
import { HierarchyTree } from '../map/core/hierarchy-builder';
import { Node } from '../map/core/node-schema';
import { nodeRegistry, preloadHierarchy, registerNode } from '../map/core/node-registry';
import { getNavState, resetNavState } from '../map/nav/nav-state-machine';
import { RenderSyncController } from '../ui/render-sync';
import { getInitialScene, InitialScene } from './initial-scene';

export interface BootstrapOptions {
  rootNodes?: Node[];
  contentEdges?: ContentGraphEdge[];
  startAnimationEngine?: boolean;
}

export interface BootstrappedApplication {
  eventBus: EventBus;
  nodeRegistry: typeof nodeRegistry;
  contentGraph: typeof contentGraph;
  hierarchy: HierarchyTree;
  animationEngine: AnimationEngine;
  transitionPipeline: TransitionPipeline;
  renderSync: RenderSyncController;
  initialScene: InitialScene;
  initializationOrder: string[];
}

function sortEdges(edges: ContentGraphEdge[]): ContentGraphEdge[] {
  return [...edges].sort((left, right) => (
    left.fromId.localeCompare(right.fromId) ||
    left.toId.localeCompare(right.toId) ||
    left.type.localeCompare(right.type)
  ));
}

function sortNodes(nodes: Node[]): Node[] {
  return [...nodes].sort((left, right) => left.id.localeCompare(right.id));
}

export function bootstrap(options: BootstrapOptions = {}): BootstrappedApplication {
  const initializationOrder: string[] = [];
  const initialScene = getInitialScene();

  const eventBus = new EventBus();
  initializationOrder.push('event-bus');

  nodeRegistry.clear();
  initializationOrder.push('node-registry');

  contentGraph.clear();
  sortEdges(options.contentEdges ?? []).forEach((edge) => {
    contentGraph.addEdge(edge.fromId, edge.toId, edge.type);
  });
  initializationOrder.push('content-graph');

  const rootNodes = options.rootNodes ?? [initialScene.rootNode];
  sortNodes(rootNodes.filter((node) => node.type === 'country')).forEach(registerNode);
  const hierarchy = preloadHierarchy();
  initializationOrder.push('root-nodes');

  resetCameraState();
  setZoomLevel(initialScene.camera.zoomLevel);
  focusNode(initialScene.camera.currentFocusNode);
  initializationOrder.push('camera-state');

  resetNavState();
  initializationOrder.push('navigation-state');

  const animationEngine = new AnimationEngine(eventBus);
  if (options.startAnimationEngine !== false) animationEngine.start();
  const transitionPipeline = new TransitionPipeline(eventBus);
  initializationOrder.push('animation-engine');

  const renderSync = new RenderSyncController(eventBus);
  renderSync.sync({
    nav: getNavState(),
    camera: getCameraState(),
    animation: { initialized: true },
  });
  initializationOrder.push('render-sync');

  return {
    eventBus,
    nodeRegistry,
    contentGraph,
    hierarchy,
    animationEngine,
    transitionPipeline,
    renderSync,
    initialScene,
    initializationOrder,
  };
}
