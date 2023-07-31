import { SpriteData } from "../sprites/SpriteSheetParser";
import { Component } from "./Component";

export class SolidComponent extends Component {
  constructor(
    public spriteData: SpriteData
  ) {
    super();
  }
}