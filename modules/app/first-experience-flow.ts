import type { SemanticEvent } from './behavior-rules';
import {
  resolveSemanticTiming,
  resolveCameraRhythm,
} from './experience-timing';

export type FirstExperienceStepIndex = 0 | 1 | 2 | 3 | 4;

export interface FirstExperienceState {
  rootNodeId?: string;
  currentNodeId?: string;
  currentRegion?: string | null;
  childNodeIds?: string[];
  contentId?: string;
}

export interface FirstExperiencePayload {
  [key: string]: unknown;
  timing: {
    delay: number;
    duration: number;
    easing: string;
    note: string;
  };
  camera: {
    motion: string;
    zoom: string;
    drift: string;
  };
}

export interface FirstExperienceFlowStep {
  step: FirstExperienceStepIndex;
  name: string;
  semantic_event: SemanticEvent;
  payload: FirstExperiencePayload;
}

const DEFAULT_ROOT_NODE_ID = 'country:china';

function withExperienceMetadata(
  existingPayload: Record<string, unknown>,
  event: SemanticEvent,
  context: string,
  state: FirstExperienceState,
): FirstExperiencePayload {
  const timing = resolveSemanticTiming({
    event,
    context,
  });

  const camera = resolveCameraRhythm({
    event,
    region: state.currentRegion ?? null,
  });

  return {
    ...existingPayload,
    timing: {
      delay: timing.delay,
      duration: timing.duration,
      easing: timing.easing,
      note: timing.perceptualNote,
    },
    camera: {
      motion: camera.motion,
      zoom: camera.zoom,
      drift: camera.drift,
    },
  };
}

export function resolveFirstExperienceFlowStep(
  step: FirstExperienceStepIndex,
  state: FirstExperienceState = {},
): FirstExperienceFlowStep {
  switch (step) {
    case 0: {
      const semantic_event = 'INK_WASH_BLOOM';
      const name = 'paper_world_first_breath';
      const existingPayload = {
        rootNodeId: state.rootNodeId ?? DEFAULT_ROOT_NODE_ID,
        surface: 'paper_texture_world',
      };

      return {
        step,
        name,
        semantic_event,
        payload: withExperienceMetadata(existingPayload, semantic_event, name, state),
      };
    }

    case 1: {
      const semantic_event = 'SOFT_INK_CONVERGENCE';
      const name = 'china_ink_attention_gathers';
      const existingPayload = {
        nodeId: state.currentNodeId ?? state.rootNodeId ?? DEFAULT_ROOT_NODE_ID,
        focus: 'root_country_presence',
      };

      return {
        step,
        name,
        semantic_event,
        payload: withExperienceMetadata(existingPayload, semantic_event, name, state),
      };
    }

    case 2: {
      const semantic_event = 'FLORAL_EMERGENCE';
      const name = 'region_flower_signals_appear';
      const existingPayload = {
        nodeId: state.currentNodeId ?? state.rootNodeId ?? DEFAULT_ROOT_NODE_ID,
        childNodeIds: state.childNodeIds ? [...state.childNodeIds] : [],
      };

      return {
        step,
        name,
        semantic_event,
        payload: withExperienceMetadata(existingPayload, semantic_event, name, state),
      };
    }

    case 3: {
      const semantic_event = 'INK_SINK_FLOW';
      const name = 'paper_depth_opens';
      const existingPayload = {
        nodeId: state.currentNodeId ?? state.rootNodeId ?? DEFAULT_ROOT_NODE_ID,
        childNodeIds: state.childNodeIds ? [...state.childNodeIds] : [],
      };

      return {
        step,
        name,
        semantic_event,
        payload: withExperienceMetadata(existingPayload, semantic_event, name, state),
      };
    }

    case 4: {
      const semantic_event = 'PAPER_SETTLE_FADE';
      const name = 'first_breath_settles';
      const existingPayload = {
        nodeId: state.currentNodeId ?? state.rootNodeId ?? DEFAULT_ROOT_NODE_ID,
        contentId: state.contentId ?? state.currentNodeId ?? state.rootNodeId ?? DEFAULT_ROOT_NODE_ID,
      };

      return {
        step,
        name,
        semantic_event,
        payload: withExperienceMetadata(existingPayload, semantic_event, name, state),
      };
    }

    default:
      throw new Error(`Unsupported first experience step: ${step}`);
  }
}

export function resolveFirstExperienceFlow(state: FirstExperienceState = {}): FirstExperienceFlowStep[] {
  return [0, 1, 2, 3, 4].map((step) => resolveFirstExperienceFlowStep(step as FirstExperienceStepIndex, state));
}
