import { SpriteData, SpriteSheet, SpriteSheetParser } from "../../utils/SpriteSheetParser";
import { Animation } from "./Animation";

export async function createEntityAnimations(entityId: string): Promise<Map<string, Animation>> {
  const animations = new Map<string, Animation>();

  switch (entityId) {
    case "player":
    case "enemy":
      animations.set("idle", await createAnimationFromSpriteSheet(entityId, "idle", "idle", 1, 8, 0.005, true));
      animations.set("idle-up", await createAnimationFromSpriteSheet(entityId, "idle", "idle-up", 3, 8, 0.005, true));
      animations.set("run", await createAnimationFromSpriteSheet(entityId, "run", "run", 1, 4, 0.005, true));
      animations.set("run-up", await createAnimationFromSpriteSheet(entityId, "run", "run-up", 3, 4, 0.005, true));
      animations.set("attack", await createAnimationFromSpriteSheet(entityId, "attack", "attack", 1, 4, 0.010, false));
      animations.set("attack-up", await createAnimationFromSpriteSheet(entityId, "attack", "attack-up", 3, 4, 0.010, false));
      animations.set("hurt", await createAnimationFromSpriteSheet(entityId, "hurt", "hurt", 1, 4, 0.010, false));
      animations.set("death", await createAnimationFromSpriteSheet(entityId, "death", "death", 0, 12, 0.010, false));
      break;
    case "torch":
      animations.set("fire", await createAnimationFromSpriteSheet(entityId, "fire", "fire", 0, 8, 0.005, true));
      break;
  }

  return animations;
}

async function createAnimationFromSpriteSheet(
  entityId: string,
  spriteSheetName: string,
  animationName: string,
  row: number,
  numFrames: number,
  frameDuration: number,
  loop: boolean
): Promise<Animation> {
  const spriteSheet: SpriteSheet | undefined = await SpriteSheetParser.getSpriteSheet(entityId, spriteSheetName);
  if (!spriteSheet) {
    throw new Error(`Sprite sheet not found for entityId: ${entityId} and animation: ${animationName}`);
  }

  const frames: SpriteData[] = [];
  for (let col = 0; col < numFrames; col++) {
    const spriteData = spriteSheet[row][col];
    if (!spriteData) {
      throw new Error(`Sprite data not found for row: ${row} and col: ${col} in ${entityId}-${animationName}`);
    }
    frames.push(spriteData);
  }

  return new Animation(animationName, frames, frameDuration, loop);
}
