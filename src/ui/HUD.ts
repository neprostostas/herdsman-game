import { Text, Container } from 'pixi.js';
import { IHUD } from '../types/ui';
import { I18nService } from '../services/I18nService';

export class HUD implements IHUD {
  private scoreText: Text;
  private container: Container;
  private i18nService: I18nService;
  private isVisibleState: boolean = true;

  constructor(container: Container, i18nService: I18nService, fontSize: number) {
    this.container = container;
    this.i18nService = i18nService;
    
    this.scoreText = new Text({
      text: `${this.i18nService.translate('score')}: 0`,
      style: {
        fill: 0xffffff,
        fontSize: fontSize,
        fontFamily: 'Montserrat, sans-serif',
      },
    });

    this.container.addChild(this.scoreText);
  }

  show(): void {
    this.scoreText.visible = true;
    this.isVisibleState = true;
  }

  hide(): void {
    this.scoreText.visible = false;
    this.isVisibleState = false;
  }

  destroy(): void {
    this.container.removeChild(this.scoreText);
    this.scoreText.destroy();
  }

  updateScore(score: number): void {
    this.scoreText.text = `${this.i18nService.translate('score')}: ${score}`;
  }

  updateTime(time: string): void {
    // Time display not implemented yet
  }

  setPosition(x: number, y: number): void {
    this.scoreText.x = x;
    this.scoreText.y = y;
  }

  updateLanguage(): void {
    const currentScore = this.extractScoreFromText();
    this.scoreText.text = `${this.i18nService.translate('score')}: ${currentScore}`;
  }

  private extractScoreFromText(): number {
    const match = this.scoreText.text.match(/: (\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
