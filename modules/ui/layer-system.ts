export const LAYERS = [
  'Base Map',
  'Terrain',
  'Fog',
  'Labels',
  'Pins',
  'Subregion Labels',
  'Detail Panel',
] as const;

export type LayerName = typeof LAYERS[number];

export interface LayerState {
  name: LayerName;
  visible: boolean;
  order: number;
}

export function createLayerSystem(): LayerState[] {
  return LAYERS.map((name, order) => ({
    name,
    visible: true,
    order,
  }));
}

export function setLayerVisibility(layers: LayerState[], name: LayerName, visible: boolean): LayerState[] {
  return layers.map((layer) => (layer.name === name ? { ...layer, visible } : layer));
}
