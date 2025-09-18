import { Application } from 'pixi.js';
import { Clock } from './Clock';
import { EventBus } from './EventBus';
import { DIContainer } from './Container';
import { GameState } from '../types/game';

export class App {
  public readonly pixi: Application;
  public readonly clock: Clock;
  public readonly eventBus: EventBus;
  public readonly container: DIContainer;
  
  private _state: GameState = 'boot';
  private _isInitialized: boolean = false;

  constructor() {
    this.pixi = new Application();
    this.clock = new Clock();
    this.eventBus = new EventBus();
    this.container = new DIContainer();
  }

  async initialize(): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    await this.pixi.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    });

    document.body.appendChild(this.pixi.canvas);
    this._isInitialized = true;
    this.setState('boot');
  }

  get state(): GameState {
    return this._state;
  }

  setState(newState: GameState): void {
    const oldState = this._state;
    this._state = newState;
    this.eventBus.emit('stateChanged', newState, oldState);
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  destroy(): void {
    this.clock.stop();
    this.eventBus.clear();
    this.container.clear();
    this.pixi.destroy(true, { children: true });
  }
}
