import { EntityFactory } from "../utils/EntityFactory";
import { Vector2D } from "../utils/Vector2D";
import { torchFireAnimation } from "./torchAnimation";

const torchAnimations = new Map();
torchAnimations.set("fire", torchFireAnimation);

export const torch = EntityFactory.create()
  .size(16, 16)
  .position(new Vector2D(105, 0))
  .animations(torchAnimations, "fire", true)
  .prop()
  .layer(1)
  .build();

export const torch2 = EntityFactory.create()
  .size(16, 16)
  .position(new Vector2D(129, 0))
  .animations(torchAnimations, "fire", true)
  .prop()
  .layer(1)
  .build();