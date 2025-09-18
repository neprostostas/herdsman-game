import { IModal } from '../types/ui';
import { I18nService } from '../services/I18nService';

export class PauseModal implements IModal {
  private overlay: HTMLElement | null;
  private resumeBtn: HTMLElement | null;
  private funFactText: HTMLElement | null;
  private i18nService: I18nService;
  private onResumeCallback?: () => void;
  private currentFunFactKey: string | null = null;

  constructor(i18nService: I18nService) {
    this.i18nService = i18nService;
    this.overlay = document.getElementById('pause-overlay');
    this.resumeBtn = document.getElementById('resume-btn');
    this.funFactText = document.getElementById('fun-fact-text');
    
    this.setupEventListeners();
    this.updateLanguage();
  }

  show(): void {
    if (this.overlay) {
      this.setRandomFunFact();
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

  setContent(content: string): void {
    if (this.funFactText) {
      this.funFactText.textContent = content;
    }
  }

  onResume(callback: () => void): void {
    this.onResumeCallback = callback;
  }

  private setupEventListeners(): void {
    if (this.resumeBtn) {
      this.resumeBtn.addEventListener('click', () => {
        if (this.onResumeCallback) {
          this.onResumeCallback();
        }
      });
    }
  }

  private removeEventListeners(): void {
    if (this.resumeBtn) {
      this.resumeBtn.removeEventListener('click', () => {});
    }
  }

  private setRandomFunFact(): void {
    const funFactKeys = [
      'funFact1', 'funFact2', 'funFact3', 'funFact4', 'funFact5',
      'funFact6', 'funFact7', 'funFact8', 'funFact9', 'funFact10'
    ];
    
    // Select a new random fact key
    this.currentFunFactKey = funFactKeys[Math.floor(Math.random() * funFactKeys.length)];
    
    // Translate and display the fact
    this.translateCurrentFunFact();
  }

  private translateCurrentFunFact(): void {
    if (this.currentFunFactKey && this.funFactText) {
      const funFact = this.i18nService.translate(this.currentFunFactKey);
      this.funFactText.textContent = funFact;
    }
  }

  updateLanguage(): void {
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
    
    // Translate current fun fact if modal is visible (don't select new fact)
    if (this.isVisible()) {
      this.translateCurrentFunFact();
    }
  }
}
