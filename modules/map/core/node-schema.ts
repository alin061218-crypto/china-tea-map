export const NODE_TYPES = [
  'country',
  'region',
  'province',
  'tea',
  'story',
  'culture',
  'timeline',
] as const;

export type NodeType = typeof NODE_TYPES[number];

export interface NodeRelation {
  type: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}

export interface NodeBehavior {
  type: string;
  payload?: Record<string, unknown>;
}

export interface Node {
  id: string;
  type: NodeType;
  metadata: Record<string, unknown>;
  relations: NodeRelation[];
  entryBehavior: NodeBehavior | null;
  exitBehavior: NodeBehavior | null;
  uiComponentRef: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNodeRelation(value: unknown): value is NodeRelation {
  if (!isRecord(value)) return false;
  if (typeof value.type !== 'string') return false;
  if (typeof value.targetId !== 'string') return false;
  return value.metadata === undefined || isRecord(value.metadata);
}

function isNodeBehavior(value: unknown): value is NodeBehavior {
  if (!isRecord(value)) return false;
  if (typeof value.type !== 'string') return false;
  return value.payload === undefined || isRecord(value.payload);
}

export function isNode(value: unknown): value is Node {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    NODE_TYPES.includes(value.type as NodeType) &&
    isRecord(value.metadata) &&
    Array.isArray(value.relations) &&
    value.relations.every(isNodeRelation) &&
    (value.entryBehavior === null || isNodeBehavior(value.entryBehavior)) &&
    (value.exitBehavior === null || isNodeBehavior(value.exitBehavior)) &&
    typeof value.uiComponentRef === 'string'
  );
}
