import { AIComponent } from "../components/AIComponent";
import { CollisionComponent, CollisionDetails } from "../components/CollisionComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { clamp } from "../utils/math";
import { BehaviorNode, BehaviorStatus } from "./BehaviorTree";

export class ChasePlayer implements BehaviorNode {
  aiPosition: Vector2D;
  playerPosition: Vector2D;
  enemyEntity: Entity;
  playerEntity: Entity;

  constructor(aiPosition: Vector2D, playerPosition: Vector2D, enemyEntity: Entity, playerEntity: Entity) {
    this.aiPosition = aiPosition;
    this.playerPosition = playerPosition;
    this.enemyEntity = enemyEntity;
    this.playerEntity = playerEntity;
  }

  tick(entityManager: EntityManager): BehaviorStatus {
    if (!this.playerEntity) {
      return 'FAILURE';
    }

    const playerPositionComponent = this.playerEntity.getComponent<PositionComponent>("PositionComponent");
    if (!playerPositionComponent) return "FAILURE";
    const playerCombatComponent = this.playerEntity.getComponent<CombatComponent>("CombatComponent");
    if (!playerCombatComponent) return "FAILURE";
    const aiComponent = this.enemyEntity.getComponent<AIComponent>("AIComponent");
    if (!aiComponent) return "FAILURE";
    const positionComponent = this.enemyEntity.getComponent<PositionComponent>("PositionComponent");
    if (!positionComponent) return 'FAILURE';
    const movementComponent = this.enemyEntity.getComponent<MovementComponent>("MovementComponent");
    if (!movementComponent) return "FAILURE";
    const combatComponent = this.enemyEntity.getComponent<CombatComponent>("CombatComponent");
    if (!combatComponent) return "FAILURE";

    const directionX = playerPositionComponent.position.x - positionComponent.position.x;
    const directionY = playerPositionComponent.position.y - positionComponent.position.y;

    const distanceToPlayer = Math.sqrt(directionX * directionX + directionY * directionY);

    if (distanceToPlayer <= aiComponent.aggroRange && this.hasLineOfSight(entityManager, positionComponent, playerPositionComponent, aiComponent) &&
      !playerCombatComponent.isDead) {
      if (distanceToPlayer < 10) {
        aiComponent.isChasing = false;
        if (combatComponent.attackCooldown < 1) {
          combatComponent.isAttacking = true;
        }
        movementComponent.direction.x = 0;
        movementComponent.direction.y = 0;
        return 'SUCCESS';
      } else {
        aiComponent.isChasing = true;
        combatComponent.attackInitiated = false;
        combatComponent.isAttacking = false;
        // Normalize the direction vector to maintain equal speed in all directions
        movementComponent.direction.x = clamp(-directionX, -1, 1);
        movementComponent.direction.y = clamp(directionY, -1, 1);
      }
    } else {
      aiComponent.isChasing = false;
      combatComponent.attackInitiated = false;
      combatComponent.isAttacking = false;
      movementComponent.direction.x = 0;
      movementComponent.direction.y = 0;
      return 'SUCCESS';
    }
    return 'RUNNING';
  }

  private hasLineOfSight(entityManager: EntityManager, entityPosition: PositionComponent, playerPosition: PositionComponent, aiComponent: AIComponent): boolean {
    const obstacles = entityManager.getEntitiesByComponents(["SolidComponent", "CollisionComponent"]);

    const directionX = playerPosition.position.x - entityPosition.position.x;
    const directionY = playerPosition.position.y - entityPosition.position.y;
    const distanceToPlayer = Math.sqrt(directionX * directionX + directionY * directionY);

    const normalizedDirectionX = directionX / distanceToPlayer;
    const normalizedDirectionY = directionY / distanceToPlayer;

    const numIntervals = 80;

    for (let i = 1; i <= numIntervals; i++) {
      const intervalFactor = i / numIntervals;
      const stepX = entityPosition.position.x + intervalFactor * normalizedDirectionX * distanceToPlayer;
      const stepY = entityPosition.position.y + intervalFactor * normalizedDirectionY * distanceToPlayer;

      for (const obstacleEntity of obstacles) {
        const obstaclePosition = obstacleEntity.getComponent<PositionComponent>("PositionComponent");
        const collisionComponent = obstacleEntity.getComponent<CollisionComponent>("CollisionComponent");
        if (!collisionComponent || !obstaclePosition) continue;

        if (this.isObstacleBetweenPoints(entityPosition.position, { x: stepX, y: stepY }, obstaclePosition.position, collisionComponent.collisionDetails)) {
          aiComponent.hasLineOfSight = false;
          return false;
        }
      }
    }

    aiComponent.hasLineOfSight = true;
    return true;
  }

  private isObstacleBetweenPoints(startPoint: { x: number, y: number }, endPoint: { x: number, y: number }, obstaclePosition: { x: number, y: number }, collisionDetails: CollisionDetails): boolean {
    const obstacleTopLeft = { x: obstaclePosition.x, y: obstaclePosition.y };
    const obstacleBottomRight = {
      x: obstaclePosition.x + (collisionDetails.right ? 1 : 0),
      y: obstaclePosition.y + (collisionDetails.bottom ? 1 : 0),
    };

    if (
      (startPoint.x >= obstacleTopLeft.x && startPoint.x <= obstacleBottomRight.x) ||
      (endPoint.x >= obstacleTopLeft.x && endPoint.x <= obstacleBottomRight.x)
    ) {
      if (
        (startPoint.y >= obstacleTopLeft.y && startPoint.y <= obstacleBottomRight.y) ||
        (endPoint.y >= obstacleTopLeft.y && endPoint.y <= obstacleBottomRight.y)
      ) {
        return true;
      }
    }

    return false;
  }
}