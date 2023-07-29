import { SpriteData } from "../utils/SpriteSheetParser";

export class Animation {
  constructor(public name: string, public frames: SpriteData[], public animationSpeed: number, public loop: boolean, public priority: number = 0) { }
}