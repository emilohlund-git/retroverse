type AssetType = "image" | "audio";

interface Asset {
  type: AssetType;
  url: string;
}

export class AssetManager {
  private assets: Map<string, Asset> = new Map();
  private loadedAssets: Map<string, HTMLImageElement | HTMLAudioElement> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();

  registerAsset(name: string, type: AssetType, url: string): void {
    if (this.assets.has(name)) {
      throw new Error(`Asset with name '${name}' is already registered.`);
    }

    this.assets.set(name, { type, url });
  }

  loadAsset(name: string): Promise<void> {
    const asset = this.assets.get(name);
    if (!asset) {
      throw new Error(`Asset with name '${name}' is not registered.`);
    }

    const { url, type } = asset;

    if (this.loadedAssets.has(url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const loadedAsset = this.createAsset(url, type);

      loadedAsset.onload = () => {
        this.loadedAssets.set(url, loadedAsset);
        resolve();
      };

      loadedAsset.onerror = (error) => {
        reject(error);
      };
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  getAsset(url: string): HTMLImageElement | HTMLAudioElement | undefined {
    return this.loadedAssets.get(url);
  }

  private createAsset(url: string, type: AssetType): HTMLImageElement | HTMLAudioElement {
    if (type === "image") {
      const image = new Image();
      image.src = url;
      return image;
    } else if (type === "audio") {
      const audio = new Audio();
      audio.src = url;
      return audio;
    }

    throw new Error("Invalid asset type.");
  }
}
