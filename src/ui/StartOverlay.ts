import { IOverlay } from '../types/ui';
import { I18nService } from '../services/I18nService';

export class StartOverlay implements IOverlay {
  private overlay: HTMLElement | null;
  private startBtn: HTMLElement | null;
  private i18nService: I18nService;
  private onStartCallback?: () => void;

  constructor(i18nService: I18nService) {
    this.i18nService = i18nService;
    this.overlay = document.getElementById('start-overlay');
    this.startBtn = document.getElementById('start-btn');
    
    this.setupEventListeners();
    this.updateLanguage();
  }

  show(): void {
    if (this.overlay) {
      this.overlay.style.display = 'flex';
    }
  }

  hide(): void {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }

  destroy(): void {
    this.removeEventListeners();
  }

  isVisible(): boolean {
    return this.overlay ? this.overlay.style.display !== 'none' : false;
  }

  onStart(callback: () => void): void {
    this.onStartCallback = callback;
  }

  private setupEventListeners(): void {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => {
        if (this.onStartCallback) {
          this.onStartCallback();
        }
      });
    }
  }

  private removeEventListeners(): void {
    if (this.startBtn) {
      this.startBtn.removeEventListener('click', () => {});
    }
  }

  private updateLanguage(): void {
    const elements = document.querySelectorAll<HTMLElement>('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      
      if (el.tagName === 'BUTTON') {
        (el as HTMLButtonElement).textContent = this.i18nService.translate(key);
      } else {
        el.textContent = this.i18nService.translate(key);
      }
    });
  }
}
