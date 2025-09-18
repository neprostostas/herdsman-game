import { ISystem, ICollisionSystem } from '../types/systems';
import { Animal } from '../entities/Animal';
import { Yard } from '../entities/Yard';
import { isPointInBounds } from '../utils/geometry';

export class CollisionSystem implements ISystem, ICollisionSystem {
  public readonly name = 'CollisionSystem';
  private animals: Animal[];
  private yard: Yard;
  private onAnimalDelivered: (animal: Animal) => void;

  constructor(
    animals: Animal[],
    yard: Yard,
    onAnimalDelivered: (animal: Animal) => void
  ) {
    this.animals = animals;
    this.yard = yard;
    this.onAnimalDelivered = onAnimalDelivered;
  }

  initialize(): void {
    // No initialization needed
  }

  update(deltaTime: number): void {
    this.checkCollisions();
  }

  destroy(): void {
    // No cleanup needed
  }

  checkCollisions(): void {
    for (let i = this.animals.length - 1; i >= 0; i--) {
      const animal = this.animals[i];
      
      // Only check animals that haven't been delivered yet
      if (!animal.isDelivered && (animal.state === 'following' || animal.state === 'autoDeliver')) {
        if (this.yard.isPointInYard(animal.position.x, animal.position.y)) {
          // Mark as delivered immediately to prevent double counting
          animal.isDelivered = true;
          this.onAnimalDelivered(animal);
        }
      }
    }
  }
}
