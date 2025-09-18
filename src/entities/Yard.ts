import { Sprite, Container } from 'pixi.js';
import { IEntity, YardData, Bounds } from '../types/entities';
import { createBounds } from '../utils/geometry';

export class Yard implements IEntity {
  public sprite: Sprite;
  public bounds: Bounds;
  public scale: number;

  private container: Container;
  private screenWidth: number;
  private screenHeight: number;
  private heightPercentage: number;
  private margin: number;

  constructor(
    sprite: Sprite,
    container: Container,
    screenWidth: number,
    screenHeight: number,
    heightPercentage: number,
    margin: number
  ) {
    this.sprite = sprite;
    this.container = container;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.heightPercentage = heightPercentage;
    this.margin = margin;
    this.scale = 1;

    this.calculateScale();
    this.updatePosition();
    this.updateBounds();
  }

  update(deltaTime: number): void {
    // Yard doesn't need updates
  }

  render(): void {
    // Position is set in constructor and updatePosition
  }

  destroy(): void {
    this.container.removeChild(this.sprite);
    this.sprite.destroy();
  }

  private calculateScale(): void {
    const targetHeight = (this.screenHeight * this.heightPercentage) / 100;
    const baseScale = targetHeight / (this.sprite.texture.height || 1);
    const scaledWidth = (this.sprite.texture.width || 1) * baseScale;
    const maxWidth = this.screenWidth - this.margin;

    if (scaledWidth > maxWidth) {
      this.scale = maxWidth / (this.sprite.texture.width || 1);
    } else {
      this.scale = baseScale;
    }

    this.sprite.scale.set(this.scale);
  }

  private updatePosition(): void {
    this.sprite.x = this.screenWidth / 2;
    this.sprite.y = this.screenHeight;
  }

  private updateBounds(): void {
    const centerX = this.sprite.x;
    const bottom = this.sprite.y;
    const width = this.sprite.width;
    const height = this.sprite.height;

    this.bounds = createBounds(
      centerX - width / 2,
      bottom - height,
      centerX + width / 2,
      bottom
    );
  }

  getBoundsWithBuffer(buffer: number): Bounds {
    return createBounds(
      this.bounds.left - buffer,
      this.bounds.top - buffer,
      this.bounds.right + buffer,
      this.bounds.bottom + buffer
    );
  }

  isPointInYard(x: number, y: number): boolean {
    return (
      x >= this.bounds.left &&
      x <= this.bounds.right &&
      y >= this.bounds.top &&
      y <= this.bounds.bottom
    );
  }

  getCenter(): { x: number; y: number } {
    return {
      x: (this.bounds.left + this.bounds.right) / 2,
      y: (this.bounds.top + this.bounds.bottom) / 2,
    };
  }
}
