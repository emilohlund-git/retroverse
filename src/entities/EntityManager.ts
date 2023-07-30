import { Entity } from "./Entity";

type ComponentType<T> = new (...args: any[]) => T;

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
    return this.entities.filter((value) => components.every((c) => value.getComponent(c) !== undefined));
  }
}