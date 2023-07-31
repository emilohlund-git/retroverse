import { LevelData } from "../levels/level";
import { SpriteSheetInformation } from "../sprites/SpriteSheetParser";

export interface GameConfig {
  spriteSheetPaths: SpriteSheetInformation[];
  levels: LevelData[];
}