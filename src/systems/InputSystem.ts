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
  private keys: { [key: string]: boolean } = {};

  constructor() {
    super();

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
    window.addEventListener("blur", this.handleBlur.bind(this));
  }

  preload() { }

  update(deltaTime: number, entityManager: EntityManager) {
    const interactableEntities = entityManager.getEntitiesByComponent("InteractableComponent");
    const player = entityManager.getEntitiesByComponent("PlayerComponent")[0];
    if (!player) return;
    const movementComponent = player.getComponent<MovementComponent>("MovementComponent");
    const combatComponent = player.getComponent<CombatComponent>("CombatComponent");
    const animationComponent = player.getComponent<AnimationComponent>("AnimationComponent");
    const positionComponent = player.getComponent<PositionComponent>("PositionComponent");
    const inventoryComponent = player.getComponent<InventoryComponent>("InventoryComponent");

    if (!movementComponent || !combatComponent || !animationComponent || !positionComponent) return;

    const { keys } = this;
    const isAttacking = keys[" "];
    const isMovingLeft = keys["A"] || keys["ArrowLeft"];
    const isMovingRight = keys["D"] || keys["ArrowRight"];
    const isMovingUp = keys["W"] || keys["ArrowUp"];
    const isMovingDown = keys["S"] || keys["ArrowDown"];

    // Handle movement
    const xDirection = (isMovingLeft ? -1 : 0) + (isMovingRight ? 1 : 0);
    const yDirection = (isMovingUp ? -1 : 0) + (isMovingDown ? 1 : 0);

    // Checking for inventory & possible world interactions
    if (inventoryComponent) {
      inventoryComponent.pickingUp = keys["E"];
      if (keys["E"]) {
        this.checkInteractions(interactableEntities, positionComponent.position);
      }
    }

    // Handle combat
    if (!combatComponent.isAttacking) {
      if (isAttacking && combatComponent.attackCooldown < 1) {
        animationComponent.currentFrameIndex = 0;
        combatComponent.isAttacking = true;
      }
    } else if (!isAttacking) {
      combatComponent.isAttacking = false;
    }

    // Set movement direction
    movementComponent.direction.x = -xDirection;
    movementComponent.direction.y = yDirection;
  }

  render() { }

  private handleKeyDown(e: KeyboardEvent) {
    this.keys[e.key.toUpperCase()] = true;
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keys[e.key.toUpperCase()] = false;
  }

  private handleBlur() {
    this.keys = {};
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
