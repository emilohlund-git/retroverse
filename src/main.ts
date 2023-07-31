import { GameInitializer } from "./GameInitializer";
import { GameConfig } from "./config/GameConfig";
import { levelOne } from "./levels/level";

const gameConfig: GameConfig = {
  spriteSheetPaths: [
    {
      entityId: "dungeon-tiles",
      spriteSheetName: "floor-tiles",
      spriteWidth: 8,
      spriteHeight: 8,
      imageWidth: 56,
      imageHeight: 16,
      spriteSheetUrl: './assets/tiles/MiniFantasy_DungeonFloorTiles.png'
    },
    {
      entityId: "dungeon-tiles",
      spriteSheetName: "wall-tiles",
      spriteWidth: 8,
      spriteHeight: 8,
      imageWidth: 56,
      imageHeight: 112,
      spriteSheetUrl: './assets/tiles/MiniFantasy_DungeonWallTiles.png'
    },
    {
      entityId: "dungeon-tiles",
      spriteSheetName: "door-tiles",
      spriteWidth: 8,
      spriteHeight: 8,
      imageWidth: 8,
      imageHeight: 16,
      spriteSheetUrl: './assets/tiles/MiniFantasy_DungeonDoorTiles.png'
    },
  ],
  levels: [levelOne],
};

const initializer = new GameInitializer(gameConfig);
initializer.initialize();