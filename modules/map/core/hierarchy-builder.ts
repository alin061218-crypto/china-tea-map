import { Node } from './node-schema';

export interface HierarchyNode {
  node: Node;
  parent: HierarchyNode | null;
  children: HierarchyNode[];
}

export interface HierarchyTree {
  roots: HierarchyNode[];
  byId: Map<string, HierarchyNode>;
}

const CHILD_ORDER: Record<string, string[]> = {
  country: ['region'],
  region: ['province'],
  province: ['tea'],
};

function getParentId(node: Node): string | null {
  const parentRelation = node.relations.find((relation) => relation.type === 'parent');
  if (parentRelation) return parentRelation.targetId;

  const belongsToRelation = node.relations.find((relation) => relation.type === 'belongsTo');
  return belongsToRelation?.targetId ?? null;
}

function isValidParent(parent: Node, child: Node): boolean {
  return CHILD_ORDER[parent.type]?.includes(child.type) ?? false;
}

export function buildHierarchy(nodes: Node[]): HierarchyTree {
  const byId = new Map<string, HierarchyNode>();

  nodes.forEach((node) => {
    byId.set(node.id, { node, parent: null, children: [] });
  });

  byId.forEach((hierarchyNode) => {
    const parentId = getParentId(hierarchyNode.node);
    if (!parentId) return;

    const parent = byId.get(parentId);
    if (!parent || !isValidParent(parent.node, hierarchyNode.node)) return;

    hierarchyNode.parent = parent;
    parent.children.push(hierarchyNode);
  });

  return {
    roots: Array.from(byId.values()).filter((hierarchyNode) => hierarchyNode.parent === null),
    byId,
  };
}

export function getChildren(tree: HierarchyTree, id: string): HierarchyNode[] {
  return tree.byId.get(id)?.children ?? [];
}

export function getParent(tree: HierarchyTree, id: string): HierarchyNode | null {
  return tree.byId.get(id)?.parent ?? null;
}

export function getSubtree(tree: HierarchyTree, id: string): HierarchyNode[] {
  const root = tree.byId.get(id);
  if (!root) return [];

  const result: HierarchyNode[] = [];
  const visit = (current: HierarchyNode) => {
    result.push(current);
    current.children.forEach(visit);
  };

  visit(root);
  return result;
}
