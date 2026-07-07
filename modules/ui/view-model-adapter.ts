import { Node } from '../map/core/node-schema';
import { resolveNodeComponent } from './node-component-resolver';

export interface NodeViewModel {
  id: string;
  type: string;
  componentRef: string | null;
  props: Record<string, unknown>;
}

export function toNodeViewModel(node: Node): NodeViewModel {
  return {
    id: node.id,
    type: node.type,
    componentRef: node.uiComponentRef || resolveNodeComponent(node.type),
    props: { ...node.metadata },
  };
}
