import { Sprite, Container } from 'pixi.js';
import { Point, AnimalState } from './game';

export { Point, AnimalState };

export interface IUpdatable {
  update(deltaTime: number): void;
}

export interface IRenderable {
  render(): void;
}

export interface IEntity extends IUpdatable, IRenderable {
  destroy(): void;
}

export interface IMovable {
  position: Point;
  velocity: Point;
  speed: number;
  moveTo(target: Point): void;
  stop(): void;
}

export interface IFollowable {
  canFollow(): boolean;
  startFollowing(): void;
  stopFollowing(): void;
}

export interface HeroData {
  sprite: Sprite;
  position: Point;
  target?: Point;
  movementMode: string;
  isDragging: boolean;
  trail: Point[];
}

export interface AnimalData {
  sprite: Sprite;
  state: AnimalState;
  position: Point;
  autoTarget?: Point;
  patrolTarget?: Point;
  followIndex?: number;
}

export interface YardData {
  sprite: Sprite;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  scale: number;
}

export interface BackgroundData {
  sprite: Sprite;
  width: number;
  height: number;
}
