export interface IUIComponent {
  show(): void;
  hide(): void;
  destroy(): void;
}

export interface IOverlay extends IUIComponent {
  isVisible(): boolean;
}

export interface IHUD extends IUIComponent {
  updateScore(score: number): void;
  updateTime(time: string): void;
}

export interface IModal extends IOverlay {
  setContent(content: string): void;
}

export interface ILanguageSelector extends IUIComponent {
  setLanguage(language: string): void;
  getCurrentLanguage(): string;
  onLanguageChange(callback: (language: string) => void): void;
}
