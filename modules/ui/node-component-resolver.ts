import { NodeType } from '../map/core/node-schema';

export const NODE_COMPONENT_REFS: Partial<Record<NodeType, string>> = {
  country: 'MapRegionView',
  region: 'MapRegionView',
  province: 'ProvinceDetailView',
  tea: 'TeaCardView',
  story: 'StoryPanel',
};

export function resolveNodeComponent(type: NodeType): string | null {
  return NODE_COMPONENT_REFS[type] ?? null;
}
