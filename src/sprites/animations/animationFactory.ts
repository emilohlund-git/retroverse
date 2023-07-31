import { SpriteData, SpriteSheet, SpriteSheetParser } from "../SpriteSheetParser";
import { Animation } from "./Animation";

export function createEntityAnimations(entityId: string): Map<string, Animation> {
  const animations = new Map<string, Animation>();

  switch (entityId) {
    case "player":
      animations.set("idle", createAnimationFromSpriteSheet(entityId, "idle", 1, 8, 0.005, true));
      animations.set("idle-up", createAnimationFromSpriteSheet(entityId, "idle", 3, 8, 0.005, true));
      animations.set("run", createAnimationFromSpriteSheet(entityId, "run", 1, 4, 0.005, true));
      animations.set("run-up", createAnimationFromSpriteSheet(entityId, "run", 3, 4, 0.005, true));
      animations.set("attack", createAnimationFromSpriteSheet(entityId, "attack", 1, 4, 0.010, false));
      animations.set("attack-up", createAnimationFromSpriteSheet(entityId, "attack", 3, 4, 0.010, false));
      animations.set("hurt", createAnimationFromSpriteSheet(entityId, "hurt", 1, 4, 0.010, false));
      animations.set("death", createAnimationFromSpriteSheet(entityId, "die", 0, 12, 0.010, false));
      break;
    case "enemy":
      animations.set("idle", createAnimationFromSpriteSheet(entityId, "idle", 1, 8, 0.005, true));
      animations.set("idle-up", createAnimationFromSpriteSheet(entityId, "idle", 3, 8, 0.005, true));
      animations.set("run", createAnimationFromSpriteSheet(entityId, "run", 1, 4, 0.005, true));
      animations.set("run-up", createAnimationFromSpriteSheet(entityId, "run", 3, 4, 0.005, true));
      animations.set("attack", createAnimationFromSpriteSheet(entityId, "attack", 1, 4, 0.010, false));
      animations.set("attack-up", createAnimationFromSpriteSheet(entityId, "attack", 3, 4, 0.010, false));
      animations.set("hurt", createAnimationFromSpriteSheet(entityId, "hurt", 1, 4, 0.010, false));
      animations.set("death", createAnimationFromSpriteSheet(entityId, "die", 0, 12, 0.010, false));
      break;
    case "torch":
      animations.set("fire", createAnimationFromSpriteSheet(entityId, "fire", 0, 8, 0.005, true));
      break;
  }

  return animations;
}

function createAnimationFromSpriteSheet(
  entityId: string,
  animationName: string,
  row: number,
  numFrames: number,
  frameDuration: number,
  loop: boolean
): Animation {
  const spriteSheet: SpriteSheet | undefined = SpriteSheetParser.getSpriteSheet(entityId, animationName);
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
