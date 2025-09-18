import { Assets } from 'pixi.js';
import { AssetConfig } from '../types/game';
import { Logger } from './Logger';

export class AssetService {
  private loadedAssets: Map<string, any> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async loadAssets(config: AssetConfig): Promise<void> {
    try {
      this.logger.info('Loading assets...');

      const texturePromises = Object.entries(config.textures).map(([key, path]) =>
        this.loadTexture(key, path)
      );

      const fontPromises = Object.values(config.fonts).flatMap(font =>
        Object.values(font).map(path => this.loadFont(path))
      );

      await Promise.all([...texturePromises, ...fontPromises]);

      this.logger.info('All assets loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load assets:', error);
      throw error;
    }
  }

  private async loadTexture(key: string, path: string): Promise<void> {
    try {
      const texture = await Assets.load(path);
      this.loadedAssets.set(key, texture);
      this.logger.debug(`Loaded texture: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to load texture ${key} from ${path}:`, error);
      throw error;
    }
  }

  private async loadFont(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fontFace = new FontFace('CustomFont', `url(${path})`);
      
      fontFace.load().then(() => {
        document.fonts.add(fontFace);
        this.logger.debug(`Loaded font: ${path}`);
        resolve();
      }).catch((error) => {
        this.logger.warn(`Failed to load font ${path}, continuing anyway:`, error);
        resolve();
      });
    });
  }

  getTexture(key: string): any {
    const texture = this.loadedAssets.get(key);
    if (!texture) {
      this.logger.error(`Texture not found: ${key}`);
      throw new Error(`Texture '${key}' not loaded`);
    }
    return texture;
  }

  hasTexture(key: string): boolean {
    return this.loadedAssets.has(key);
  }

  unloadAsset(key: string): void {
    this.loadedAssets.delete(key);
  }

  unloadAllAssets(): void {
    this.loadedAssets.clear();
  }
}
