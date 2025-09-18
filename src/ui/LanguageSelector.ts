import { ILanguageSelector } from '../types/ui';
import { I18nService } from '../services/I18nService';
import { LangCode } from '../types/i18n';

export class LanguageSelector implements ILanguageSelector {
  private select: HTMLSelectElement | null;
  private i18nService: I18nService;
  private languageChangeCallbacks: ((language: string) => void)[] = [];

  constructor(i18nService: I18nService) {
    this.i18nService = i18nService;
    this.select = document.getElementById('lang-select') as HTMLSelectElement | null;
    
    this.setupEventListeners();
    this.updateLanguage();
  }

  show(): void {
    if (this.select) {
      this.select.style.display = 'block';
    }
  }

  hide(): void {
    if (this.select) {
      this.select.style.display = 'none';
    }
  }

  destroy(): void {
    this.removeEventListeners();
  }

  setLanguage(language: string): void {
    if (this.select && this.isValidLanguage(language)) {
      this.select.value = language;
      this.i18nService.setLanguage(language as LangCode);
    }
  }

  getCurrentLanguage(): string {
    return this.i18nService.getCurrentLanguage();
  }

  onLanguageChange(callback: (language: string) => void): void {
    this.languageChangeCallbacks.push(callback);
  }

  private setupEventListeners(): void {
    if (this.select) {
      this.select.addEventListener('change', () => {
        const value = this.select!.value as LangCode;
        if (this.isValidLanguage(value)) {
          this.i18nService.setLanguage(value);
          this.languageChangeCallbacks.forEach(callback => {
            try {
              callback(value);
            } catch (error) {
              console.error('Error in language change callback:', error);
            }
          });
        }
      });
    }

    this.i18nService.onLanguageChange((language) => {
      this.updateLanguage();
    });
  }

  private removeEventListeners(): void {
    if (this.select) {
      this.select.removeEventListener('change', () => {});
    }
  }

  private isValidLanguage(language: string): boolean {
    return this.i18nService.getAvailableLanguages().includes(language as LangCode);
  }

  private updateLanguage(): void {
    if (this.select) {
      this.select.value = this.i18nService.getCurrentLanguage();
    }
  }
}
