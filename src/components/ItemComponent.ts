import { SpriteData } from "../sprites/SpriteSheetParser";
import { Vector2D } from "../utils/Vector2D";
import { Component } from "./Component";

export class ItemComponent extends Component {
  constructor(
    public name: string,
    public description: string,
    public icon: SpriteData,
    public dropPosition: Vector2D = new Vector2D(0, 0),
    public isDropped: boolean = false,
  ) {
    super();
  }
}