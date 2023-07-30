import { AnimationComponent } from "../components/AnimationComponent";
import { CombatComponent } from "../components/CombatCompontent";
import { InventoryComponent } from "../components/InventoryComponent";
import { MovementComponent } from "../components/MovementComponent";
import { EntityManager } from "../entities/EntityManager";
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
    const player = entityManager.getEntitiesByComponent("PlayerComponent")[0];
    const movementComponent = player.getComponent<MovementComponent>("MovementComponent");
    if (!movementComponent) return;
    const combatComponent = player.getComponent<CombatComponent>("CombatComponent");
    if (!combatComponent) return;
    const animationComponent = player.getComponent<AnimationComponent>("AnimationComponent");
    if (!animationComponent) return;
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

    if (inventoryComponent) {
      if (this.pressedKeys.has("E")) {
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
}