import { InteractableComponent } from "../components/InteractableComponent";
import { InventoryComponent } from "../components/InventoryComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { System } from "./System";

export class InteractionSystem extends System {
  constructor() {
    super();
  }

  preload() {
    // Load any assets or setup needed for interactions
  }

  update(deltaTime: number, entityManager: EntityManager) {
    const player = entityManager.getEntityByName("player");
    if (!player) throw new Error("Player not instantiated.");
    const playerInventory = player.getComponent<InventoryComponent>("InventoryComponent");
    if (!playerInventory) return;

    const interactableEntities = entityManager.getEntitiesByComponent("InteractableComponent");

    for (const entity of interactableEntities) {
      const interactableComponent = entity.getComponent<InteractableComponent>("InteractableComponent");
      if (!interactableComponent) continue;

      if (interactableComponent.interacting) {
        if (this.areConditionsSatisfied(entity, interactableComponent, playerInventory)) {
          interactableComponent.interactionAction(playerInventory, interactableComponent, entity);
          interactableComponent.interacting = false;
        }
      }
    }
  }

  render() {
    // Implement any rendering related to interactions if needed
  }

  private areConditionsSatisfied(interactableEntity: Entity, interactable: InteractableComponent, inventory: InventoryComponent): boolean {
    for (const condition of interactable.conditions) {
      if (condition.hasItem) {
        if (!interactable.interactionItemName) continue;

        const conditionSatisfied = condition.hasItem(inventory, interactable.interactionItemName);

        if (!conditionSatisfied) {
          return false;
        }
      }
    }

    return true;
  }
}
