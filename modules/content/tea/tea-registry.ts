import type { TeaEntity } from './tea-schema';

function cloneTea(tea: TeaEntity): TeaEntity {
  return {
    ...tea,
    flavor_profile: [...tea.flavor_profile],
    aroma_profile: [...tea.aroma_profile],
    story_refs: [...tea.story_refs],
    culture_refs: [...tea.culture_refs],
  };
}

export class TeaRegistry {
  private readonly teas = new Map<string, TeaEntity>();

  registerTea(tea: TeaEntity): void {
    this.teas.set(tea.tea_id, cloneTea(tea));
  }

  getTea(id: string): TeaEntity | null {
    const tea = this.teas.get(id);
    return tea ? cloneTea(tea) : null;
  }

  queryTea(filterFn: (tea: TeaEntity) => boolean): TeaEntity[] {
    return Array.from(this.teas.values())
      .map(cloneTea)
      .filter(filterFn);
  }

  listByType(type: TeaEntity['type']): TeaEntity[] {
    return this.queryTea((tea) => tea.type === type);
  }

  clear(): void {
    this.teas.clear();
  }
}

const registry = new TeaRegistry();

export function registerTea(tea: TeaEntity): void {
  registry.registerTea(tea);
}

export function getTea(id: string): TeaEntity | null {
  return registry.getTea(id);
}

export function queryTea(filterFn: (tea: TeaEntity) => boolean): TeaEntity[] {
  return registry.queryTea(filterFn);
}

export function listByType(type: TeaEntity['type']): TeaEntity[] {
  return registry.listByType(type);
}

export { registry as teaRegistry };
