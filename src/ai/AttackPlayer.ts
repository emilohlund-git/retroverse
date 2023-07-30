import { EntityManager } from "../entities/EntityManager";
import { BehaviorNode, BehaviorStatus } from "./BehaviorTree";

export class Attack implements BehaviorNode {
  tick(entityManager: EntityManager): BehaviorStatus {
    const aiEntities = entityManager.getEntitiesByComponent("AIComponent");
    const playerEntity = entityManager.getEntityByName('player');
    if (!playerEntity) {

      return 'FAILURE';
    }

    return 'SUCCESS';
  }
}