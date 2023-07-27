import { ImageLoader } from "../utils/ImageLoader";
import { Component } from "./Component";

export class RenderComponent extends Component {
  public image: HTMLImageElement | null = null;
  public flipped: boolean = false;

  constructor(
    public width: number,
    public height: number,
    public tiled?: boolean,
    public frameX: number = 0,
    public frameY: number = 0,
  ) {
    super();
  }

  public setImage(spritePath: string) {
    ImageLoader.load(spritePath).then((image) => {
      this.image = image;
    }).catch((error) => {
      throw new Error(`Failed to load image from ${spritePath}. Error: ${error}`);
    });
  }
}