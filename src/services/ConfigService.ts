import { GameConfig, AssetConfig, LevelConfig, KeyConfig } from '../types/game';
import { I18nConfig } from '../types/i18n';
import { IConfigService } from '../types/config';
import { Logger } from './Logger';

export class ConfigService implements IConfigService {
  private gameConfig: GameConfig | null = null;
  private assetConfig: AssetConfig | null = null;
  private i18nConfig: I18nConfig | null = null;
  private levelConfig: LevelConfig | null = null;
  private keyConfig: KeyConfig | null = null;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async loadConfigs(): Promise<void> {
    try {
      this.logger.info('Loading configuration files...');

      const [gameData, assetData, i18nData, levelData, keyData] = await Promise.all([
        this.loadJsonConfig<GameConfig>('game.json'),
        this.loadJsonConfig<AssetConfig>('assets.json'),
        this.loadJsonConfig<I18nConfig>('i18n.json'),
        this.loadJsonConfig<LevelConfig>('levels.json'),
        this.loadJsonConfig<KeyConfig>('keys.json'),
      ]);

      this.gameConfig = gameData;
      this.assetConfig = assetData;
      this.i18nConfig = i18nData;
      this.levelConfig = levelData;
      this.keyConfig = keyData;

      this.logger.info('All configuration files loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load configuration files:', error);
      throw error;
    }
  }

  private async loadJsonConfig<T>(filename: string): Promise<T> {
    try {
      const response = await fetch(`/src/config/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      this.logger.error(`Failed to load config file ${filename}:`, error);
      throw error;
    }
  }

  getGameConfig(): GameConfig {
    if (!this.gameConfig) {
      throw new Error('Game config not loaded');
    }
    return this.gameConfig;
  }

  getAssetConfig(): AssetConfig {
    if (!this.assetConfig) {
      throw new Error('Asset config not loaded');
    }
    return this.assetConfig;
  }

  getI18nConfig(): I18nConfig {
    if (!this.i18nConfig) {
      throw new Error('I18n config not loaded');
    }
    return this.i18nConfig;
  }

  getLevelConfig(): LevelConfig {
    if (!this.levelConfig) {
      throw new Error('Level config not loaded');
    }
    return this.levelConfig;
  }

  getKeyConfig(): KeyConfig {
    if (!this.keyConfig) {
      throw new Error('Key config not loaded');
    }
    return this.keyConfig;
  }
}
