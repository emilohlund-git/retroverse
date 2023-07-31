import { BehaviorTree } from "../ai/BehaviorTree";
import { ChasePlayer } from "../ai/ChasePlayer";
import { SelectorNode } from "../ai/SelectorNode";
import { PositionComponent } from "../components/PositionComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { System } from "./System";

export class AISystem extends System {
  private behaviorTrees: Map<string, BehaviorTree> = new Map();

  constructor(public readonly entityManager: EntityManager) {
    super();

    const aiEntities = entityManager.getEntitiesByComponent("AIComponent");
    const playerEntity = entityManager.getEntitiesByComponent("PlayerComponent")[0];

    for (const enemyEntity of aiEntities) {
      const positionComponent = enemyEntity.getComponent<PositionComponent>("PositionComponent");
      const playerPositionComponent = playerEntity.getComponent<PositionComponent>("PositionComponent");

      if (playerPositionComponent && positionComponent) {
        const behaviorTree = this.createBehaviorTree(positionComponent.position, playerPositionComponent.position, enemyEntity, playerEntity);
        this.behaviorTrees.set(enemyEntity.name, behaviorTree);
      }
    }
  }

  preload() {
    // Add any setup or initialization code here
  }

  update(_: number, entityManager: EntityManager) {
    for (const behaviorTree of this.behaviorTrees.values()) {
      behaviorTree.tick(entityManager);
    }
  }

  render() {
    // Add any rendering-related code here (if necessary)
  }

  private createBehaviorTree(aiPosition: Vector2D, playerPosition: Vector2D, enemyEntity: Entity, playerEntity: Entity): BehaviorTree {
    const chasePlayerNode = new ChasePlayer(aiPosition, playerPosition, enemyEntity, playerEntity);

    const rootSelector = new SelectorNode([
      chasePlayerNode,
    ]);

    return new BehaviorTree(rootSelector);
  }
}