import { SpriteData } from "../utils/SpriteSheetParser";
import { Component } from "./Component";

export class SolidComponent extends Component {
  constructor(
    public spriteData: SpriteData
  ) {
    super();
  }
}