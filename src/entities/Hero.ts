import { Sprite, Container } from 'pixi.js';
import { IEntity, IMovable, HeroData, Point } from '../types/entities';
import { MovementMode } from '../types/game';
import { clamp, distance } from '../utils/math';

export class Hero implements IEntity, IMovable {
  public sprite: Sprite;
  public position: Point;
  public velocity: Point = { x: 0, y: 0 };
  public speed: number;
  public target?: Point;
  public movementMode: MovementMode = 'idle';
  public isDragging: boolean = false;
  public trail: Point[] = [];

  private container: Container;
  private radius: number;
  private screenWidth: number;
  private screenHeight: number;

  constructor(
    sprite: Sprite,
    container: Container,
    radius: number,
    speed: number,
    screenWidth: number,
    screenHeight: number
  ) {
    this.sprite = sprite;
    this.container = container;
    this.radius = radius;
    this.speed = speed;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.position = { x: screenWidth / 2, y: screenHeight / 2 };
    
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  update(deltaTime: number): void {
    this.updateMovement(deltaTime);
    this.updateTrail();
  }

  render(): void {
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
  }

  destroy(): void {
    this.container.removeChild(this.sprite);
    this.sprite.destroy();
  }

  moveTo(target: Point): void {
    this.target = target;
    this.movementMode = 'click';
  }

  stop(): void {
    this.target = undefined;
    this.velocity = { x: 0, y: 0 };
    this.movementMode = 'idle';
  }

  private updateMovement(deltaTime: number): void {
    if (this.movementMode === 'idle') {
      return;
    }

    if (this.target) {
      const dx = this.target.x - this.position.x;
      const dy = this.target.y - this.position.y;
      const dist = distance(0, 0, dx, dy);

      if (dist > 0.001) {
        const step = Math.min(this.speed, dist);
        this.velocity.x = (dx / dist) * step;
        this.velocity.y = (dy / dist) * step;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      } else if (this.movementMode !== 'drag') {
        // Only stop if not dragging - dragging should continue following the cursor
        this.stop();
      }
    }

    this.clampToScreen();
  }

  private updateTrail(): void {
    this.trail.push({ x: this.position.x, y: this.position.y });
    
    const maxTrailLength = 65;
    if (this.trail.length > maxTrailLength) {
      this.trail.shift();
    }
  }

  private clampToScreen(): void {
    this.position.x = clamp(this.position.x, this.radius, this.screenWidth - this.radius);
    this.position.y = clamp(this.position.y, this.radius, this.screenHeight - this.radius);
  }

  getActualSpeed(): number {
    return distance(0, 0, this.velocity.x, this.velocity.y);
  }
}
