import { SpriteData, SpriteSheet } from "../sprites/SpriteSheetParser";
import { Component } from "./Component";

export class RenderComponent extends Component {
  public flipped: boolean = false;

  constructor(
    public width: number,
    public height: number,
    public spriteData: SpriteData,
    public spriteSheet?: SpriteSheet,
    public tiled?: boolean,
    public frameX: number = 0,
    public frameY: number = 0,
  ) {
    super();
  }
}