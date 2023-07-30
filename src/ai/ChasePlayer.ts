import { AIComponent } from "../components/AIComponent";
import { CollisionComponent, CollisionDetails } from "../components/CollisionComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidComponent } from "../components/SolidComponent";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { clamp } from "../utils/math";
import { BehaviorNode, BehaviorStatus } from "./BehaviorTree";

export class ChasePlayer implements BehaviorNode {
  aiPosition: Vector2D;
  playerPosition: Vector2D;

  constructor(aiPosition: Vector2D, playerPosition: Vector2D) {
    this.aiPosition = aiPosition;
    this.playerPosition = playerPosition;
  }

  tick(entityManager: EntityManager): BehaviorStatus {
    const enemyEntities = entityManager.getEntitiesByComponent(AIComponent);
    const playerEntity = entityManager.getEntityByName('player');
    if (!playerEntity) {
      return 'FAILURE';
    }

    const playerPositionComponent = playerEntity.getComponent(PositionComponent);
    const playerCombatComponent = playerEntity.getComponent(CombatComponent);

    for (const enemyEntity of enemyEntities) {
      const aiComponent = enemyEntity.getComponent(AIComponent);
      const positionComponent = enemyEntity.getComponent(PositionComponent);
      const movementComponent = enemyEntity.getComponent(MovementComponent);
      const combatComponent = enemyEntity.getComponent(CombatComponent);

      const directionX = playerPositionComponent.position.x - positionComponent.position.x;
      const directionY = playerPositionComponent.position.y - positionComponent.position.y;

      const distanceToPlayer = Math.sqrt(directionX * directionX + directionY * directionY);

      if (distanceToPlayer <= aiComponent.aggroRange && this.hasLineOfSight(entityManager, positionComponent, playerPositionComponent, aiComponent) &&
        !playerCombatComponent.isDead) {
        if (distanceToPlayer < 10) {
          aiComponent.isChasing = false;
          combatComponent.isAttacking = true;
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
    }
    return 'RUNNING';
  }

  private hasLineOfSight(entityManager: EntityManager, entityPosition: PositionComponent, playerPosition: PositionComponent, aiComponent: AIComponent): boolean {
    const obstacles = entityManager.getEntitiesByComponents([SolidComponent, CollisionComponent]);

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
        const obstaclePosition = obstacleEntity.getComponent(PositionComponent);
        const collisionComponent = obstacleEntity.getComponent(CollisionComponent);
        if (!collisionComponent) continue;

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