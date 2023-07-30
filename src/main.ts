import { Game } from "./Game";
import { CollisionType } from "./components/CollisionComponent";
import { EntityManager } from "./entities/EntityManager";
import { createEnemyEntity } from "./entities/enemyEntity";
import { createPlayerEntity } from "./entities/playerEntity";
import { levelOne } from "./levels/level";
import { AISystem } from "./systems/AISystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { CombatSystem } from "./systems/CombatSystem";
import { InputSystem } from "./systems/InputSystem";
import { LevelSystem } from "./systems/LevelSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { EntityFactory } from "./utils/EntityFactory";
import { SpriteSheetParser } from "./utils/SpriteSheetParser";
import { Vector2D } from "./utils/Vector2D";
import { LEVEL_HEIGHT, LEVEL_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "./utils/constants";

SpriteSheetParser.extractSprites("dungeon-tiles", "floor-tiles", 8, 8, 56, 16, './assets/tiles/MiniFantasy_DungeonFloorTiles.png');
SpriteSheetParser.extractSprites("dungeon-tiles", "wall-tiles", 8, 8, 56, 112, './assets/tiles/MiniFantasy_DungeonWallTiles.png');

const entityManager = new EntityManager();
const levelSystem = new LevelSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
const renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
const inputSystem = new InputSystem();
const movementSystem = new MovementSystem();
const collisionSystem = new CollisionSystem();
const animationSystem = new AnimationSystem();
const combatSystem = new CombatSystem();

createPlayerEntity(entityManager);

for (let i = 1; i < 2; i++) {
  createEnemyEntity(entityManager, `enemy${i}`, i / 2, i);
}

function createEntitiesFromLevelArray(levelData: any[][], spriteSheets: string[], entityManager: EntityManager) {
  const entitiesToAdd = [];

  for (let i = 0; i < levelData.length; i++) {
    for (let j = 0; j < levelData[i].length; j++) {
      const [spriteSheetIndex, spriteRow, spriteColumn] = levelData[i][j];
      const spriteSheet = spriteSheets[spriteSheetIndex];

      const tileEntity = EntityFactory.create()
        .position(new Vector2D(i * 8, j * 8))
        .size(8, 8)
        .layer(0)
        .solid(SpriteSheetParser.getSprite("dungeon-tiles", spriteSheet, spriteRow, spriteColumn)!)
        .tiled(true)

      if (spriteSheet.includes("wall")) {
        tileEntity.collision(CollisionType.BOX, i === 0 ? -11 : 11, j === 0 ? -11 : 11)
      }

      entitiesToAdd.push(tileEntity.build());
    }
  }

  entityManager.addEntities(entitiesToAdd);
}

createEntitiesFromLevelArray(levelOne.data, levelOne.spriteSheets, entityManager);

const aiSystem = new AISystem(entityManager);

const game = new Game(entityManager);
game.addSystems([
  animationSystem, inputSystem, movementSystem, levelSystem, renderSystem, collisionSystem,
  aiSystem, combatSystem
]);

game.run();