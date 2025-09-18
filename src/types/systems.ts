import { IUpdatable } from './entities';

export interface ISystem extends IUpdatable {
  readonly name: string;
  initialize(): void;
  destroy(): void;
}

export interface IInputSystem extends ISystem {
  handleKeyDown(key: string): void;
  handleKeyUp(key: string): void;
  handlePointerDown(x: number, y: number): void;
  handlePointerMove(x: number, y: number): void;
  handlePointerUp(): void;
  handlePointerTap(x: number, y: number): void;
}

export interface IMovementSystem extends ISystem {
  updateMovement(deltaTime: number): void;
}

export interface ICollisionSystem extends ISystem {
  checkCollisions(): void;
}

export interface ISpawnSystem extends ISystem {
  spawnEntities(): void;
  despawnEntities(): void;
}

export interface IScoreSystem extends ISystem {
  addScore(points: number): void;
  getScore(): number;
  resetScore(): void;
}

export interface IResizeSystem extends ISystem {
  handleResize(): void;
}

export interface IPauseSystem extends ISystem {
  pause(): void;
  resume(): void;
  isPaused(): boolean;
}
