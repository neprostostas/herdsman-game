import { Sprite, Container } from 'pixi.js';
import { IEntity, BackgroundData } from '../types/entities';

export class Background implements IEntity {
  public sprite: Sprite;
  public width: number;
  public height: number;

  private container: Container;

  constructor(sprite: Sprite, container: Container, width: number, height: number) {
    this.sprite = sprite;
    this.container = container;
    this.width = width;
    this.height = height;

    this.sprite.anchor.set(0, 0);
    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.width = width;
    this.sprite.height = height;
  }

  update(deltaTime: number): void {
    // Background doesn't need updates
  }

  render(): void {
    // Background is static
  }

  destroy(): void {
    this.container.removeChild(this.sprite);
    this.sprite.destroy();
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.sprite.width = width;
    this.sprite.height = height;
  }
}
