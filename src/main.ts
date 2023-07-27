import { Game } from "./Game";
import { CollisionType } from "./components/CollisionComponent";
import { EntityManager } from "./entities/EntityManager";
import { Animation } from "./sprites/Animation";
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

const idle = new Animation('idle', [0], 0.01);
const walk = new Animation('walk', [0, 1, 2, 3, 4], 0.01);

const playerAnimations = new Map();
playerAnimations.set('idle', idle);
playerAnimations.set('walk', walk);

const excludedComponents = ['_DebugComponent', 'PlayerComponent'];

const player = EntityFactory.create()
  .name('player')
  .position(new Vector2D(TILE_WIDTH * 5, TILE_HEIGHT * 5))
  .size(TILE_WIDTH, TILE_HEIGHT)
  .spritePath('./assets/spritesheets/player/player_spritesheet.png')
  .solid(false)
  .movement(new Vector2D(0, 0), 2)
  .collision(CollisionType.BOX)
  .player()
  .debug(entityManager, excludedComponents)
  .animations(playerAnimations)
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

entityManager.addEntities([
  topPlatform, bottomPlatform,
  rightPlatform, leftPlatform,
  randomTile, player
]);

const game = new Game(entityManager);
game.addSystems([
  inputSystem, movementSystem, renderSystem, collisionSystem,
  animationSystem
]);

game.run();