import type { EventChannel } from '../core/event-bus';
import type { NodeType } from '../map/core/node-schema';

export const SEMANTIC_ACTION_MAP = {
  ENTRY: 'INK_WASH_BLOOM',
  NODE_ENTER: 'FLORAL_EMERGENCE',
  NODE_EXIT: 'PAPER_SETTLE_FADE',
  DRILL_DOWN: 'INK_SINK_FLOW',
  DRILL_UP: 'INK_RISE_REVEAL',
  STORY_ENTER: 'INK_SCENE_EXPAND',
  STORY_EXIT: 'WASH_CONTRACT_RESTORE',
  FOCUS_NODE: 'SOFT_INK_CONVERGENCE',
} as const;

export const SEMANTIC_ANIMATION_IDS = {
  INK_BLOOM: 'INK_BLOOM',
  INK_FLOW: 'INK_FLOW',
  FLORAL_BLOOM: 'FLORAL_BLOOM',
  PAPER_FADE: 'PAPER_FADE',
  SCENE_EXPAND: 'SCENE_EXPAND',
  INK_CONVERGE: 'INK_CONVERGE',
} as const;

export const CAMERA_MATERIAL_BEHAVIORS = [
  'diffusion_focus',
  'ink_drift',
  'paper_depth_sink',
  'floral_focus_emergence',
] as const;

export type SemanticEvent = typeof SEMANTIC_ACTION_MAP[keyof typeof SEMANTIC_ACTION_MAP];
export type SemanticAnimationId = typeof SEMANTIC_ANIMATION_IDS[keyof typeof SEMANTIC_ANIMATION_IDS];
export type CameraMaterialBehavior = typeof CAMERA_MATERIAL_BEHAVIORS[number];
export type SemanticSystem = 'MAP' | 'CAMERA' | 'NAV' | 'ANIMATION' | 'CONTENT' | 'UI';
export type SemanticPayload =
  | string
  | number
  | boolean
  | null
  | SemanticPayload[]
  | { [key: string]: SemanticPayload };

export interface ProductSemanticSignal {
  semantic_event: SemanticEvent;
  nodeId?: string;
  nodeType?: NodeType;
  contentId?: string;
  rootNodeId?: string;
  parentNodeId?: string;
  storyNodeId?: string;
  regionNodeIds?: string[];
  childNodeIds?: string[];
  storyRefs?: string[];
  cultureRefs?: string[];
  previousNavigation?: Record<string, unknown> | null;
  previousCamera?: Record<string, unknown> | null;
}

export interface ProductSemanticContext {
  rootNodeId?: string;
  previousNavigation?: Record<string, unknown> | null;
  previousCamera?: Record<string, unknown> | null;
}

export interface SemanticSystemActionTemplate {
  type: SemanticSystem;
  action: string;
  payload?: Record<string, SemanticPayload>;
}

export interface SemanticSystemAction {
  type: SemanticSystem;
  event_channel: EventChannel;
  action: string;
  payload: Record<string, unknown>;
}

export interface ProductBehaviorRule {
  condition: string;
  semantic_event: SemanticEvent;
  system_actions: SemanticSystemActionTemplate[];
}

export type BehaviorEvent = ProductSemanticSignal;
export type BehaviorContext = ProductSemanticContext;
export type BehaviorAction = SemanticSystemAction;
export type BehaviorRule = ProductBehaviorRule;

const DEFAULT_ROOT_NODE_ID = 'country:china';

const EVENT_CHANNEL_BY_SYSTEM: Record<SemanticSystem, EventChannel> = {
  MAP: 'MAP',
  CAMERA: 'MAP',
  NAV: 'NAV',
  ANIMATION: 'ANIM',
  CONTENT: 'CONTENT',
  UI: 'UI',
};

function cloneList(value: string[] | undefined): string[] {
  return value ? [...value] : [];
}

function semanticNodeId(signal: ProductSemanticSignal, context: ProductSemanticContext): string {
  return signal.nodeId
    ?? signal.storyNodeId
    ?? signal.rootNodeId
    ?? context.rootNodeId
    ?? DEFAULT_ROOT_NODE_ID;
}

function semanticRootId(signal: ProductSemanticSignal, context: ProductSemanticContext): string {
  return signal.rootNodeId ?? context.rootNodeId ?? DEFAULT_ROOT_NODE_ID;
}

