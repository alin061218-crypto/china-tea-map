import type { TeaEntity } from './tea-schema';

export const FLAVORS = ['floral', 'roasted', 'vegetal', 'fruity', 'earthy', 'nutty'] as const;

export type Flavor = typeof FLAVORS[number];
export type FlavorVector = Record<Flavor, number>;

export interface WeightedFlavorTag {
  flavor: Flavor;
  score: number;
}

const FLAVOR_ALIASES: Record<Flavor, string[]> = {
  floral: ['floral', 'flower', 'blossom', 'orchid', 'jasmine'],
  roasted: ['roasted', 'toast', 'charcoal', 'baked', 'smoky'],
  vegetal: ['vegetal', 'grass', 'leaf', 'green', 'herbal'],
  fruity: ['fruity', 'fruit', 'citrus', 'berry', 'peach'],
  earthy: ['earthy', 'soil', 'mineral', 'woody', 'moss'],
  nutty: ['nutty', 'nut', 'chestnut', 'almond', 'bean'],
};

function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

function emptyVector(): FlavorVector {
  return {
    floral: 0,
    roasted: 0,
    vegetal: 0,
    fruity: 0,
    earthy: 0,
    nutty: 0,
  };
}

function resolveFlavor(value: string): Flavor | null {
  const text = value.trim().toLowerCase();
  if (!text) return null;

  return FLAVORS.find((flavor) => FLAVOR_ALIASES[flavor].some((alias) => text.includes(alias))) ?? null;
}

export function createFlavorVector(tags: WeightedFlavorTag[] = []): FlavorVector {
  const vector = emptyVector();

  tags.forEach((tag) => {
    vector[tag.flavor] = Math.max(vector[tag.flavor], clampScore(tag.score));
  });

  return vector;
}

export function mapTeaToFlavorVector(
  tea: Pick<TeaEntity, 'flavor_profile'>,
  weightedTags: WeightedFlavorTag[] = [],
): FlavorVector {
  const vector = createFlavorVector(weightedTags);

  tea.flavor_profile.forEach((profile) => {
    const flavor = resolveFlavor(profile);
    if (flavor) vector[flavor] = Math.max(vector[flavor], 1);
  });

  return vector;
}

export function calculateFlavorSimilarity(left: FlavorVector, right: FlavorVector): number {
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  FLAVORS.forEach((flavor) => {
    dotProduct += left[flavor] * right[flavor];
    leftMagnitude += left[flavor] ** 2;
    rightMagnitude += right[flavor] ** 2;
  });

  if (leftMagnitude === 0 || rightMagnitude === 0) return 0;
  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

export function calculateTeaSimilarity(
  left: Pick<TeaEntity, 'flavor_profile'>,
  right: Pick<TeaEntity, 'flavor_profile'>,
): number {
  return calculateFlavorSimilarity(mapTeaToFlavorVector(left), mapTeaToFlavorVector(right));
}
