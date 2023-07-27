export class SpriteSheetParser {
  private static sprites: Map<string, { x: number; y: number; width: number; height: number }> = new Map();

  public static extractSprites(entityName: string, spriteSheetImage: HTMLImageElement) {
    const spriteWidth = 32;
    const spriteHeight = 32;
    const numRows = Math.floor(spriteSheetImage.height / spriteHeight);
    const numCols = Math.floor(spriteSheetImage.width / spriteWidth);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        this.sprites.set(entityName, {
          x: col * spriteWidth,
          y: row * spriteHeight,
          width: spriteWidth,
          height: spriteHeight,
        });
      }
    }
  }

  public static getSprite(entityName: string): { x: number; y: number; width: number; height: number } | undefined {
    return this.sprites.get(entityName);
  }
}