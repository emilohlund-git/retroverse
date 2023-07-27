import { EntityManager } from "../entities/EntityManager";
import { BehaviorNode, BehaviorStatus } from "./BehaviorTree";

export class SequenceNode implements BehaviorNode {
  children: BehaviorNode[];

  constructor(children: BehaviorNode[]) {
    this.children = children;
  }

  tick(entityManager: EntityManager): BehaviorStatus {
    for (const child of this.children) {
      const status = child.tick(entityManager);
      if (status === 'FAILURE') {
        return 'FAILURE';
      }
    }
    return 'SUCCESS';
  }
}