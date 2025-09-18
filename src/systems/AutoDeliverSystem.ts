import { ISystem } from '../types/systems';
import { Hero } from '../entities/Hero';
import { Animal } from '../entities/Animal';
import { Yard } from '../entities/Yard';
import { circleRectOverlap } from '../utils/math';

export class AutoDeliverSystem implements ISystem {
  public readonly name = 'AutoDeliverSystem';
  private hero: Hero;
  private animals: Animal[];
  private yard: Yard;
  private heroRadius: number;
  private autoDeliverSpeed: number;
  private wasHeroInYard: boolean = false;

  constructor(
    hero: Hero,
    animals: Animal[],
    yard: Yard,
    heroRadius: number,
    autoDeliverSpeed: number
  ) {
    this.hero = hero;
    this.animals = animals;
    this.yard = yard;
    this.heroRadius = heroRadius;
    this.autoDeliverSpeed = autoDeliverSpeed;
  }

  initialize(): void {
    // No initialization needed
  }

  update(deltaTime: number): void {
    this.checkHeroYardOverlap();
    this.updateAutoDeliverAnimals();
  }

  destroy(): void {
    // No cleanup needed
  }

  private checkHeroYardOverlap(): void {
    const heroInYard = circleRectOverlap(
      this.hero.position.x,
      this.hero.position.y,
      this.heroRadius,
      this.yard.bounds.left,
      this.yard.bounds.top,
      this.yard.bounds.right,
      this.yard.bounds.bottom
    );

    if (!this.wasHeroInYard && heroInYard) {
      this.triggerAutoDelivery();
    }

    this.wasHeroInYard = heroInYard;
  }

  private triggerAutoDelivery(): void {
    const followingAnimals = this.animals.filter(animal => animal.state === 'following');
    
    for (const animal of followingAnimals) {
      animal.setState('autoDeliver');
      const center = this.yard.getCenter();
      animal.setAutoTarget(center);
    }
  }

  private updateAutoDeliverAnimals(): void {
    for (const animal of this.animals) {
      if (animal.state === 'autoDeliver') {
        if (!animal.autoTarget) {
          const center = this.yard.getCenter();
          animal.setAutoTarget(center);
        }
      }
    }
  }
}
