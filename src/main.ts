import { Game } from "./Game";
import { CollisionType } from "./components/CollisionComponent";
import { EntityManager } from "./entities/EntityManager";
import { Animation } from "./sprites/Animation";
import { AISystem } from "./systems/AISystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { InputSystem } from "./systems/InputSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { EntityFactory } from "./utils/EntityFactory";
import { Vector2D } from "./utils/Vector2D";
import { LEVEL_HEIGHT, LEVEL_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "./utils/constants";

const entityManager = new EntityManager();
const renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
const inputSystem = new InputSystem();
const movementSystem = new MovementSystem();
const collisionSystem = new CollisionSystem();
const animationSystem = new AnimationSystem();

const idle = new Animation('idle', [192, 193, 194, 195, 196, 197, 198], 0.005);
const idleUp = new Animation('idle-up', [208, 209, 210, 211, 212, 213, 214], 0.01);
const run = new Animation('run', [256, 257, 258, 259], 0.01);
const runUp = new Animation('run-up', [272, 273, 274, 275], 0.01);
const attack = new Animation('attack', [16, 17, 18, 19], 0.01);
const attackUp = new Animation('attack-up', [32, 33, 34, 35], 0.01);

const playerAnimations = new Map();
playerAnimations.set('idle', idle);
playerAnimations.set('idle-up', idleUp);
playerAnimations.set('run', run);
playerAnimations.set('run-up', runUp);
playerAnimations.set('attack', attack);
playerAnimations.set('attack-up', attackUp);

const excludedComponents = ['_DebugComponent', 'PlayerComponent', 'RenderComponent', 'MovementComponent'];

const player = EntityFactory.create()
  .name('player')
  .position(new Vector2D(TILE_WIDTH * 5, TILE_HEIGHT * 5))
  .size(32, 32)
  .spritePath('./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseAnimations.png')
  .solid(false)
  .movement(new Vector2D(0, 0), 2)
  .collision(CollisionType.BOX, 11, 11, 8, 8)
  .player()
  .debug(entityManager, excludedComponents)
  .combat()
  .animations(playerAnimations)
  .build();

const enemy = EntityFactory.create()
  .name('enemy')
  .position(new Vector2D(TILE_WIDTH * 7, TILE_HEIGHT * 7))
  .size(TILE_WIDTH, TILE_HEIGHT)
  .spritePath('./assets/spritesheets/player/Minifantasy_CreaturesOrcBaseAnimations.png')
  .solid(false)
  .movement(new Vector2D(0, 0), 2)
  .collision(CollisionType.BOX, 11, 11, 8, 8)
  .animations(playerAnimations)
  .ai(55)
  .build();

const enemy2 = EntityFactory.create()
  .name('enemy2')
  .position(new Vector2D(TILE_WIDTH * 13, TILE_HEIGHT * 13))
  .size(TILE_WIDTH, TILE_HEIGHT)
  .spritePath('./assets/spritesheets/player/Minifantasy_CreaturesOrcBaseAnimations.png')
  .solid(false)
  .movement(new Vector2D(0, 0), 2)
  .collision(CollisionType.BOX, 11, 11, 8, 8)
  .animations(playerAnimations)
  .ai(55)
  .build();

const topPlatform = EntityFactory.create()
  .name('top-platform')
  .position(new Vector2D(TILE_WIDTH, 0))
  .size(renderSystem.width - TILE_WIDTH, TILE_HEIGHT)
  .spritePath('./assets/tiles/stone_tile.png')
  .tiled(true)
  .collision(CollisionType.BOX)
  .solid(true)
  .build();

const bottomPlatform = EntityFactory.create()
  .name('bottom-platform')
  .position(new Vector2D(TILE_WIDTH, renderSystem.height - TILE_HEIGHT))
  .size(renderSystem.width - TILE_WIDTH * 2, TILE_HEIGHT)
  .spritePath('./assets/tiles/stone_tile.png')
  .tiled(true)
  .collision(CollisionType.BOX)
  .solid(true)
  .build();

const leftPlatform = EntityFactory.create()
  .name('left-platform')
  .position(new Vector2D(0, 0))
  .size(TILE_WIDTH, renderSystem.height)
  .spritePath('./assets/tiles/stone_tile.png')
  .tiled(true)
  .collision(CollisionType.BOX)
  .solid(true)
  .build();

const rightPlatform = EntityFactory.create()
  .name('right-platform')
  .position(new Vector2D(renderSystem.width - TILE_WIDTH, 0))
  .size(TILE_WIDTH, renderSystem.height)
  .spritePath('./assets/tiles/stone_tile.png')
  .tiled(true)
  .collision(CollisionType.BOX)
  .solid(true)
  .build();

const randomTile = EntityFactory.create()
  .name('random-tile')
  .position(new Vector2D(TILE_WIDTH * 4, TILE_HEIGHT * 4))
  .size(TILE_WIDTH, TILE_HEIGHT)
  .spritePath('./assets/tiles/stone_tile.png')
  .tiled(false)
  .collision(CollisionType.BOX)
  .solid(true)
  .build();

for (let i = TILE_HEIGHT + 32; i < TILE_HEIGHT * 5; i += 32) {
  const tile = EntityFactory.create()
    .name('random-tile')
    .position(new Vector2D(TILE_WIDTH * 3, i))
    .size(TILE_WIDTH, TILE_HEIGHT)
    .spritePath('./assets/tiles/stone_tile.png')
    .tiled(false)
    .collision(CollisionType.BOX)
    .solid(true)
    .build();

  entityManager.addEntity(tile)
}

entityManager.addEntities([
  topPlatform, bottomPlatform,
  rightPlatform, leftPlatform,
  randomTile, player, enemy, enemy2
]);

const aiSystem = new AISystem(entityManager);

const game = new Game(entityManager);
game.addSystems([
  inputSystem, movementSystem, renderSystem, collisionSystem,
  animationSystem, aiSystem
]);

game.run();