import { Component } from "../components/Component";
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

  public getEntitiesByComponent<T extends Component>(component: ComponentType<T>): Entity[] {
    return this.entities.filter((value) => value.getComponent(component) !== undefined);
  }

  public getEntitiesByComponents<T extends Component[]>(components: ComponentType<T>[]): Entity[] {
    return this.entities.filter((value) => components.every((c) => value.getComponent(c) !== undefined));
  }
}