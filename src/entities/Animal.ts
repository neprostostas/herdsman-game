import { Sprite, Container } from 'pixi.js';
import { IEntity, AnimalData, Point } from '../types/entities';
import { AnimalState } from '../types/game';
import { distance, normalize } from '../utils/math';

export class Animal implements IEntity {
  public sprite: Sprite;
  public state: AnimalState = 'idle';
  public position: Point;
  public autoTarget?: Point;
  public patrolTarget?: Point;
  public followIndex?: number;
  public isDelivered: boolean = false;

  private container: Container;
  private radius: number;
  private patrolSpeed: number;
  private followSpeed: number;
  private autoDeliverSpeed: number;

  constructor(
    sprite: Sprite,
    container: Container,
    position: Point,
    radius: number,
    patrolSpeed: number,
    followSpeed: number,
    autoDeliverSpeed: number
  ) {
    this.sprite = sprite;
    this.container = container;
    this.position = position;
    this.radius = radius;
    this.patrolSpeed = patrolSpeed;
    this.followSpeed = followSpeed;
    this.autoDeliverSpeed = autoDeliverSpeed;

    this.sprite.x = position.x;
    this.sprite.y = position.y;
  }

  update(deltaTime: number): void {
    this.updateMovement(deltaTime);
  }

  render(): void {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  destroy(): void {
    this.container.removeChild(this.sprite);
    this.sprite.destroy();
  }

  private updateMovement(deltaTime: number): void {
    switch (this.state) {
      case 'idle':
        this.updatePatrol();
        break;
      case 'following':
        this.updateFollowing();
        break;
      case 'autoDeliver':
        this.updateAutoDeliver();
        break;
    }
  }

  private updatePatrol(): void {
    if (!this.patrolTarget) {
      return;
    }

    const dx = this.patrolTarget.x - this.position.x;
    const dy = this.patrolTarget.y - this.position.y;
    const dist = distance(0, 0, dx, dy);

    if (dist < 4) {
      this.patrolTarget = undefined;
      return;
    }

    const normalized = normalize(dx, dy);
    const step = Math.min(this.patrolSpeed, dist);
    
    this.position.x += normalized.x * step;
    this.position.y += normalized.y * step;
  }

  private updateFollowing(): void {
    // Following logic is handled by FollowSystem
    // This is just a placeholder for future expansion
  }

  private updateAutoDeliver(): void {
    if (!this.autoTarget) {
      return;
    }

    const dx = this.autoTarget.x - this.position.x;
    const dy = this.autoTarget.y - this.position.y;
    const dist = distance(0, 0, dx, dy);

    if (dist < 4) {
      return;
    }

    const normalized = normalize(dx, dy);
    const step = Math.min(this.autoDeliverSpeed, dist);
    
    this.position.x += normalized.x * step;
    this.position.y += normalized.y * step;
  }

  setState(newState: AnimalState): void {
    this.state = newState;
    
    if (newState === 'idle') {
      this.patrolTarget = undefined;
      this.autoTarget = undefined;
    } else if (newState === 'autoDeliver') {
      this.patrolTarget = undefined;
    }
  }

  setPatrolTarget(target: Point): void {
    this.patrolTarget = target;
  }

  setAutoTarget(target: Point): void {
    this.autoTarget = target;
  }
}
