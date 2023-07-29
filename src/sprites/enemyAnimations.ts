import { SpriteSheetParser } from "../utils/SpriteSheetParser";
import { Animation } from "./Animation";

SpriteSheetParser.extractSprites("enemy", "enemy-idle", 32, 32, 512, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseIdle.png");
SpriteSheetParser.extractSprites("enemy", "enemy-run", 32, 32, 128, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseWalk.png");
SpriteSheetParser.extractSprites("enemy", "enemy-attack", 32, 32, 128, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseAttack.png");
SpriteSheetParser.extractSprites("enemy", "enemy-hurt", 32, 32, 128, 128, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDmg.png");
SpriteSheetParser.extractSprites("enemy", "enemy-die", 32, 32, 384, 32, "./assets/spritesheets/enemy/Minifantasy_CreaturesOrcBaseDie.png");

const enemyIdleSpriteSheet = SpriteSheetParser.getSpriteSheet('enemy', 'enemy-idle');
const enemyRunSpriteSheet = SpriteSheetParser.getSpriteSheet('enemy', 'enemy-run');
const enemyAttackSpriteSheet = SpriteSheetParser.getSpriteSheet('enemy', 'enemy-attack');
const enemyHurtSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-hurt");
const enemyDieSpriteSheet = SpriteSheetParser.getSpriteSheet("enemy", "enemy-die");

export const enemyIdleAnimation = new Animation('idle', [
  enemyIdleSpriteSheet![1][0],
  enemyIdleSpriteSheet![1][1],
  enemyIdleSpriteSheet![1][2],
  enemyIdleSpriteSheet![1][3],
  enemyIdleSpriteSheet![1][4],
  enemyIdleSpriteSheet![1][5],
  enemyIdleSpriteSheet![1][6],
  enemyIdleSpriteSheet![1][7]
], 0.005, true);

export const enemyIdleUpAnimation = new Animation("idle-up", [
  enemyIdleSpriteSheet![3][0],
  enemyIdleSpriteSheet![3][1],
  enemyIdleSpriteSheet![3][2],
  enemyIdleSpriteSheet![3][3],
  enemyIdleSpriteSheet![3][4],
  enemyIdleSpriteSheet![3][5],
  enemyIdleSpriteSheet![3][6],
  enemyIdleSpriteSheet![3][7]
], 0.005, true)

export const enemyRunAnimation = new Animation("run", [
  enemyRunSpriteSheet![1][0],
  enemyRunSpriteSheet![1][1],
  enemyRunSpriteSheet![1][2],
  enemyRunSpriteSheet![1][3],
], 0.005, true);

export const enemyRunUpAnimation = new Animation("run-up", [
  enemyRunSpriteSheet![3][0],
  enemyRunSpriteSheet![3][1],
  enemyRunSpriteSheet![3][2],
  enemyRunSpriteSheet![3][3],
], 0.005, true);

export const enemyAttackAnimation = new Animation("attack", [
  enemyAttackSpriteSheet![1][0],
  enemyAttackSpriteSheet![1][1],
  enemyAttackSpriteSheet![1][2],
  enemyAttackSpriteSheet![1][3],
], 0.010, false);

export const enemyAttackUpAnimation = new Animation("attack-up", [
  enemyAttackSpriteSheet![3][0],
  enemyAttackSpriteSheet![3][1],
  enemyAttackSpriteSheet![3][2],
  enemyAttackSpriteSheet![3][3],
], 0.010, false);

export const enemyHurtAnimation = new Animation("hurt", [
  enemyHurtSpriteSheet![1][0],
  enemyHurtSpriteSheet![1][1],
  enemyHurtSpriteSheet![1][2],
  enemyHurtSpriteSheet![1][3],
], 0.010, false);

export const enemyDeathAnimation = new Animation("death", [
  enemyDieSpriteSheet![0][0],
  enemyDieSpriteSheet![0][1],
  enemyDieSpriteSheet![0][2],
  enemyDieSpriteSheet![0][3],
  enemyDieSpriteSheet![0][4],
  enemyDieSpriteSheet![0][5],
  enemyDieSpriteSheet![0][6],
  enemyDieSpriteSheet![0][7],
  enemyDieSpriteSheet![0][8],
  enemyDieSpriteSheet![0][9],
  enemyDieSpriteSheet![0][10],
  enemyDieSpriteSheet![0][11],
], 0.010, false);