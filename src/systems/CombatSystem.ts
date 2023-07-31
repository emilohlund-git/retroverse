import { AnimationComponent } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { InventoryComponent } from "../components/InventoryComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { System } from "./System";

export class CombatSystem extends System {
  private attackCooldownIntervals: Map<Entity, NodeJS.Timer> = new Map();

  constructor() {
    super();
  }

  preload() {
    // Load any combat-related assets if needed
  }

  update(deltaTime: number, entityManager: EntityManager) {
    const entitiesWithCombat = entityManager.getEntitiesByComponent("CombatComponent");

    for (const attacker of entitiesWithCombat) {
      const attackerCombat = attacker.getComponent<CombatComponent>("CombatComponent");
      if (!attackerCombat) continue;

      if (this.attackCooldownIntervals.has(attacker)) {
        continue; // Skip this attacker as they are still in the attack cooldown period
      }

      const attackerPosition = attacker.getComponent<PositionComponent>("PositionComponent")?.position;
      if (!attackerPosition) continue;
      const attackerAnimation = attacker.getComponent<AnimationComponent>("AnimationComponent");
      const attackerMovement = attacker.getComponent<MovementComponent>("MovementComponent");
      if (!attackerMovement) continue;

      if (!attackerCombat.isAttacking) continue;
      if (!attackerAnimation) continue;

      attackerCombat.attackCooldown = 10;
      this.startAttackCooldownInterval(attackerCombat, attacker);

      const closestTarget = this.calculateClosestTarget(
        entitiesWithCombat,
        attacker,
        attackerPosition,
        attackerCombat,
        attackerMovement
      );

      if (closestTarget) {
        // Perform the attack on the closest target.
        this.handleAttack(attacker, closestTarget, entityManager);
      }
    }
  }

  render() {
    // Implement any combat-related rendering logic if needed
  }

  private startAttackCooldownInterval(attackerCombat: CombatComponent, attacker: Entity): NodeJS.Timer {
    const interval = setInterval(() => {
      if (attackerCombat.attackCooldown > 0) {
        attackerCombat.attackCooldown--;
      } else {
        // Attack cooldown is over, reset attackInitiated and clear the interval
        attackerCombat.attackInitiated = false;
        attackerCombat.isAttacking = false;
        clearInterval(interval);
        this.attackCooldownIntervals.delete(attacker); // Remove the interval identifier from the map
      }
    }, 100);

    // Save the interval identifier in the map for this attacker
    this.attackCooldownIntervals.set(attacker, interval);

    return interval;
  }

  private calculateClosestTarget(
    entitiesWithCombat: Entity[],
    attacker: Entity,
    attackerPosition: Vector2D,
    attackerCombat: CombatComponent,
    attackerMovement: MovementComponent

  ): Entity | null {
    let closestTarget: Entity | null = null;
    let closestDistanceSq: number = Infinity;

    for (const potentialTarget of entitiesWithCombat) {
      if (potentialTarget === attacker) continue;

      const targetPosition = potentialTarget.getComponent<PositionComponent>("PositionComponent")?.position;
      if (!targetPosition) return null;

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
        const adjustedAngleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI;

        // TODO: Fix angles, currently the player can attack the enemy only from right
        const allowedAngleDifference = (Math.PI / 180) * 45;

        console.log("Adjusted Angle Difference: " + adjustedAngleDifference, "Allowed Angle Difference: " + allowedAngleDifference, "Angle Difference: " + angleDifference, "Angle To Target: " + angleToTarget);

        if (Math.abs(adjustedAngleDifference) >= allowedAngleDifference &&
          distanceSq < attackerCombat.attackRange ** 2 && distanceSq < closestDistanceSq) {
          closestTarget = potentialTarget;
          closestDistanceSq = distanceSq;
        }
      }
    }

    return closestTarget;
  }

  private handleAttack(attacker: Entity, target: Entity, entityManager: EntityManager) {
    const attackerCombat = attacker.getComponent<CombatComponent>("CombatComponent");
    const targetCombat = target.getComponent<CombatComponent>("CombatComponent");
    const targetAnimationComponent = target.getComponent<AnimationComponent>("AnimationComponent");
    const targetInventoryComponent = target.getComponent<InventoryComponent>("InventoryComponent");
    const targetPositionComponent = target.getComponent<PositionComponent>("PositionComponent");
    const world = entityManager.getEntityByName("world-inventory");
    const worldInventory = world?.getComponent<InventoryComponent>("InventoryComponent");

    if (!worldInventory) return;

    if (!attackerCombat || !targetCombat || !targetPositionComponent) return; // Make sure both entities have the CombatComponent.

    if (!targetCombat.isDead) targetCombat.isHurt = true;

    // Calculate damage based on attacker's attack power and target's defense.
    const damage = Math.max(attackerCombat.attackPower - targetCombat.defense, 0);

    targetCombat.health = targetCombat.health - damage;

    if (targetCombat.health <= 0) {
      if (!targetCombat.isDead) {
        targetCombat.isDead = true;

        if (targetInventoryComponent) {
          for (const item of targetInventoryComponent.items) {
            const randomXOffset = Math.random() * 10 - -10; // Generates a random number between -20 and +20
            const randomYOffset = Math.random() * 10; // Generates a random number between -20 and +20

            // Add the random offsets to the target position to get the dropped position
            item.dropPosition = new Vector2D(
              targetPositionComponent.position.x + randomXOffset,
              targetPositionComponent.position.y - randomYOffset
            );

            item.isDropped = true;
            worldInventory.addItem(item);
          }

          if (targetAnimationComponent) {
            targetAnimationComponent.currentFrameIndex = 0;
            targetAnimationComponent.playAnimation("death");
          }

          target.removeComponent("InventoryComponent");
          target.removeComponent("AIComponent");
          target.removeComponent("MovementComponent");
          target.removeComponent("CombatComponent");
        }
      }
    }
  }
}
