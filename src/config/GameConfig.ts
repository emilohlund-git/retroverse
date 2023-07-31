import { LevelData } from "../levels/level";
import { SpriteSheetInformation } from "../utils/SpriteSheetParser";

export interface GameConfig {
  spriteSheetPaths: SpriteSheetInformation[];
  levels: LevelData[];
}