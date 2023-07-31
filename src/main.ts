import { GameInitializer } from "./GameInitializer";
import { GameConfig } from "./config/GameConfig";
import { levelOne } from "./levels/level";

const gameConfig: GameConfig = {
  spriteSheetPaths: [
    {
      entityId: "torch",
      spriteSheetName: "fire",
      spriteWidth: 16,
      spriteHeight: 16,
      imageWidth: 160,
      imageHeight: 160,
      spriteSheetUrl: "./assets/spritesheets/decorations/Minifantasy_DungeonTorch.png"
    },
    {
      entityId: "items",
      spriteSheetName: "all-items",
      spriteWidth: 16,
      spriteHeight: 16,
      imageWidth: 160,
      imageHeight: 160,
      spriteSheetUrl: "./assets/spritesheets/items/items.png"
    },
    {
      entityId: "enemy",
      spriteSheetName: "idle",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 512,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseIdle.png"
    },
    {
      entityId: "enemy",
      spriteSheetName: "run",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 128,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseWalk.png"
    },
    {
      entityId: "enemy",
      spriteSheetName: "attack",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 128,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseAttack.png"
    },
    {
      entityId: "enemy",
      spriteSheetName: "hurt",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 128,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDmg.png"
    },
    {
      entityId: "enemy",
      spriteSheetName: "death",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 384,
      imageHeight: 32,
      spriteSheetUrl: "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDie.png"
    },
    {
      entityId: "player",
      spriteSheetName: "idle",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 512,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseIdle.png"
    },
    {
      entityId: "player",
      spriteSheetName: "run",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 128,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseWalk.png"
    },
    {
      entityId: "player",
      spriteSheetName: "attack",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 128,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseAttack.png"
    },
    {
      entityId: "player",
      spriteSheetName: "hurt",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 128,
      imageHeight: 128,
      spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseDmg.png"
    },
    {
      entityId: "player",
      spriteSheetName: "death",
      spriteWidth: 32,
      spriteHeight: 32,
      imageWidth: 384,
      imageHeight: 32,
      spriteSheetUrl: "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseSoulDie.png"
    },
    {
      entityId: "dungeon-tiles",
      spriteSheetName: "floor-tiles",
      spriteWidth: 8,
      spriteHeight: 8,
      imageWidth: 56,
      imageHeight: 16,
      spriteSheetUrl: './assets/tiles/Minifantasy_DungeonFloorTiles.png'
    },
    {
      entityId: "dungeon-tiles",
      spriteSheetName: "wall-tiles",
      spriteWidth: 8,
      spriteHeight: 8,
      imageWidth: 56,
      imageHeight: 112,
      spriteSheetUrl: './assets/tiles/Minifantasy_DungeonWallTiles.png'
    },
    {
      entityId: "dungeon-tiles",
      spriteSheetName: "door-tiles",
      spriteWidth: 8,
      spriteHeight: 8,
      imageWidth: 8,
      imageHeight: 16,
      spriteSheetUrl: './assets/tiles/Minifantasy_DungeonDoorTiles.png'
    },
  ],
  levels: [levelOne],
};

const initializer = new GameInitializer(gameConfig);
initializer.initialize();