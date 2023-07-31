import { Game } from "./Game";
import { CollisionType } from "./components/CollisionComponent";
import { InteractionConditions } from "./components/InteractableComponent";
import { EntityManager } from "./entities/EntityManager";
import { createEnemyEntity } from "./entities/enemyEntity";
import { createPlayerEntity } from "./entities/playerEntity";
import { levelOne } from "./levels/level";
import { torch, torch2 } from "./sprites/props";
import { AISystem } from "./systems/AISystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { CombatSystem } from "./systems/CombatSystem";
import { InputSystem } from "./systems/InputSystem";
import { InventorySystem } from "./systems/InventorySystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { EntityFactory } from "./utils/EntityFactory";
import { SpriteSheetParser } from "./utils/SpriteSheetParser";
import { Vector2D } from "./utils/Vector2D";
import { LEVEL_HEIGHT, LEVEL_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "./utils/constants";

// Load all the sprites
SpriteSheetParser.extractSprites("dungeon-tiles", "floor-tiles", 8, 8, 56, 16, './assets/tiles/MiniFantasy_DungeonFloorTiles.png');
SpriteSheetParser.extractSprites("dungeon-tiles", "wall-tiles", 8, 8, 56, 112, './assets/tiles/MiniFantasy_DungeonWallTiles.png');
SpriteSheetParser.extractSprites("dungeon-tiles", "door-tiles", 8, 8, 8, 16, './assets/tiles/Minifantasy_DungeonDoorTiles.png');

const entityManager = new EntityManager();
const renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
const inputSystem = new InputSystem();
const movementSystem = new MovementSystem();
const collisionSystem = new CollisionSystem();
const animationSystem = new AnimationSystem();
const combatSystem = new CombatSystem();
const inventorySystem = new InventorySystem();

createPlayerEntity(entityManager);

for (let i = 1; i < 2; i++) {
  createEnemyEntity(entityManager, `enemy${i}`, 110, 10);
}

const worldInventory = EntityFactory.create()
  .name("world-inventory")
  .position(new Vector2D(0, 0))
  .inventory(200)
  .build();

entityManager.addEntity(worldInventory);

function createEntitiesFromLevelArray(levelData: any[][], spriteSheets: string[], entityManager: EntityManager) {
  const entitiesToAdd = [];

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      const [interactable, layer, hasCollision, spriteSheetIndex, spriteRow, spriteColumn] = levelData[i][j];
      const spriteSheet = spriteSheets[spriteSheetIndex];

      const spriteData = SpriteSheetParser.getSprite("dungeon-tiles", spriteSheet, spriteRow, spriteColumn)!;

      const tileEntity = EntityFactory.create()
        .position(new Vector2D(i * 8, j * 8))
        .size(8, 8)
        .layer(layer)
        .solid(spriteData)
        .tiled(true)

      if (hasCollision === 1) {
        tileEntity.collision(CollisionType.BOX, -2, -2, 0, 0)
      }

      if (interactable === 1) {
        const conditions: InteractionConditions[] = [{
          hasItem(inventory, item) { return inventory.items.findIndex((i) => i.name === item) !== -1 },
        }]
        tileEntity.interactable(conditions);
      }

      entitiesToAdd.push(tileEntity.build());
    }
  }

  entityManager.addEntities(entitiesToAdd);
}

entityManager.addEntities([torch, torch2]);

createEntitiesFromLevelArray(levelOne.data, levelOne.spriteSheets, entityManager);

const aiSystem = new AISystem(entityManager);

const game = new Game(entityManager);

game.addSystems([
  animationSystem, inputSystem, movementSystem, renderSystem, inventorySystem, collisionSystem,
  aiSystem, combatSystem
]);

game.run();