export const TEA_TYPES = ['green', 'black', 'oolong', 'white', 'yellow', 'dark'] as const;

export type TeaType = typeof TEA_TYPES[number];

export interface TeaEntity {
  tea_id: string;
  name: string;
  type: TeaType;
  origin: string;
  processing_method: string;
  flavor_profile: string[];
  aroma_profile: string[];
  story_refs: string[];
  culture_refs: string[];
}
