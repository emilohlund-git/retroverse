import { Entity } from "./Entity";

export class EntityManager {
  private entities = <Entity[]>[];

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  public addEntities(entities: Entity[]) {
    this.entities.push(...entities);
  }

  public getEntityByName(name: string): Entity | undefined {
    return this.entities.find((e) => e.name === name);
  }

  public getEntitiesByComponent(componentName: string): Entity[] {
    return this.entities.filter((value) => value.getComponent(componentName) !== undefined);
  }

  public getEntitiesByComponents(components: string[]): Entity[] {
    const uniqueEntities: Set<Entity> = new Set();

    this.entities.forEach((entity) => {
      if (components.every((c) => entity.getComponent(c) !== undefined)) {
        uniqueEntities.add(entity);
      }
    });

    return Array.from(uniqueEntities);
  }
}