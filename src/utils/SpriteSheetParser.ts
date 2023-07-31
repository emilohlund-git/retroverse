export interface SpriteData {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteSheet {
  [row: number]: { [col: number]: SpriteData; };
}

export interface EntitySpriteSheet {
  [spriteSheetName: string]: SpriteSheet;
}

export interface EntitiesSpriteSheets {
  [entityId: string]: EntitySpriteSheet;
}

export interface SpriteSheetInformation {
  entityId: string;
  spriteSheetName: string;
  spriteWidth: number;
  spriteHeight: number;
  imageWidth: number;
  imageHeight: number;
  spriteSheetUrl: string;
}

export class SpriteSheetParser {
  private static spriteSheets: EntitiesSpriteSheets = {};

  private static loadImage(url: string, imageWidth: number, imageHeight: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image(imageWidth, imageHeight);
      image.onerror = reject;
      image.src = url;
      image.onload = () => resolve(image);
    });
  }

  public static async extractSprites(
    entityId: string,
    spriteSheetName: string,
    spriteWidth: number,
    spriteHeight: number,
    imageWidth: number,
    imageHeight: number,
    spriteSheetUrl: string
  ) {
    try {
      const spriteSheetImage = await this.loadImage(spriteSheetUrl, imageWidth, imageHeight);

      const numRows = Math.floor(spriteSheetImage.height / spriteHeight);
      const numCols = Math.floor(spriteSheetImage.width / spriteWidth);

      const sprites: SpriteSheet = {};

      for (let row = 0; row < numRows; row++) {
        sprites[row] = {};
        for (let col = 0; col < numCols; col++) {
          sprites[row][col] = {
            image: spriteSheetImage,
            x: col * spriteWidth,
            y: row * spriteHeight,
            width: spriteWidth,
            height: spriteHeight,
          };
        }
      }

      if (!this.spriteSheets[entityId]) {
        this.spriteSheets[entityId] = {};
      }

      this.spriteSheets[entityId][spriteSheetName] = sprites;
    } catch (error) {
      console.error(`Error loading sprite sheet: ${spriteSheetUrl}`);
    }
  }

  public static getSprite(entityId: string, spriteSheetName: string, row: number, col: number): SpriteData | undefined {
    const entitySpriteSheets = this.spriteSheets[entityId];
    if (!entitySpriteSheets) return undefined;

    const sprites = entitySpriteSheets[spriteSheetName];
    if (!sprites) return undefined;

    return sprites[row]?.[col];
  }

  public static getSpriteSheet(entityId: string, spriteSheetName: string): SpriteSheet | undefined {
    const entitySpriteSheet = this.spriteSheets[entityId];
    if (!entitySpriteSheet) return undefined;

    const spriteSheet = entitySpriteSheet[spriteSheetName];
    if (!spriteSheet) return undefined;

    return spriteSheet;
  }
}
