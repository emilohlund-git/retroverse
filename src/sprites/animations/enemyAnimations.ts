import { SpriteSheetParser } from "../../utils/SpriteSheetParser";
import { createAnimation } from "./createAnimation";

export const enemyIdleAnimation = createAnimation(
  "idle",
  SpriteSheetParser.getSpriteSheet('enemy', 'enemy-idle')!,
  1,
  8,
  0.005,
  true
);

export const enemyIdleUpAnimation = createAnimation(
  "idle-up",
  SpriteSheetParser.getSpriteSheet('enemy', 'enemy-idle')!,
  3,
  8,
  0.005,
  true
);

export const enemyRunAnimation = createAnimation(
  "run",
  SpriteSheetParser.getSpriteSheet('enemy', 'enemy-run')!,
  1,
  4,
  0.005,
  true
);

export const enemyRunUpAnimation = createAnimation(
  "run-up",
  SpriteSheetParser.getSpriteSheet('enemy', 'enemy-run')!,
  3,
  4,
  0.005,
  true
);

export const enemyAttackAnimation = createAnimation(
  "attack",
  SpriteSheetParser.getSpriteSheet('enemy', 'enemy-attack')!,
  1,
  4,
  0.010,
  false
);

export const enemyAttackUpAnimation = createAnimation(
  "attack-up",
  SpriteSheetParser.getSpriteSheet('enemy', 'enemy-attack')!,
  3,
  4,
  0.010,
  false
);

export const enemyHurtAnimation = createAnimation(
  "hurt",
  SpriteSheetParser.getSpriteSheet("enemy", "enemy-hurt")!,
  1,
  4,
  0.010,
  false
);

export const enemyDeathAnimation = createAnimation(
  "death",
  SpriteSheetParser.getSpriteSheet("enemy", "enemy-die")!,
  0,
  12,
  0.010,
  false
);