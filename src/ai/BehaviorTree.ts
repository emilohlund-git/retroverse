import { EntityManager } from "../entities/EntityManager";

export type BehaviorStatus = 'SUCCESS' | 'FAILURE' | 'RUNNING';

export interface BehaviorNode {
  tick(entityManager: EntityManager): BehaviorStatus;
}

export class BehaviorTree {
  rootNode: BehaviorNode;

  constructor(rootNode: BehaviorNode) {
    this.rootNode = rootNode;
  }

  tick(entityManager: EntityManager): BehaviorStatus {
    return this.rootNode.tick(entityManager);
  }
}