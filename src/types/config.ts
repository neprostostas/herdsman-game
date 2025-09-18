export interface IConfigService {
  getGameConfig(): any;
  getAssetConfig(): any;
  getI18nConfig(): any;
  getLevelConfig(): any;
  getKeyConfig(): any;
  loadConfigs(): Promise<void>;
}
