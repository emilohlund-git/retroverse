import { Game } from "./Game";
import { ItemComponent } from "./components/ItemComponent";
import { GameConfig } from "./config/GameConfig";
import { EntityManager } from "./entities/EntityManager";
import { createEnemyEntity } from "./entities/enemyEntity";
import { createPlayerEntity } from "./entities/playerEntity";
import { LevelInitializer } from "./levels/LevelInitializer";
import { createEntityAnimations } from "./sprites/animations/AnimationFactory";
import { loadItems } from "./sprites/itemFactory";
import { AISystem } from "./systems/AISystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { CollisionSystem } from "./systems/CollisionSystem";
import { CombatSystem } from "./systems/CombatSystem";
import { InputSystem } from "./systems/InputSystem";
import { InteractionSystem } from "./systems/InteractionSystem";
import { InventorySystem } from "./systems/InventorySystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { EntityFactory } from "./utils/EntityFactory";
import { SpriteSheetParser } from "./utils/SpriteSheetParser";
import { Vector2D } from "./utils/Vector2D";
import { LEVEL_HEIGHT, LEVEL_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "./utils/constants";

export class GameInitializer {
  private entityManager: EntityManager;
  private game: Game;
  private levelInitializer: LevelInitializer;

  constructor(private config: GameConfig) {
    this.entityManager = new EntityManager();
    this.game = new Game(this.entityManager);
    this.levelInitializer = new LevelInitializer(this.entityManager);
  }

  async initialize(): Promise<void> {
    await this.loadSprites();
    this.createPlayer();
    await this.createEnemies();
    this.createWorldInventory();
    await this.createLevels();
    await this.createProps();
    this.addSystems();
    this.game.run();
  }

  private async loadSprites(): Promise<void> {
    for (const path of this.config.spriteSheetPaths) {
      await SpriteSheetParser.extractSprites(
        path.entityId,
        path.spriteSheetName,
        path.spriteWidth,
        path.spriteHeight,
        path.imageWidth,
        path.imageHeight,
        path.spriteSheetUrl
      );
    }
  }

  private createPlayer(): void {
    const playerAnimations = createEntityAnimations("player");
    createPlayerEntity(this.entityManager, playerAnimations);
  }

  private async createEnemies(): Promise<void> {
    const enemyAnimations = createEntityAnimations("enemy");
    const items = await loadItems();
    const enemyLoot = <ItemComponent[]>[];
    enemyLoot.push(items.get("Key")!);
    for (let i = 1; i < 2; i++) {
      createEnemyEntity(this.entityManager, `enemy${i}`, 110, 10, enemyAnimations, enemyLoot);
    }
  }

  private createWorldInventory(): void {
    const worldInventory = EntityFactory.create()
      .name("world-inventory")
      .position(new Vector2D(0, 0))
      .inventory(200)
      .build();

    this.entityManager.addEntity(worldInventory);
  }

  private async createLevels(): Promise<void> {
    for (const levelData of this.config.levels) {
      await this.levelInitializer.createEntitiesFromLevelArray(levelData.data, levelData.spriteSheets);
    }
  }

  private async createProps(): Promise<void> {
    const torchAnimations = createEntityAnimations("torch");
    const torch = EntityFactory.create()
      .name("torch")
      .size(16, 16)
      .position(new Vector2D(105, 0))
      .animations(torchAnimations, "fire", true)
      .prop()
      .layer(1)
      .build();

    const torch2 = EntityFactory.create()
      .name("torch")
      .size(16, 16)
      .position(new Vector2D(129, 0))
      .animations(torchAnimations, "fire", true)
      .prop()
      .layer(1)
      .build();

    this.entityManager.addEntities([torch, torch2]);
  }

  private addSystems(): void {
    const aiSystem = new AISystem(this.entityManager);
    const renderSystem = new RenderSystem(TILE_WIDTH * LEVEL_WIDTH, TILE_HEIGHT * LEVEL_HEIGHT);
    const inputSystem = new InputSystem();
    const movementSystem = new MovementSystem();
    const collisionSystem = new CollisionSystem();
    const animationSystem = new AnimationSystem();
    const combatSystem = new CombatSystem();
    const inventorySystem = new InventorySystem();
    const interactionSystem = new InteractionSystem();

    this.game.addSystems([
      animationSystem, inputSystem, movementSystem, renderSystem, inventorySystem, collisionSystem,
      aiSystem, combatSystem, interactionSystem
    ]);
  }
}
