import type { Node } from '../map/core/node-schema';
import type { CameraState } from '../map/core/camera-state';
import type { NavStateSnapshot } from '../map/nav/nav-state-machine';
import { createLayerSystem, LayerState } from '../ui/layer-system';

export interface InitialUiLayoutState {
  layers: LayerState[];
  activePanel: string | null;
  navigationLocked: boolean;
}

export interface InitialScene {
  rootNodeId: string;
  rootNode: Node;
  camera: CameraState;
  navigation: NavStateSnapshot;
  uiLayout: InitialUiLayoutState;
}

const ROOT_NODE: Node = {
  id: 'country:china',
  type: 'country',
  metadata: {
    level: 'country',
    default: true,
  },
  relations: [],
  entryBehavior: null,
  exitBehavior: null,
  uiComponentRef: 'MapRegionView',
};

function cloneRootNode(): Node {
  return {
    ...ROOT_NODE,
    metadata: { ...ROOT_NODE.metadata },
    relations: [...ROOT_NODE.relations],
  };
}

export function getInitialScene(): InitialScene {
  const rootNode = cloneRootNode();

  return {
    rootNodeId: rootNode.id,
    rootNode,
    camera: {
      zoomLevel: 'Global',
      currentFocusNode: rootNode.id,
    },
    navigation: {
      state: 'Idle',
      selectedNodeId: null,
      focusedNodeId: null,
      storyNodeId: null,
    },
    uiLayout: {
      layers: createLayerSystem(),
      activePanel: null,
      navigationLocked: false,
    },
  };
}
