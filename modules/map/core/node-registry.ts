import { isNode, Node } from './node-schema';
import { buildHierarchy, HierarchyTree } from './hierarchy-builder';

class NodeRegistry {
  private readonly nodes = new Map<string, Node>();
  private hierarchy: HierarchyTree | null = null;

  registerNode(node: Node): Node {
    if (!isNode(node)) {
      throw new Error('Invalid node cannot be registered.');
    }

    this.nodes.set(node.id, node);
    this.hierarchy = null;
    return node;
  }

  getNode(id: string): Node | undefined {
    return this.nodes.get(id);
  }

  queryNodes(predicate: (node: Node) => boolean): Node[] {
    return Array.from(this.nodes.values()).filter(predicate);
  }

  preloadHierarchy(): HierarchyTree {
    this.hierarchy = buildHierarchy(Array.from(this.nodes.values()));
    return this.hierarchy;
  }

  getHierarchy(): HierarchyTree | null {
    return this.hierarchy;
  }

  clear(): void {
    this.nodes.clear();
    this.hierarchy = null;
  }
}

const registry = new NodeRegistry();

export function registerNode(node: Node): Node {
  return registry.registerNode(node);
}

export function getNode(id: string): Node | undefined {
  return registry.getNode(id);
}

export function queryNodes(predicate: (node: Node) => boolean): Node[] {
  return registry.queryNodes(predicate);
}

export function preloadHierarchy(): HierarchyTree {
  return registry.preloadHierarchy();
}

export { registry as nodeRegistry };
