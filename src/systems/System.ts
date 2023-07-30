import { EntityManager } from "../entities/EntityManager";

export abstract class System {
  abstract update(deltaTime: number, entityManager: EntityManager): void;
  abstract render(): void;
  abstract preload(entityManager: EntityManager): void;
}