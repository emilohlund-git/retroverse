import { SpriteSheetParser } from "../utils/SpriteSheetParser";
import { Animation } from "./Animation";

SpriteSheetParser.extractSprites("player", "player-idle", 32, 32, 512, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseIdle.png");
SpriteSheetParser.extractSprites("player", "player-run", 32, 32, 128, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseWalk.png");
SpriteSheetParser.extractSprites("player", "player-attack", 32, 32, 128, 128, "./assets/spritesheets/player/MiniFantasy_CreaturesHumanBaseAttack.png");
SpriteSheetParser.extractSprites("player", "player-hurt", 32, 32, 128, 128, "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseDmg.png");
SpriteSheetParser.extractSprites("player", "player-die", 32, 32, 384, 32, "./assets/spritesheets/player/Minifantasy_CreaturesHumanBaseSoulDie.png");

const playerIdleSpriteSheet = SpriteSheetParser.getSpriteSheet('player', 'player-idle');
const playerRunSpriteSheet = SpriteSheetParser.getSpriteSheet('player', 'player-run');
const playerAttackSpriteSheet = SpriteSheetParser.getSpriteSheet('player', 'player-attack');
const playerHurtSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-hurt");
const playerDieSpriteSheet = SpriteSheetParser.getSpriteSheet("player", "player-die");

export const playerIdleAnimation = new Animation('idle', [
  playerIdleSpriteSheet![1][0],
  playerIdleSpriteSheet![1][1],
  playerIdleSpriteSheet![1][2],
  playerIdleSpriteSheet![1][3],
  playerIdleSpriteSheet![1][4],
  playerIdleSpriteSheet![1][5],
  playerIdleSpriteSheet![1][6],
  playerIdleSpriteSheet![1][7]
], 0.005, true);

export const playerIdleUpAnimation = new Animation("idle-up", [
  playerIdleSpriteSheet![3][0],
  playerIdleSpriteSheet![3][1],
  playerIdleSpriteSheet![3][2],
  playerIdleSpriteSheet![3][3],
  playerIdleSpriteSheet![3][4],
  playerIdleSpriteSheet![3][5],
  playerIdleSpriteSheet![3][6],
  playerIdleSpriteSheet![3][7]
], 0.005, true)

export const playerRunAnimation = new Animation("run", [
  playerRunSpriteSheet![1][0],
  playerRunSpriteSheet![1][1],
  playerRunSpriteSheet![1][2],
  playerRunSpriteSheet![1][3],
], 0.005, true);

export const playerRunUpAnimation = new Animation("run-up", [
  playerRunSpriteSheet![3][0],
  playerRunSpriteSheet![3][1],
  playerRunSpriteSheet![3][2],
  playerRunSpriteSheet![3][3],
], 0.005, true);

export const playerAttackAnimation = new Animation("attack", [
  playerAttackSpriteSheet![1][0],
  playerAttackSpriteSheet![1][1],
  playerAttackSpriteSheet![1][2],
  playerAttackSpriteSheet![1][3],
], 0.010, false);

export const playerAttackUpAnimation = new Animation("attack-up", [
  playerAttackSpriteSheet![3][0],
  playerAttackSpriteSheet![3][1],
  playerAttackSpriteSheet![3][2],
  playerAttackSpriteSheet![3][3],
], 0.010, false);

export const playerHurtAnimation = new Animation("hurt", [
  playerHurtSpriteSheet![1][0],
  playerHurtSpriteSheet![1][1],
  playerHurtSpriteSheet![1][2],
  playerHurtSpriteSheet![1][3],
], 0.010, false);

export const playerDeathAnimation = new Animation("death", [
  playerDieSpriteSheet![0][0],
  playerDieSpriteSheet![0][1],
  playerDieSpriteSheet![0][2],
  playerDieSpriteSheet![0][3],
  playerDieSpriteSheet![0][4],
  playerDieSpriteSheet![0][5],
  playerDieSpriteSheet![0][6],
  playerDieSpriteSheet![0][7],
  playerDieSpriteSheet![0][8],
  playerDieSpriteSheet![0][9],
  playerDieSpriteSheet![0][10],
  playerDieSpriteSheet![0][11],
  playerDieSpriteSheet![0][12],
  playerDieSpriteSheet![0][13],
], 0.010, false);