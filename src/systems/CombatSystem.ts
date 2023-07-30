import { AnimationComponent } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class CombatSystem extends System {
  constructor() {
    super();
  }

  preload() {
    // Load any combat-related assets if needed
  }

  update(deltaTime: number, entityManager: EntityManager) {
    const entitiesWithCombat = entityManager.getEntitiesByComponent(CombatComponent);

    for (const attacker of entitiesWithCombat) {
      const attackerCombat = attacker.getComponent(CombatComponent);
      const attackerPosition = attacker.getComponent(PositionComponent).position;
      const attackerAnimation = attacker.getComponent(AnimationComponent);
      const attackerMovement = attacker.getComponent(MovementComponent);

      if (!attackerCombat || !attackerCombat.isAttacking || !attackerAnimation) {
        continue; // Skip entities that are not attacking or don't have the necessary components
      }

      let closestTarget: Entity | null = null;
      let closestDistanceSq: number = Infinity;

      for (const potentialTarget of entitiesWithCombat) {
        if (potentialTarget === attacker) continue; // Skip the attacker itself.

        const targetPosition = potentialTarget.getComponent(PositionComponent).position;

        // Correct the distanceSq calculation using squared differences in x and y coordinates
        const diffX = targetPosition.x - attackerPosition.x;
        const diffY = targetPosition.y - attackerPosition.y;
        const distanceSq = diffX * diffX + diffY * diffY;

        // Check if the entity is within the attack range and closer than the current closest target.
        if (distanceSq < attackerCombat.attackRange ** 2 && distanceSq < closestDistanceSq) {
          // Calculate the angle between the attacker and the potential target
          const angleToTarget = Math.atan2(targetPosition.y - attackerPosition.y, targetPosition.x - attackerPosition.x);

          // Calculate the angle difference between the attacker's facing direction and the angle to the target
          const angleDifference = angleToTarget - attackerMovement.currentFacingAngle;

          // Adjust the range of angleDifference to be between -Math.PI and Math.PI
          const adjustedAngleDifference = (angleDifference + Math.PI) % (2 * Math.PI) - Math.PI;

          // TODO: Fix angles, currently the player can attack the enemy only from right
          // Allow a small margin of error (10 degrees) to account for imprecise facing direction
          if (Math.abs(adjustedAngleDifference) >= (Math.PI / 180) * 20 &&
            ((attackerMovement.currentFacingAngle >= 0 && diffX > 0) ||
              (attackerMovement.currentFacingAngle > 0 && diffX > 0))) {
            closestTarget = potentialTarget;
            closestDistanceSq = distanceSq;
          }
        }
      }

      if (closestTarget) {
        // Perform the attack on the closest target.
        this.handleAttack(attacker, closestTarget);
      }
    }
  }

  render() {
    // Implement any combat-related rendering logic if needed
  }

  private handleAttack(attacker: Entity, target: Entity) {
    const attackerCombat = attacker.getComponent(CombatComponent);
    const targetCombat = target.getComponent(CombatComponent);
    const targetAnimationComponent = target.getComponent(AnimationComponent);

    if (!attackerCombat || !targetCombat) return; // Make sure both entities have the CombatComponent.

    if (!targetCombat.isDead) targetCombat.isHurt = true;

    // Calculate damage based on attacker's attack power and target's defense.
    const damage = Math.max(attackerCombat.attackPower - targetCombat.defense, 0);

    targetCombat.health = targetCombat.health - damage;

    if (targetCombat.health <= 0) {
      if (!targetCombat.isDead) {
        targetCombat.isDead = true;
        targetAnimationComponent.currentFrameIndex = 0;
        targetAnimationComponent.playAnimation("death");
      }
    }
  }
}
