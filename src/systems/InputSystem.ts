import { AnimationComponent } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { InteractableComponent } from "../components/InteractableComponent";
import { InventoryComponent } from "../components/InventoryComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { Vector2D } from "../utils/Vector2D";
import { calculateDistance } from "../utils/math";
import { System } from "./System";

export class InputSystem extends System {
  private pressedKeys: Set<string> = new Set();

  constructor() {
    super();

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('blur', this.handleBlur.bind(this));
  }

  preload() { }

  update(deltaTime: number, entityManager: EntityManager) {
    const interactableEntities = entityManager.getEntitiesByComponent("InteractableComponent");
    const player = entityManager.getEntitiesByComponent("PlayerComponent")[0];
    const movementComponent = player.getComponent<MovementComponent>("MovementComponent");
    if (!movementComponent) return;
    const combatComponent = player.getComponent<CombatComponent>("CombatComponent");
    if (!combatComponent) return;
    const animationComponent = player.getComponent<AnimationComponent>("AnimationComponent");
    if (!animationComponent) return;
    const positionComponent = player.getComponent<PositionComponent>("PositionComponent");
    if (!positionComponent) return;
    const inventoryComponent = player.getComponent<InventoryComponent>("InventoryComponent");

    if (!player) throw new Error('No player entity assigned.');
    if (!movementComponent) throw new Error('Player has no movement component.');

    let xDirection = 0;
    let yDirection = 0;

    if (!combatComponent.isAttacking) {
      if (this.pressedKeys.has('A')) {
        xDirection = 1
      }
      if (this.pressedKeys.has('D')) {
        xDirection = -1;
      }
      if (this.pressedKeys.has('S')) {
        yDirection = 1;
      }
      if (this.pressedKeys.has('W')) {
        yDirection = -1;
      }
    }

    // Checking for inventory & possible world interactions
    if (inventoryComponent) {
      if (this.pressedKeys.has("E")) {
        this.checkInteractions(interactableEntities, positionComponent.position);
        inventoryComponent.pickingUp = true;
      } else {
        inventoryComponent.pickingUp = false;
      }
    }

    if (combatComponent) {
      if (this.pressedKeys.has(' ') && !combatComponent.attackInitiated && combatComponent.attackCooldown < 1) {
        animationComponent.currentFrameIndex = 0;
        combatComponent.attackInitiated = true;
        combatComponent.isAttacking = true;
      } else if (!this.pressedKeys.has(" ")) {
        combatComponent.attackInitiated = false;
      }
    }

    movementComponent.direction.x = xDirection;
    movementComponent.direction.y = yDirection;
  }

  render() { }

  private handleKeyDown(e: KeyboardEvent) {
    this.pressedKeys.add(e.key.toUpperCase());
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.pressedKeys.delete(e.key.toUpperCase());
  }

  private handleBlur() {
    this.pressedKeys.clear();
  }

  private checkInteractions(interactableEntities: Entity[], playerPosition: Vector2D) {
    interactableEntities.forEach((i) => {
      const interactablePosition = i.getComponent<PositionComponent>("PositionComponent")?.position;
      const solidComponent = i.getComponent<SolidComponent>("SolidComponent");
      const interactableComponent = i.getComponent<InteractableComponent>("InteractableComponent");
      if (interactablePosition && solidComponent && interactableComponent && !interactableComponent.interacting) {
        if (calculateDistance(playerPosition, interactablePosition) <= 15) {
          interactableComponent.interacting = true;
        }
      }
    });
  }
}