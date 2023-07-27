export class ImageLoader {
  private static loadedImages: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();

  static load(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.loadedImages.has(url)) {
        resolve(this.loadedImages.get(url) as HTMLImageElement);
      } else {
        const image = new Image();
        image.onload = () => {
          this.loadedImages.set(url, image);
          resolve(image);
        };
        image.onerror = reject;
        image.src = url;
      }
    });
  }
}