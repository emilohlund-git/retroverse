export class SpriteSheet {
  private image: HTMLImageElement;

  constructor(image: HTMLImageElement) {
    this.image = image;
  }

  getSprite(frameIndex: number): ImageBitmap {
    return new ImageBitmap();
  }
}