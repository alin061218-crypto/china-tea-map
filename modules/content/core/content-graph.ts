export const CONTENT_NODE_KINDS = ['Tea', 'Story', 'Culture', 'Region'] as const;

export type ContentNodeKind = typeof CONTENT_NODE_KINDS[number];

export interface ContentGraphEdge {
  fromId: string;
  toId: string;
  type: string;
}

export interface ContentGraphNeighbor {
  id: string;
  relationType: string;
  direction: 'outgoing' | 'incoming';
}

export interface ContentTraversalNode {
  id: string;
  depth: number;
}

function edgeKey(fromId: string, toId: string, type: string): string {
  const ordered = [fromId, toId].sort();
  return `${ordered[0]}::${ordered[1]}::${type}`;
}

function cloneEdge(edge: ContentGraphEdge): ContentGraphEdge {
  return { ...edge };
}

export class ContentGraph {
  private readonly edges = new Map<string, ContentGraphEdge>();

  addEdge(fromId: string, toId: string, type: string): void {
    if (!fromId || !toId || !type) {
      throw new Error('Content graph edges require fromId, toId, and type.');
    }

    this.edges.set(edgeKey(fromId, toId, type), { fromId, toId, type });
  }

  getNeighbors(id: string): ContentGraphNeighbor[] {
    return Array.from(this.edges.values())
      .flatMap((edge) => {
        const neighbors: ContentGraphNeighbor[] = [];
        if (edge.fromId === id) {
          neighbors.push({ id: edge.toId, relationType: edge.type, direction: 'outgoing' });
        }
        if (edge.toId === id) {
          neighbors.push({ id: edge.fromId, relationType: edge.type, direction: 'incoming' });
        }
        return neighbors;
      })
      .sort((left, right) => (
        left.id.localeCompare(right.id) ||
        left.relationType.localeCompare(right.relationType) ||
        left.direction.localeCompare(right.direction)
      ));
  }

  traverse(id: string, depth: number): ContentTraversalNode[] {
    const maxDepth = Math.max(0, depth);
    const visited = new Set<string>([id]);
    const result: ContentTraversalNode[] = [{ id, depth: 0 }];
    const queue: ContentTraversalNode[] = [{ id, depth: 0 }];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || current.depth >= maxDepth) continue;

      this.getNeighbors(current.id).forEach((neighbor) => {
        if (visited.has(neighbor.id)) return;
        visited.add(neighbor.id);
        const next = { id: neighbor.id, depth: current.depth + 1 };
        result.push(next);
        queue.push(next);
      });
    }

    return result;
  }

  queryByRelation(type: string): ContentGraphEdge[] {
    return Array.from(this.edges.values())
      .filter((edge) => edge.type === type)
      .map(cloneEdge)
      .sort((left, right) => left.fromId.localeCompare(right.fromId) || left.toId.localeCompare(right.toId));
  }

  clear(): void {
    this.edges.clear();
  }
}

const graph = new ContentGraph();

export function addEdge(fromId: string, toId: string, type: string): void {
  graph.addEdge(fromId, toId, type);
}

export function getNeighbors(id: string): ContentGraphNeighbor[] {
  return graph.getNeighbors(id);
}

export function traverse(id: string, depth: number): ContentTraversalNode[] {
  return graph.traverse(id, depth);
}

export function queryByRelation(type: string): ContentGraphEdge[] {
  return graph.queryByRelation(type);
}

export { graph as contentGraph };
