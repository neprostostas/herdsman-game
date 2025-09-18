import { ISystem, IInputSystem } from '../types/systems';
import { Hero } from '../entities/Hero';
import { EventBus } from '../core/EventBus';
import { KeyConfig } from '../types/game';

export class InputSystem implements ISystem, IInputSystem {
  public readonly name = 'InputSystem';
  private hero: Hero;
  private eventBus: EventBus;
  private keyConfig: KeyConfig;
  private pressedKeys: Set<string> = new Set();
  private keyDownHandler?: (e: KeyboardEvent) => void;
  private keyUpHandler?: (e: KeyboardEvent) => void;

  constructor(hero: Hero, eventBus: EventBus, keyConfig: KeyConfig) {
    this.hero = hero;
    this.eventBus = eventBus;
    this.keyConfig = keyConfig;
  }

  initialize(): void {
    this.setupEventListeners();
  }

  update(deltaTime: number): void {
    this.updateKeyboardMovement();
  }

  destroy(): void {
    this.removeEventListeners();
  }

  handleKeyDown(key: string): void {
    this.pressedKeys.add(key);
    
    if (this.keyConfig.movement.up.includes(key) ||
        this.keyConfig.movement.down.includes(key) ||
        this.keyConfig.movement.left.includes(key) ||
        this.keyConfig.movement.right.includes(key)) {
      this.hero.movementMode = 'keyboard';
      this.hero.target = undefined;
    }

    if (this.keyConfig.game.pause.includes(key)) {
      this.eventBus.emit('pauseRequested');
    }
  }

  handleKeyUp(key: string): void {
    this.pressedKeys.delete(key);
  }

  handlePointerDown(x: number, y: number): void {
    if (this.hero.movementMode === 'keyboard') return;
    
    this.hero.movementMode = 'drag';
    this.hero.isDragging = true;
    this.hero.target = { x, y };
  }

  handlePointerMove(x: number, y: number): void {
    if (this.hero.movementMode !== 'drag' || !this.hero.isDragging) return;
    
    this.hero.target = { x, y };
  }

  handlePointerUp(): void {
    this.hero.isDragging = false;
    if (this.hero.movementMode === 'drag') {
      this.hero.movementMode = 'idle';
      this.hero.target = undefined;
    }
  }

  handlePointerTap(x: number, y: number): void {
    if (this.hero.movementMode === 'keyboard' || this.hero.isDragging) return;
    
    this.hero.movementMode = 'click';
    this.hero.target = { x, y };
  }

  private setupEventListeners(): void {
    this.keyDownHandler = (e: KeyboardEvent) => this.handleKeyDown(e.code);
    this.keyUpHandler = (e: KeyboardEvent) => this.handleKeyUp(e.code);
    
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  private removeEventListeners(): void {
    if (this.keyDownHandler) {
      window.removeEventListener('keydown', this.keyDownHandler);
    }
    if (this.keyUpHandler) {
      window.removeEventListener('keyup', this.keyUpHandler);
    }
  }

  private updateKeyboardMovement(): void {
    if (this.hero.movementMode !== 'keyboard') return;

    let dx = 0;
    let dy = 0;

    for (const key of this.pressedKeys) {
      if (this.keyConfig.movement.up.includes(key)) dy -= 1;
      if (this.keyConfig.movement.down.includes(key)) dy += 1;
      if (this.keyConfig.movement.left.includes(key)) dx -= 1;
      if (this.keyConfig.movement.right.includes(key)) dx += 1;
    }

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      this.hero.position.x += (dx / length) * this.hero.speed;
      this.hero.position.y += (dy / length) * this.hero.speed;
    }
  }
}
