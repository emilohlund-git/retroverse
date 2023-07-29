import { Game } from "./Game";
import { CollisionType } from "./components/CollisionComponent";
import { EntityManager } from "./entities/EntityManager";
import { createEnemyEntity } from "./entities/enemyEntity";
import { createPlayerEntity } from "./entities/playerEntity";
import { AISystem } from "./systems/AISystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { CombatSystem } from "./systems/CombatSystem";
import { InputSystem } from "./systems/InputSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { EntityFactory } from "./utils/EntityFactory";
import { SpriteSheetParser } from "./utils/SpriteSheetParser";
import { Vector2D } from "./utils/Vector2D";
import { LEVEL_HEIGHT, LEVEL_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "./utils/constants";

SpriteSheetParser.extractSprites("floor-tile", "dungeon-floor-tiles", 8, 8, 56, 16, './assets/tiles/MiniFantasy_DungeonFloorTiles.png');
SpriteSheetParser.extractSprites("wall-tiles", "dungeon-wall-tiles", 8, 8, 56, 112, './assets/tiles/MiniFantasy_DungeonWallTiles.png');

const entityManager = new EntityManager();
const renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
const inputSystem = new InputSystem();
const movementSystem = new MovementSystem();
const collisionSystem = new CollisionSystem();
const animationSystem = new AnimationSystem();
const combatSystem = new CombatSystem();

createPlayerEntity(entityManager);
createEnemyEntity(entityManager);

console.log(SpriteSheetParser.getSpriteSheet("wall-tiles", "dungeon-wall-tiles"));

for (let i = 0; i < 400; i += 8) {
  for (let j = 0; j < 400; j += 8) {
    const tile = EntityFactory.create()
      .position(new Vector2D(i, j))
      .size(8, 8)
      .solid(SpriteSheetParser.getSprite("floor-tile", "dungeon-floor-tiles", 0, 0)!)
      .tiled(true)
      .build();
    entityManager.addEntity(tile);
  }
  const wall = EntityFactory.create()
    .position(new Vector2D(i, 0))
    .size(8, 8)
    .solid(SpriteSheetParser.getSprite("wall-tiles", "dungeon-wall-tiles", 4, 5)!)
    .tiled(true)
    .collision(CollisionType.BOX, 0, -15)
    .build();
  entityManager.addEntity(wall);
}


const aiSystem = new AISystem(entityManager);

const game = new Game(entityManager);
game.addSystems([
  animationSystem, inputSystem, movementSystem, renderSystem, collisionSystem,
  aiSystem, combatSystem
]);

game.run();