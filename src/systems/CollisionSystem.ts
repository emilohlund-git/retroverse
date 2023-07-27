import { CollisionComponent, CollisionType } from "../components/CollisionComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { RenderComponent } from "../components/RenderComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class CollisionSystem extends System {
  constructor() {
    super();
  }

  preload() { }

  update(deltaTime: number, entityManager: EntityManager) {
    const solidEntities = entityManager.getEntitiesByComponent(SolidComponent);
    const collisionEntities = entityManager.getEntitiesByComponent(MovementComponent);
    if (!collisionEntities) return;

    for (const entity of collisionEntities) {
      const collisionComponent = entity.getComponent(CollisionComponent);
      const shapeA = collisionComponent.collisionType;

      if (shapeA === CollisionType.BOX) this.handleBoxCollision(entity, solidEntities);
      if (shapeA === CollisionType.CIRCLE) this.handleCircleCollision();
    }
  }

  render() { }

  private handleBoxCollision(entity: Entity, collisionEntities: Entity[]) {
    const collisionComponent = entity.getComponent(CollisionComponent);

    collisionComponent.collisionDetails = {
      top: false,
      left: false,
      right: false,
      bottom: false,
    };

    for (const otherEntity of collisionEntities) {
      if (otherEntity === entity) continue;
      const otherCollisionComponent = otherEntity.getComponent(CollisionComponent);
      const shapeB = otherCollisionComponent.collisionType;

      if (shapeB === CollisionType.BOX) {
        this.checkSATCollision(entity, otherEntity);
      } else if (shapeB === CollisionType.CIRCLE) {
        // Implement circle vs. box collision (Optional)
      }
    }
  }

  private handleCircleCollision() {
    // TODO: Implement circle collision
  }

  private checkAABBIntersection(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  private checkCircleIntersection(x1: number, y1: number, radius1: number, x2: number, y2: number, radius2: number): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distanceSquared = dx * dx + dy * dy;
    const radiusSum = radius1 + radius2;
    return distanceSquared < radiusSum * radiusSum;
  }

  private checkSATCollision(entityA: Entity, entityB: Entity): boolean {
    // Get collision components and position components for both entities
    const collisionComponentA = entityA.getComponent(CollisionComponent);
    const collisionComponentB = entityB.getComponent(CollisionComponent);
    const positionComponentA = entityA.getComponent(PositionComponent);
    const positionComponentB = entityB.getComponent(PositionComponent);

    // Get dimensions and positions for both entities
    const { width: widthA, height: heightA } = entityA.getComponent(RenderComponent);
    const { width: widthB, height: heightB } = entityB.getComponent(RenderComponent);
    const { x: xA, y: yA } = positionComponentA.position;
    const { x: xB, y: yB } = positionComponentB.position;

    // Calculate half-width and half-height for both entities
    const halfWidthA = widthA * 0.5;
    const halfHeightA = heightA * 0.5;
    const halfWidthB = widthB * 0.5;
    const halfHeightB = heightB * 0.5;

    // Calculate centers of both entities
    const centerA = { x: xA + halfWidthA, y: yA + halfHeightA };
    const centerB = { x: xB + halfWidthB, y: yB + halfHeightB };

    // Calculate the differences in x and y between centers
    const dx = centerA.x - centerB.x;
    const dy = centerA.y - centerB.y;
    const overlapX = halfWidthA + halfWidthB - Math.abs(dx);
    const overlapY = halfHeightA + halfHeightB - Math.abs(dy);

    // Check for collision on both axes (X and Y)
    if (overlapX > 0 && overlapY > 0) {
      // There is a collision
      // Determine the axis of minimum penetration (smallest overlap) to resolve the collision
      if (overlapX < overlapY) {
        // Colliding horizontally
        // Resolve collision by adjusting the position on the X-axis
        if (dx < 0) {
          collisionComponentA.collisionDetails.right = true;
          collisionComponentB.collisionDetails.left = true;
        } else {
          collisionComponentA.collisionDetails.left = true;
          collisionComponentB.collisionDetails.right = true;
        }
      } else {
        // Colliding vertically
        // Resolve collision by adjusting the position on the Y-axis
        if (dy < 0) {
          collisionComponentA.collisionDetails.bottom = true;
          collisionComponentB.collisionDetails.top = true;
        } else {
          collisionComponentA.collisionDetails.top = true;
          collisionComponentB.collisionDetails.bottom = true;
        }
      }

      return true; // Colliding
    }

    return false; // Not colliding
  }
}