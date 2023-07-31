import { SpriteSheetParser } from "../SpriteSheetParser";
import { Animation } from "./Animation";

SpriteSheetParser.extractSprites("torch", "torch", 16, 16, 128, 24, "./assets/spritesheets/decorations/Minifantasy_DungeonTorch.png");

const torchFireSpriteSheet = SpriteSheetParser.getSpriteSheet('torch', 'torch');

export const torchFireAnimation = new Animation('idle', [
  torchFireSpriteSheet![0][0],
  torchFireSpriteSheet![0][1],
  torchFireSpriteSheet![0][2],
  torchFireSpriteSheet![0][3],
  torchFireSpriteSheet![0][4],
  torchFireSpriteSheet![0][5],
  torchFireSpriteSheet![0][6],
  torchFireSpriteSheet![0][7]
], 0.005, true);