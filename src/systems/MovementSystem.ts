import { AnimationComponent } from "../components/AnimationComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class MovementSystem extends System {
  constructor() {
    super();
  }

  preload() { }

  update(_: number, entityManager: EntityManager) {
    const movementEntities = entityManager.getEntitiesByComponent(MovementComponent);
    for (const entity of movementEntities) {
      const movementComponent = entity.getComponent(MovementComponent);
      const positionComponent = entity.getComponent(PositionComponent);
      const collisionComponent = entity.getComponent(CollisionComponent);
      const animationComponent = entity.getComponent(AnimationComponent);
      const renderComponent = entity.getComponent(RenderComponent);
      const combatComponent = entity.getComponent(CombatComponent);

      // Calculate x and y movement separately
      let xMovement = movementComponent.direction.x * movementComponent.moveSpeed;
      let yMovement = movementComponent.direction.y * movementComponent.moveSpeed;

      // Check for X-axis collision
      if (xMovement !== 0) {
        let newX = positionComponent.position.x - xMovement;
        if (!collisionComponent.collisionDetails.right && xMovement < 0) {
          renderComponent.flipped = true;
          positionComponent.position.x = Math.floor(newX);
        } else if (!collisionComponent.collisionDetails.left && xMovement > 0) {
          renderComponent.flipped = false;
          positionComponent.position.x = Math.ceil(newX);
        }
      }

      // Check for Y-axis collision
      if (yMovement !== 0) {
        let newY = positionComponent.position.y + yMovement;
        if (!collisionComponent.collisionDetails.top && yMovement < 0) {
          positionComponent.position.y = Math.floor(newY);
        } else if (!collisionComponent.collisionDetails.bottom && yMovement > 0) {
          positionComponent.position.y = Math.ceil(newY);
        }
      }

      if (xMovement !== 0 && yMovement === 0) {
        animationComponent.playAnimation("run");
      } else if (yMovement !== 0) {
        if (yMovement < 0) {
          animationComponent.playAnimation("run-up");
        } else {
          animationComponent.playAnimation("run");
        }
      } else if (!combatComponent?.isAttacking) {
        if (movementComponent.prevDirection.y < 0) {
          animationComponent.playAnimation("idle-up");
        } else {
          if (animationComponent.currentAnimation !== 'idle-up') {
            animationComponent.playAnimation("idle");
          }
        }
      }

      movementComponent.prevDirection = { x: xMovement, y: yMovement };
    }
  }

  render() { /* */ }
}