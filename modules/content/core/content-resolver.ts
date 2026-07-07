import type { CultureEntity } from '../culture/culture-model';
import type { StoryEntity } from '../story/story-model';
import type { TeaEntity } from '../tea/tea-schema';
import { getTea } from '../tea/tea-registry';
import { getContentByNode } from './content-binding';

export type ContentViewModelKind = 'tea' | 'story' | 'culture';

export interface ContentViewModel {
  id: string;
  kind: ContentViewModelKind;
  title: string;
  body: string;
  tags: string[];
  refs: Record<string, string[]>;
  props: Record<string, unknown>;
}

export interface ContentResolverInput {
  contentId?: string;
  nodeId?: string;
}

export interface ContentResolverSources {
  teas?: TeaEntity[];
  stories?: StoryEntity[];
  cultures?: CultureEntity[];
}

function findTea(contentId: string, sources: ContentResolverSources): TeaEntity | null {
  return sources.teas?.find((tea) => tea.tea_id === contentId) ?? getTea(contentId);
}

function findStory(contentId: string, sources: ContentResolverSources): StoryEntity | null {
  return sources.stories?.find((story) => story.story_id === contentId) ?? null;
}

function findCulture(contentId: string, sources: ContentResolverSources): CultureEntity | null {
  return sources.cultures?.find((culture) => culture.culture_id === contentId) ?? null;
}

export function teaToViewModel(tea: TeaEntity): ContentViewModel {
  return {
    id: tea.tea_id,
    kind: 'tea',
    title: tea.name,
    body: tea.processing_method,
    tags: [tea.type, ...tea.flavor_profile, ...tea.aroma_profile],
    refs: {
      stories: [...tea.story_refs],
      cultures: [...tea.culture_refs],
    },
    props: {
      origin: tea.origin,
      processing_method: tea.processing_method,
      flavor_profile: [...tea.flavor_profile],
      aroma_profile: [...tea.aroma_profile],
    },
  };
}

export function storyToViewModel(story: StoryEntity): ContentViewModel {
  return {
    id: story.story_id,
    kind: 'story',
    title: story.title,
    body: story.narrative,
    tags: [],
    refs: {
      teas: [...story.linked_tea_ids],
      timeline: [...story.timeline_refs],
    },
    props: {
      linked_tea_ids: [...story.linked_tea_ids],
      timeline_refs: [...story.timeline_refs],
    },
  };
}

export function cultureToViewModel(culture: CultureEntity): ContentViewModel {
  return {
    id: culture.culture_id,
    kind: 'culture',
    title: culture.concept,
    body: culture.description,
    tags: [...culture.region_refs],
    refs: {
      teas: [...culture.linked_tea_ids],
      regions: [...culture.region_refs],
    },
    props: {
      linked_tea_ids: [...culture.linked_tea_ids],
      region_refs: [...culture.region_refs],
    },
  };
}

export function resolveContent(
  input: ContentResolverInput,
  sources: ContentResolverSources = {},
): ContentViewModel | null {
  const contentId = input.contentId ?? (input.nodeId ? getContentByNode(input.nodeId) : null);
  if (!contentId) return null;

  const tea = findTea(contentId, sources);
  if (tea) return teaToViewModel(tea);

  const story = findStory(contentId, sources);
  if (story) return storyToViewModel(story);

  const culture = findCulture(contentId, sources);
  if (culture) return cultureToViewModel(culture);

  return null;
}
