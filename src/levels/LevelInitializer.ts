import { CollisionType } from "../components/CollisionComponent";
import { InteractableComponent, InteractionConditions } from "../components/InteractableComponent";
import { InventoryComponent } from "../components/InventoryComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { SpriteSheetParser } from "../sprites/SpriteSheetParser";
import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";

export class LevelInitializer {
  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  async createEntitiesFromLevelArray(levelData: any[][], spriteSheets: string[]): Promise<void> {
    const entitiesToAdd: Entity[] = [];

    for (let i = 0; i < levelData.length; i++) {
      for (let j = 0; j < levelData[i].length; j++) {
        const [interactable, layer, hasCollision, spriteSheetIndex, spriteRow, spriteColumn] = levelData[i][j];
        const spriteSheet = spriteSheets[spriteSheetIndex];
        const spriteData = SpriteSheetParser.getSprite("dungeon-tiles", spriteSheet, spriteRow, spriteColumn);

        if (spriteData) {
          const tileEntity = this.createTileEntity(i, j, spriteData, layer, hasCollision);
          if (interactable === 1) {
            this.addInteractableComponent(tileEntity, "Key");
          }

          entitiesToAdd.push(tileEntity.build());
        }
      }
    }

    this.entityManager.addEntities(entitiesToAdd);
  }

  private createTileEntity(i: number, j: number, spriteData: any, layer: number, hasCollision: number): EntityFactory {
    const tileEntity = EntityFactory.create()
      .position(new Vector2D(i * 8, j * 8))
      .size(8, 8)
      .layer(layer)
      .solid(spriteData)
      .tiled(true);

    if (hasCollision === 1) {
      tileEntity.collision(CollisionType.BOX, -2, -2, 0, 0);
    }

    return tileEntity;
  }

  private addInteractableComponent(entityFactory: EntityFactory, interactionItemName: string): void {
    const interactionAction = (inventory: InventoryComponent, interactable: InteractableComponent, interactableEntity: Entity) => {
      const itemToRemove = inventory.items.find((i) => i.name === interactable.interactionItemName);
      if (itemToRemove && interactable.interactionItemName) {
        inventory.removeItem(itemToRemove);
      }

      const solidComponent = interactableEntity.getComponent<SolidComponent>("SolidComponent");
      if (!solidComponent) return;
      solidComponent.spriteData.y += solidComponent.spriteData.height;

      interactableEntity.removeComponent("CollisionComponent");
    };

    const conditions: InteractionConditions[] = [{
      hasItem(inventory, item) { return inventory.items.findIndex((i) => i.name === item) !== -1 },
    }];

    entityFactory.interactable(conditions, interactionAction, interactionItemName);
  }
}
