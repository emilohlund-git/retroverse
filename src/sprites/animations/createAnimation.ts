import { SpriteSheet } from "../SpriteSheetParser";
import { Animation } from "./Animation";

export function createAnimation(
  name: string,
  spriteSheet: SpriteSheet,
  rowIndex: number,
  frameCount: number,
  frameDuration: number,
  loop: boolean
): Animation {
  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    frames.push(spriteSheet[rowIndex][i]);
  }
  return new Animation(name, frames, frameDuration, loop);
}