function semanticContentId(signal: ProductSemanticSignal, context: ProductSemanticContext): string {
  return signal.contentId ?? signal.nodeId ?? signal.storyNodeId ?? semanticRootId(signal, context);
}

function semanticStoryId(signal: ProductSemanticSignal, context: ProductSemanticContext): string {
  return signal.storyNodeId ?? signal.nodeId ?? semanticContentId(signal, context);
}

function resolveToken(token: string, signal: ProductSemanticSignal, context: ProductSemanticContext): unknown {
  switch (token) {
    case '$semantic_event':
      return signal.semantic_event;
    case '$rootNodeId':
      return semanticRootId(signal, context);
    case '$nodeId':
      return semanticNodeId(signal, context);
    case '$nodeType':
      return signal.nodeType ?? 'country';
    case '$contentId':
      return semanticContentId(signal, context);
    case '$parentNodeId':
      return signal.parentNodeId ?? semanticRootId(signal, context);
    case '$storyNodeId':
      return semanticStoryId(signal, context);
    case '$regionNodeIds':
      return cloneList(signal.regionNodeIds);
    case '$childNodeIds':
      return cloneList(signal.childNodeIds);
    case '$storyRefs':
      return cloneList(signal.storyRefs);
    case '$cultureRefs':
      return cloneList(signal.cultureRefs);
    case '$previousNavigation':
      return signal.previousNavigation ?? context.previousNavigation ?? null;
    case '$previousCamera':
      return signal.previousCamera ?? context.previousCamera ?? null;
    default:
      return token;
  }
}

function resolvePayload(
  payload: SemanticPayload,
  signal: ProductSemanticSignal,
  context: ProductSemanticContext,
): unknown {
  if (typeof payload === 'string') {
    return payload.startsWith('$') ? resolveToken(payload, signal, context) : payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => resolvePayload(item, signal, context));
  }

  if (payload && typeof payload === 'object') {
    return Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, resolvePayload(value, signal, context)]),
    );
  }

  return payload;
}

function resolveAction(
  template: SemanticSystemActionTemplate,
  signal: ProductSemanticSignal,
  context: ProductSemanticContext,
): SemanticSystemAction {
  return {
    type: template.type,
    event_channel: EVENT_CHANNEL_BY_SYSTEM[template.type],
    action: template.action,
    payload: resolvePayload(template.payload ?? {}, signal, context) as Record<string, unknown>,
  };
}

function conditionMatches(condition: string, signal: ProductSemanticSignal): boolean {
  switch (condition) {
    case 'paper_world_first_breath':
      return signal.semantic_event === 'INK_WASH_BLOOM';
    case 'any_node_flower_opens':
      return signal.semantic_event === 'FLORAL_EMERGENCE';
    case 'tea_flower_carries_memory':
      return signal.semantic_event === 'FLORAL_EMERGENCE' && signal.nodeType === 'tea';
    case 'ink_descends_into_layer':
      return signal.semantic_event === 'INK_SINK_FLOW';
    case 'ink_returns_to_surface':
      return signal.semantic_event === 'INK_RISE_REVEAL';
    case 'story_wash_opens':
      return signal.semantic_event === 'INK_SCENE_EXPAND';
    case 'story_wash_recedes':
      return signal.semantic_event === 'WASH_CONTRACT_RESTORE';
    case 'node_petals_return_to_paper':
      return signal.semantic_event === 'PAPER_SETTLE_FADE';
    case 'attention_gathers_as_soft_ink':
      return signal.semantic_event === 'SOFT_INK_CONVERGENCE';
    default:
      return false;
  }
}

