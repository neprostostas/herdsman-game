export type LangCode = 'en' | 'uk' | 'es' | 'pl';

export interface I18nTranslations {
  [key: string]: string;
}

export type I18nConfig = {
  [key in LangCode]: I18nTranslations;
};

export interface II18nService {
  getCurrentLanguage(): LangCode;
  setLanguage(language: LangCode): void;
  translate(key: string): string;
  onLanguageChange(callback: (language: LangCode) => void): void;
  getAvailableLanguages(): LangCode[];
}
