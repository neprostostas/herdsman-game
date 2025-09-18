import { ISystem } from '../types/systems';
import { Animal } from '../entities/Animal';
import { Yard } from '../entities/Yard';
import { distance, randomBetween } from '../utils/math';
import { distancePointToRect } from '../utils/math';

export class PatrolSystem implements ISystem {
  public readonly name = 'PatrolSystem';
  private animals: Animal[];
  private yard: Yard;
  private screenWidth: number;
  private screenHeight: number;
  private minSpawnDistance: number;
  private edgeMargin: number;

  constructor(
    animals: Animal[],
    yard: Yard,
    screenWidth: number,
    screenHeight: number,
    minSpawnDistance: number,
    edgeMargin: number
  ) {
    this.animals = animals;
    this.yard = yard;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.minSpawnDistance = minSpawnDistance;
    this.edgeMargin = edgeMargin;
  }

  initialize(): void {
    // No initialization needed
  }

  update(deltaTime: number): void {
    for (const animal of this.animals) {
      if (animal.state === 'idle') {
        this.updatePatrol(animal);
      }
    }
  }

  destroy(): void {
    // No cleanup needed
  }

  private updatePatrol(animal: Animal): void {
    if (this.isInYardBuffer(animal.position.x, animal.position.y)) {
      this.assignNewPatrolTarget(animal);
      return;
    }

    if (!animal.patrolTarget) {
      this.assignNewPatrolTarget(animal);
      return;
    }

    const dx = animal.patrolTarget.x - animal.position.x;
    const dy = animal.patrolTarget.y - animal.position.y;
    const dist = distance(0, 0, dx, dy);

    if (dist < 4) {
      this.assignNewPatrolTarget(animal);
      return;
    }

    const nextX = animal.position.x + (dx / dist) * animal.patrolSpeed;
    const nextY = animal.position.y + (dy / dist) * animal.patrolSpeed;

    if (this.isInYardBuffer(nextX, nextY)) {
      this.assignNewPatrolTarget(animal);
    }
  }

  private assignNewPatrolTarget(animal: Animal): void {
    let attempts = 0;
    let target: { x: number; y: number };

    do {
      target = {
        x: this.edgeMargin + randomBetween(0, this.screenWidth - this.edgeMargin * 2),
        y: this.edgeMargin + randomBetween(0, this.screenHeight - this.edgeMargin * 2),
      };
      attempts++;
    } while (!this.isValidPatrolTarget(target.x, target.y) && attempts < 50);

    if (attempts >= 50) {
      target = { x: animal.position.x, y: animal.position.y };
    }

    animal.setPatrolTarget(target);
  }

  private isValidPatrolTarget(x: number, y: number): boolean {
    const yardBounds = this.yard.getBoundsWithBuffer(this.minSpawnDistance);
    const distToYard = distancePointToRect(x, y, yardBounds.left, yardBounds.top, yardBounds.right, yardBounds.bottom);

    if (distToYard < this.minSpawnDistance) {
      return false;
    }

    if (x < this.edgeMargin || x > this.screenWidth - this.edgeMargin ||
        y < this.edgeMargin || y > this.screenHeight - this.edgeMargin) {
      return false;
    }

    return true;
  }

  private isInYardBuffer(x: number, y: number): boolean {
    const yardBounds = this.yard.getBoundsWithBuffer(this.minSpawnDistance);
    return (
      x >= yardBounds.left &&
      x <= yardBounds.right &&
      y >= yardBounds.top &&
      y <= yardBounds.bottom
    );
  }
}
