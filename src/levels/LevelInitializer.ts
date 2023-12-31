import { CollisionType } from "../components/CollisionComponent";
import { InteractionConditions, OpenDoorAction } from "../components/InteractableComponent";
import { SolidComponent } from "../components/SolidComponent";
import { Entity } from "../entities/Entity";
import { EntityManager } from "../entities/EntityManager";
import { EntityFactory } from "../utils/EntityFactory";
import { SpriteData, SpriteSheetParser } from "../utils/SpriteSheetParser";
import { Vector2D } from "../utils/Vector2D";

export type TileData = [number, number, number, number, number, number];

export class LevelInitializer {
  private entityManager: EntityManager;
  private tileWidth: number = 8;
  private tileHeight: number = 8;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  async createEntitiesFromLevelArray(levelData: TileData[][], spriteSheets: string[]): Promise<void> {
    const entitiesToAdd: Entity[] = [];

    for (let i = 0; i < levelData.length; i++) {
      for (let j = 0; j < levelData[i].length; j++) {
        const [interactable, layer, hasCollision, spriteSheetIndex, spriteRow, spriteColumn] = levelData[i][j];
        const spriteSheet = spriteSheets[spriteSheetIndex];
        const spriteData = await SpriteSheetParser.getSprite("dungeon-tiles", spriteSheet, spriteRow, spriteColumn);

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

  private createTileEntity(i: number, j: number, spriteData: SpriteData, layer: number, hasCollision: number): EntityFactory {
    const tileEntity = EntityFactory.create()
      .position(new Vector2D(i * this.tileWidth, j * this.tileHeight))
      .size(this.tileWidth, this.tileHeight)
      .layer(layer)
      .solid(spriteData)
      .tiled(true);

    if (hasCollision === 1) {
      tileEntity.collision(CollisionType.BOX, -2, -2, 0, 0);
    }

    return tileEntity;
  }

  private addInteractableComponent(entityFactory: EntityFactory, interactionItemName: string): void {
    const interactionAction = (args: OpenDoorAction) => {
      const { inventory, interactable, interactableEntity } = args;
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
