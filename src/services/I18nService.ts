import { LangCode, I18nConfig, II18nService } from '../types/i18n';
import { StorageService } from './StorageService';
import { Logger } from './Logger';

export class I18nService implements II18nService {
  private currentLanguage: LangCode;
  private translations: I18nConfig;
  private languageChangeCallbacks: ((language: LangCode) => void)[] = [];
  private storage: StorageService;
  private logger: Logger;

  constructor(translations: I18nConfig, storage: StorageService, logger: Logger) {
    this.translations = translations;
    this.storage = storage;
    this.logger = logger;
    this.currentLanguage = this.getInitialLanguage();
  }

  private getInitialLanguage(): LangCode {
    const stored = this.storage.getItem<LangCode>('lang');
    if (stored && this.translations[stored]) {
      return stored;
    }
    return 'en';
  }

  getCurrentLanguage(): LangCode {
    return this.currentLanguage;
  }

  setLanguage(language: LangCode): void {
    if (!this.translations[language]) {
      this.logger.warn(`Language '${language}' not supported`);
      return;
    }

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = language;
    this.storage.setItem('lang', language);

    this.logger.info(`Language changed from ${oldLanguage} to ${language}`);

    this.languageChangeCallbacks.forEach(callback => {
      try {
        callback(language);
      } catch (error) {
        this.logger.error('Error in language change callback:', error);
      }
    });
  }

  translate(key: string): string {
    const translation = this.translations[this.currentLanguage][key];
    if (!translation) {
      this.logger.warn(`Translation key '${key}' not found for language '${this.currentLanguage}'`);
      return key;
    }
    return translation;
  }

  onLanguageChange(callback: (language: LangCode) => void): void {
    this.languageChangeCallbacks.push(callback);
  }

  getAvailableLanguages(): LangCode[] {
    return Object.keys(this.translations) as LangCode[];
  }

  getTranslationsForLanguage(language: LangCode): Record<string, string> {
    return this.translations[language] || {};
  }
}
