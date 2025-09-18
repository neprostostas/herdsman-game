import { ISystem } from '../types/systems';
import { Hero } from '../entities/Hero';
import { Animal } from '../entities/Animal';
import { distance } from '../utils/math';
import { AssetService } from '../services/AssetService';

export class FollowSystem implements ISystem {
  public readonly name = 'FollowSystem';
  private hero: Hero;
  private animals: Animal[];
  private followTriggerDistance: number;
  private maxFollowers: number;
  private lagFramesPerFollower: number;
  private assetService: AssetService;

  constructor(
    hero: Hero,
    animals: Animal[],
    followTriggerDistance: number,
    maxFollowers: number,
    lagFramesPerFollower: number,
    assetService: AssetService
  ) {
    this.hero = hero;
    this.animals = animals;
    this.followTriggerDistance = followTriggerDistance;
    this.maxFollowers = maxFollowers;
    this.lagFramesPerFollower = lagFramesPerFollower;
    this.assetService = assetService;
  }

  initialize(): void {
    // No initialization needed
  }

  update(deltaTime: number): void {
    this.updateFollowing();
  }

  destroy(): void {
    // No cleanup needed
  }

  private updateFollowing(): void {
    let followersCount = 0;
    let followerIndex = 0;

    for (const animal of this.animals) {
      if (animal.state === 'following') {
        followersCount++;
      }
    }

    for (const animal of this.animals) {
      if (animal.state === 'idle' && followersCount < this.maxFollowers) {
        const dist = distance(
          this.hero.position.x,
          this.hero.position.y,
          animal.position.x,
          animal.position.y
        );

        if (dist <= this.followTriggerDistance) {
          animal.setState('following');
          this.switchAnimalTexture(animal, 'animalOn');
          followersCount++;
        }
      }

      if (animal.state === 'following') {
        this.updateFollowerPosition(animal, followerIndex);
        followerIndex++;
      }
    }
  }

  private updateFollowerPosition(animal: Animal, followerIndex: number): void {
    const desiredTrailIndex = this.hero.trail.length - 1 - (followerIndex + 1) * this.lagFramesPerFollower;
    const target = desiredTrailIndex >= 0 ? this.hero.trail[desiredTrailIndex] : this.hero.position;

    const dx = target.x - animal.position.x;
    const dy = target.y - animal.position.y;
    const dist = distance(0, 0, dx, dy);

    const minDistance = 20; // Half of animal radius

    if (dist > minDistance) {
      const followSpeed = this.hero.getActualSpeed() * 0.8;
      const step = Math.min(followSpeed, dist - minDistance);
      
      animal.position.x += (dx / dist) * step;
      animal.position.y += (dy / dist) * step;
    }
  }

  private switchAnimalTexture(animal: Animal, textureKey: string): void {
    try {
      const texture = this.assetService.getTexture(textureKey);
      const prevX = animal.sprite.x;
      const prevY = animal.sprite.y;
      const prevScaleX = animal.sprite.scale.x;
      const prevScaleY = animal.sprite.scale.y;
      const prevAnchorX = animal.sprite.anchor.x;
      const prevAnchorY = animal.sprite.anchor.y;
      
      animal.sprite.texture = texture;
      const scale = (20 * 2) / (texture.width || 1); // 20 is animal radius
      animal.sprite.scale.set(scale);
      
      animal.sprite.anchor.set(prevAnchorX, prevAnchorY);
      animal.sprite.x = prevX;
      animal.sprite.y = prevY;
    } catch (error) {
      console.error('Failed to switch animal texture:', error);
    }
  }
}