export const PRODUCT_BEHAVIOR_RULES: ProductBehaviorRule[] = [
  {
    condition: 'paper_world_first_breath',
    semantic_event: 'INK_WASH_BLOOM',
    system_actions: [
      {
        type: 'MAP',
        action: 'setRootFocus',
        payload: {
          nodeId: '$rootNodeId',
          material_field: 'ink_wash_map',
          world_surface: 'paper_texture',
        },
      },
      {
        type: 'CAMERA',
        action: 'motion',
        payload: {
          behavior: 'diffusion_focus',
          anchor: '$rootNodeId',
          from: 'global_paper_field',
          toward: 'region_layer',
          interpolation: 'soft_flow_interpolation',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'INK_BLOOM',
          material: 'water_ink_spread',
        },
      },
      {
        type: 'CONTENT',
        action: 'preload',
        payload: {
          scope: 'region_level',
          parentNodeId: '$rootNodeId',
          nodeIds: '$regionNodeIds',
        },
      },
      {
        type: 'UI',
        action: 'updateViewModel',
        payload: {
          viewModel: 'paper_world_ready',
          nodeId: '$rootNodeId',
        },
      },
    ],
  },
  {
    condition: 'any_node_flower_opens',
    semantic_event: 'FLORAL_EMERGENCE',
    system_actions: [
      {
        type: 'MAP',
        action: 'focusNode',
        payload: {
          nodeId: '$nodeId',
          nodeType: '$nodeType',
          signal: 'floral_bloom_point',
        },
      },
      {
        type: 'CAMERA',
        action: 'motion',
        payload: {
          behavior: 'floral_focus_emergence',
          anchor: '$nodeId',
          interpolation: 'soft_flow_interpolation',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'FLORAL_BLOOM',
          nodeId: '$nodeId',
        },
      },
      {
        type: 'CONTENT',
        action: 'loadNodeContent',
        payload: {
          channel: 'CONTENT',
          nodeId: '$nodeId',
          contentId: '$contentId',
        },
      },
      {
        type: 'UI',
        action: 'updateViewModel',
        payload: {
          viewModel: 'node_detail',
          nodeId: '$nodeId',
          contentId: '$contentId',
        },
      },
    ],
  },
  {
    condition: 'tea_flower_carries_memory',
    semantic_event: 'FLORAL_EMERGENCE',
    system_actions: [
      {
        type: 'CONTENT',
        action: 'loadTeaEssence',
        payload: {
          nodeId: '$nodeId',
          contentId: '$contentId',
          include: ['story_refs', 'culture_refs'],
        },
      },
      {
        type: 'UI',
        action: 'updateViewModel',
        payload: {
          viewModel: 'tea_summary',
          nodeId: '$nodeId',
          contentId: '$contentId',
        },
      },
      {
        type: 'CONTENT',
        action: 'preload',
        payload: {
          scope: 'tea_memory_threads',
          story_refs: '$storyRefs',
          culture_refs: '$cultureRefs',
        },
      },
      {
        type: 'NAV',
        action: 'openCrossNodePaths',
        payload: {
          nodeId: '$nodeId',
          enabled: true,
          story_refs: '$storyRefs',
          culture_refs: '$cultureRefs',
        },
      },
    ],
  },
  {
    condition: 'ink_descends_into_layer',
    semantic_event: 'INK_SINK_FLOW',
    system_actions: [
      {
        type: 'NAV',
        action: 'setState',
        payload: {
          value: 'DRILLING',
          nodeId: '$nodeId',
        },
      },
      {
        type: 'CAMERA',
        action: 'motion',
        payload: {
          behavior: 'paper_depth_sink',
          anchor: '$nodeId',
          direction: 'down_into_fiber',
          interpolation: 'soft_flow_interpolation',
        },
      },
      {
        type: 'MAP',
        action: 'expandChildren',
        payload: {
          nodeId: '$nodeId',
          childNodeIds: '$childNodeIds',
          material: 'ink_pool_branching',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'INK_FLOW',
          direction: 'down_into_paper',
        },
      },
      {
        type: 'UI',
        action: 'updateViewModel',
        payload: {
          viewModel: 'subregion_labels_as_wet_ink',
          nodeId: '$nodeId',
        },
      },
    ],
  },
  {
    condition: 'ink_returns_to_surface',
    semantic_event: 'INK_RISE_REVEAL',
    system_actions: [
      {
        type: 'NAV',
        action: 'setState',
        payload: {
          value: 'SURFACING',
          nodeId: '$nodeId',
          parentNodeId: '$parentNodeId',
        },
      },
      {
        type: 'CAMERA',
        action: 'motion',
        payload: {
          behavior: 'diffusion_focus',
          anchor: '$parentNodeId',
          direction: 'up_through_wash',
          interpolation: 'soft_flow_interpolation',
        },
      },
      {
        type: 'MAP',
        action: 'revealParentLayer',
        payload: {
          nodeId: '$nodeId',
          parentNodeId: '$parentNodeId',
          clarity: 'paper_edges_return',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'INK_FLOW',
          direction: 'up_through_wash',
        },
      },
    ],
  },
  {
    condition: 'attention_gathers_as_soft_ink',
    semantic_event: 'SOFT_INK_CONVERGENCE',
    system_actions: [
      {
        type: 'MAP',
        action: 'focusNode',
        payload: {
          nodeId: '$nodeId',
          convergence: 'soft_ink_center',
        },
      },
      {
        type: 'CAMERA',
        action: 'motion',
        payload: {
          behavior: 'diffusion_focus',
          anchor: '$nodeId',
          drift: 'ink_drift',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'INK_CONVERGE',
          nodeId: '$nodeId',
        },
      },
      {
        type: 'UI',
        action: 'updateViewModel',
        payload: {
          viewModel: 'focused_ink_detail',
          nodeId: '$nodeId',
        },
      },
    ],
  },
  {
    condition: 'story_wash_opens',
    semantic_event: 'INK_SCENE_EXPAND',
    system_actions: [
      {
        type: 'NAV',
        action: 'setState',
        payload: {
          value: 'STORY_MODE',
          storyNodeId: '$storyNodeId',
          previousNavigation: '$previousNavigation',
        },
      },
      {
        type: 'CAMERA',
        action: 'lock',
        payload: {
          reason: 'scene_expands_like_ink_on_paper',
          previousCamera: '$previousCamera',
        },
      },
      {
        type: 'MAP',
        action: 'setBackgroundInkLayer',
        payload: {
          storyNodeId: '$storyNodeId',
          structural_clarity: 'softened',
        },
      },
      {
        type: 'UI',
        action: 'switchLayout',
        payload: {
          layout: 'story_mode',
          content_flow: 'narrative_wash',
        },
      },
      {
        type: 'CONTENT',
        action: 'loadStory',
        payload: {
          storyNodeId: '$storyNodeId',
          contentId: '$contentId',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'SCENE_EXPAND',
          material: 'ink_scene_bloom',
        },
      },
    ],
  },
  {
    condition: 'story_wash_recedes',
    semantic_event: 'WASH_CONTRACT_RESTORE',
    system_actions: [
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'PAPER_FADE',
          material: 'receding_wash',
        },
      },
      {
        type: 'CAMERA',
        action: 'restore',
        payload: {
          previousCamera: '$previousCamera',
          clarity: 'paper_structure_returns',
        },
      },
      {
        type: 'NAV',
        action: 'restore',
        payload: {
          previousNavigation: '$previousNavigation',
        },
      },
      {
        type: 'MAP',
        action: 'restoreStructuralInk',
        payload: {
          clarity: 'province_edges_return',
        },
      },
      {
        type: 'UI',
        action: 'switchLayout',
        payload: {
          layout: 'atlas_mode',
          content_flow: 'node_graph',
        },
      },
    ],
  },
  {
    condition: 'node_petals_return_to_paper',
    semantic_event: 'PAPER_SETTLE_FADE',
    system_actions: [
      {
        type: 'UI',
        action: 'clearTemporaryInk',
        payload: {
          nodeId: '$nodeId',
          residue: 'petals_and_tooltips',
        },
      },
      {
        type: 'MAP',
        action: 'releaseNodeFocus',
        payload: {
          nodeId: '$nodeId',
          paper_settle: true,
        },
      },
      {
        type: 'CAMERA',
        action: 'motion',
        payload: {
          behavior: 'ink_drift',
          anchor: '$parentNodeId',
          interpolation: 'soft_flow_interpolation',
        },
      },
      {
        type: 'ANIMATION',
        action: 'play',
        payload: {
          animationId: 'PAPER_FADE',
          material: 'paper_settle',
        },
      },
    ],
  },
];

export function evaluateBehaviorRules(
  signal: ProductSemanticSignal,
  context: ProductSemanticContext = {},
  rules: ProductBehaviorRule[] = PRODUCT_BEHAVIOR_RULES,
): SemanticSystemAction[] {
  return rules
    .filter((rule) => rule.semantic_event === signal.semantic_event && conditionMatches(rule.condition, signal))
    .flatMap((rule) => rule.system_actions.map((systemAction) => resolveAction(systemAction, signal, context)));
}
