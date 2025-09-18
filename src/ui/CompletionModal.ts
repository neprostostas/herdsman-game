import { IModal } from '../types/ui';
import { I18nService } from '../services/I18nService';
import { StorageService } from '../services/StorageService';

export class CompletionModal implements IModal {
  private overlay: HTMLElement | null;
  private modalContent: HTMLElement | null;
  private playAgainBtn: HTMLElement | null;
  private currentTimeElement: HTMLElement | null;
  private bestTimeElement: HTMLElement | null;
  private i18nService: I18nService;
  private storageService: StorageService;
  private onPlayAgainCallback?: () => void;

  constructor(i18nService: I18nService, storageService: StorageService) {
    this.i18nService = i18nService;
    this.storageService = storageService;
    this.overlay = document.getElementById('completion-overlay');
    this.modalContent = this.overlay?.querySelector('.completion-modal') as HTMLElement;
    this.playAgainBtn = document.getElementById('play-again-btn');
    this.currentTimeElement = document.getElementById('current-time');
    this.bestTimeElement = document.getElementById('best-time');
    
    this.setupEventListeners();
    this.updateLanguage();
  }

  show(): void {
    if (this.overlay && this.modalContent) {
      // Show overlay immediately (no animation)
      this.overlay.style.display = 'flex';
      this.overlay.style.opacity = '1';
      this.overlay.style.transition = '';
      
      // Reset modal content animation state
      this.modalContent.style.opacity = '0';
      this.modalContent.style.transform = 'scale(0.8)';
      
      // Animate modal content in
      requestAnimationFrame(() => {
        this.modalContent!.style.transition = 'opacity 250ms ease-out, transform 250ms ease-out';
        this.modalContent!.style.opacity = '1';
        this.modalContent!.style.transform = 'scale(1)';
      });
      
      if (this.playAgainBtn) {
        // Focus after animation completes
        setTimeout(() => {
          (this.playAgainBtn as HTMLButtonElement).focus();
        }, 300);
      }
    }
  }

  hide(): void {
    if (this.overlay && this.modalContent) {
      // Animate modal content out first
      this.modalContent.style.transition = 'opacity 200ms ease-in, transform 200ms ease-in';
      this.modalContent.style.opacity = '0';
      this.modalContent.style.transform = 'scale(0.9)';
      
      // Hide overlay after content animation completes
      setTimeout(() => {
        this.overlay!.style.display = 'none';
        // Reset for next show
        this.overlay!.style.transition = '';
        this.modalContent!.style.transition = '';
      }, 200);
    }
  }

  destroy(): void {
    this.removeEventListeners();
  }

  isVisible(): boolean {
    return this.overlay ? this.overlay.style.display !== 'none' : false;
  }

  setContent(content: string): void {
    // Content is set via setTimeStats
  }

  setTimeStats(currentTime: number): void {
    const bestTime = this.getBestTime();
    const currentTimeFormatted = this.formatTime(currentTime);
    const bestTimeFormatted = this.formatTime(bestTime);

    if (this.currentTimeElement) {
      this.currentTimeElement.textContent = currentTimeFormatted;
    }

    if (this.bestTimeElement) {
      this.bestTimeElement.textContent = bestTimeFormatted;
    }

    if (currentTime < bestTime) {
      this.setBestTime(currentTime);
    }
  }

  onPlayAgain(callback: () => void): void {
    this.onPlayAgainCallback = callback;
  }

  private setupEventListeners(): void {
    if (this.playAgainBtn) {
      this.playAgainBtn.addEventListener('click', () => {
        if (this.onPlayAgainCallback) {
          this.onPlayAgainCallback();
        }
      });
    }
  }

  private removeEventListeners(): void {
    if (this.playAgainBtn) {
      this.playAgainBtn.removeEventListener('click', () => {});
    }
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms}`;
  }

  private getBestTime(): number {
    return this.storageService.getItem<number>('best_time') || Number.MAX_SAFE_INTEGER;
  }

  private setBestTime(time: number): void {
    this.storageService.setItem('best_time', time);
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
