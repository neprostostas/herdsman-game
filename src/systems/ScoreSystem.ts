import { ISystem, IScoreSystem } from '../types/systems';
import { EventBus } from '../core/EventBus';

export class ScoreSystem implements ISystem, IScoreSystem {
  public readonly name = 'ScoreSystem';
  private score: number = 0;
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  initialize(): void {
    this.eventBus.on('animalDelivered', () => {
      this.addScore(1);
    });
  }

  update(deltaTime: number): void {
    // No per-frame updates needed
  }

  destroy(): void {
    this.eventBus.off('animalDelivered', () => {});
  }

  addScore(points: number): void {
    this.score += points;
    this.eventBus.emit('scoreChanged', this.score);
  }

  getScore(): number {
    return this.score;
  }

  resetScore(): void {
    this.score = 0;
    this.eventBus.emit('scoreChanged', this.score);
  }
}
