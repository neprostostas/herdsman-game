import { Container, Sprite, Rectangle } from 'pixi.js';
import { App } from './App';
import { Clock } from './Clock';
import { EventBus } from './EventBus';
import { DIContainer } from './Container';
import { GameState } from '../types/game';
import { Logger, LogLevel } from '../services/Logger';
import { StorageService } from '../services/StorageService';
import { AssetService } from '../services/AssetService';
import { I18nService } from '../services/I18nService';
import { ConfigService } from '../services/ConfigService';
import { Hero } from '../entities/Hero';
import { Animal } from '../entities/Animal';
import { Yard } from '../entities/Yard';
import { Background } from '../entities/Background';
import { FollowSystem } from '../systems/FollowSystem';
import { AutoDeliverSystem } from '../systems/AutoDeliverSystem';
import { PatrolSystem } from '../systems/PatrolSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { InputSystem } from '../systems/InputSystem';
import { HUD } from '../ui/HUD';
import { StartOverlay } from '../ui/StartOverlay';
import { PauseModal } from '../ui/PauseModal';
import { CompletionModal } from '../ui/CompletionModal';
import { LanguageSelector } from '../ui/LanguageSelector';

export class Game {
  private app: App;
  private gameContainer: Container;
  private systems: any[] = [];
  private entities: any[] = [];
  private ui: any[] = [];
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private gameStartTime: number = 0;
  private gameEndTime: number = 0;
  private totalTargetAnimals: number = 0;
  private deliveredCount: number = 0;

  constructor() {
    this.app = new App();
    this.gameContainer = new Container();
  }

  async initialize(): Promise<void> {
    await this.app.initialize();
    this.app.pixi.stage.addChild(this.gameContainer);
    
    this.setupBasicServices();
    await this.loadConfigs();
    this.setupConfigDependentServices();
    await this.loadAssets();
    this.setupUI();
    this.setupEventListeners();
    
    // Create entities immediately so the scene is visible
    this.createEntities();
  }

  private setupBasicServices(): void {
    const logger = new Logger(LogLevel.INFO);
    const storage = new StorageService();
    const config = new ConfigService(logger);
    const assets = new AssetService(logger);

    this.app.container.register('logger', logger);
    this.app.container.register('storage', storage);
    this.app.container.register('config', config);
    this.app.container.register('assets', assets);
  }

  private setupConfigDependentServices(): void {
    const config = this.app.container.get<ConfigService>('config');
    const storage = this.app.container.get<StorageService>('storage');
    const logger = this.app.container.get<Logger>('logger');
    
    const i18n = new I18nService(config.getI18nConfig(), storage, logger);
    this.app.container.register('i18n', i18n);
  }

  private async loadConfigs(): Promise<void> {
    const config = this.app.container.get<ConfigService>('config');
    await config.loadConfigs();
  }

  private async loadAssets(): Promise<void> {
    const config = this.app.container.get<ConfigService>('config');
    const assets = this.app.container.get<AssetService>('assets');
    await assets.loadAssets(config.getAssetConfig());
  }

  private setupUI(): void {
    const i18n = this.app.container.get<I18nService>('i18n');
    const storage = this.app.container.get<StorageService>('storage');
    const config = this.app.container.get<ConfigService>('config');
    const gameConfig = config.getGameConfig();

    const hud = new HUD(this.gameContainer, i18n, gameConfig.ui.scoreFontSize);
    const startOverlay = new StartOverlay(i18n);
    const pauseModal = new PauseModal(i18n);
    const completionModal = new CompletionModal(i18n, storage);
    const languageSelector = new LanguageSelector(i18n);

    // Position HUD
    hud.setPosition(
      (this.app.pixi.screen.width * gameConfig.ui.scorePosition.x) / 100,
      (this.app.pixi.screen.height * gameConfig.ui.scorePosition.y) / 100
    );

    this.ui.push(hud, startOverlay, pauseModal, completionModal, languageSelector);

    startOverlay.onStart(() => this.startGame());
    pauseModal.onResume(() => this.resumeGame());
    completionModal.onPlayAgain(() => this.resetGame());

    this.setupLanguageChangeHandler();
  }

  private setupLanguageChangeHandler(): void {
    const i18n = this.app.container.get<I18nService>('i18n');
    i18n.onLanguageChange(() => {
      this.ui.forEach(ui => {
        if (ui.updateLanguage) {
          ui.updateLanguage();
        }
      });
      // Update pause button text when language changes
      this.updatePauseButtonText();
    });
  }

  private setupEventListeners(): void {
    this.app.eventBus.on('stateChanged', (newState: GameState) => {
      this.handleStateChange(newState);
    });

    this.app.eventBus.on('pauseRequested', () => {
      if (this.isRunning && !this.isPaused) {
        this.pauseGame();
      } else if (this.isPaused) {
        this.resumeGame();
      }
    });

    this.app.eventBus.on('scoreChanged', (score: number) => {
      const hud = this.ui.find(ui => ui instanceof HUD);
      if (hud) {
        hud.updateScore(score);
      }
    });

    this.app.eventBus.on('animalDelivered', (animal: Animal) => {
      this.deliveredCount++;
      console.log(`Animal delivered! Score: +1, Delivered: ${this.deliveredCount}/${this.totalTargetAnimals}`);
      this.checkWinCondition();
    });

    // Setup pause button click handler
    this.setupPauseButtonHandler();
  }

  private setupPauseButtonHandler(): void {
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.app.eventBus.emit('pauseRequested');
      });
    }
  }

  private handleStateChange(newState: GameState): void {
    switch (newState) {
      case 'boot':
        this.showStartOverlay();
        this.showLanguageSelector();
        this.showHUD(); // Always show HUD
        break;
      case 'running':
        this.hideAllOverlays();
        this.showPauseButton();
        this.showLanguageSelector(); // Always show language selector
        this.showHUD(); // Always show HUD
        break;
      case 'paused':
        this.showPauseModal();
        this.showLanguageSelector(); // Always show language selector
        this.showHUD(); // Always show HUD
        break;
      case 'completed':
        this.showCompletionModal();
        this.showLanguageSelector(); // Always show language selector
        this.showHUD(); // Always show HUD
        break;
    }
  }

  private showStartOverlay(): void {
    const startOverlay = this.ui.find(ui => ui instanceof StartOverlay);
    if (startOverlay) {
      startOverlay.show();
    }
  }

  private hideAllOverlays(): void {
    this.ui.forEach(ui => {
      // Don't hide language selector or HUD - they should always be visible
      if (ui.hide && !(ui instanceof LanguageSelector) && !(ui instanceof HUD)) {
        ui.hide();
      }
    });
  }

  private showPauseModal(): void {
    const pauseModal = this.ui.find(ui => ui instanceof PauseModal);
    if (pauseModal) {
      pauseModal.show();
    }
  }

  private showCompletionModal(): void {
    const completionModal = this.ui.find(ui => ui instanceof CompletionModal);
    if (completionModal) {
      const currentTime = this.gameEndTime - this.gameStartTime;
      completionModal.setTimeStats(currentTime);
      completionModal.show();
    }
  }

  private showLanguageSelector(): void {
    const languageSelector = this.ui.find(ui => ui instanceof LanguageSelector);
    if (languageSelector) {
      languageSelector.show();
    }
  }

  private showPauseButton(): void {
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.style.display = 'block';
    }
  }

  private showHUD(): void {
    const hud = this.ui.find(ui => ui instanceof HUD);
    if (hud) {
      hud.show();
    }
  }

  private startGame(): void {
    // Entities are already created during initialization
    this.createSystems();
    this.gameStartTime = Date.now();
    this.isRunning = true;
    this.isPaused = false;
    this.app.setState('running');
    this.startGameLoop();
  }

  private createEntities(): void {
    const config = this.app.container.get<ConfigService>('config');
    const assets = this.app.container.get<AssetService>('assets');
    const gameConfig = config.getGameConfig();

    const heroTexture = assets.getTexture('hero');
    const animalTexture = assets.getTexture('animal');
    const animalOnTexture = assets.getTexture('animalOn');
    const paddockTexture = assets.getTexture('paddock');
    const backgroundTexture = assets.getTexture('background');

    const heroSprite = new Sprite(heroTexture);
    heroSprite.anchor.set(0.5);
    const heroScale = (gameConfig.hero.radius * 2) / (heroTexture.width || 1);
    heroSprite.scale.set(heroScale);

    const backgroundSprite = new Sprite(backgroundTexture);
    const yardSprite = new Sprite(paddockTexture);
    yardSprite.anchor.set(0.5, 1);

    const hero = new Hero(
      heroSprite,
      this.gameContainer,
      gameConfig.hero.radius,
      gameConfig.hero.speed,
      this.app.pixi.screen.width,
      this.app.pixi.screen.height
    );

    const background = new Background(
      backgroundSprite,
      this.gameContainer,
      this.app.pixi.screen.width,
      this.app.pixi.screen.height
    );

    const yard = new Yard(
      yardSprite,
      this.gameContainer,
      this.app.pixi.screen.width,
      this.app.pixi.screen.height,
      gameConfig.yard.heightPercentage,
      gameConfig.yard.margin
    );

    this.entities.push(hero, background, yard);
    this.gameContainer.addChildAt(backgroundSprite, 0);
    this.gameContainer.addChild(heroSprite);
    this.gameContainer.addChild(yardSprite);

    this.spawnAnimals(animalTexture, animalOnTexture, gameConfig);
  }

  private spawnAnimals(animalTexture: any, animalOnTexture: any, gameConfig: any): void {
    const animals: Animal[] = [];
    
    for (let i = 0; i < gameConfig.animal.count; i++) {
      const animalSprite = new Sprite(animalTexture);
      animalSprite.anchor.set(0.5);
      const animalScale = (gameConfig.animal.radius * 2) / (animalTexture.width || 1);
      animalSprite.scale.set(animalScale);

      const position = this.findValidSpawnPosition();
      const animal = new Animal(
        animalSprite,
        this.gameContainer,
        position,
        gameConfig.animal.radius,
        gameConfig.animal.patrolSpeed,
        gameConfig.animal.followSpeed,
        gameConfig.animal.autoDeliverSpeed
      );

      animals.push(animal);
      this.gameContainer.addChild(animalSprite);
    }

    this.entities.push(...animals);
    this.totalTargetAnimals = gameConfig.animal.count;
    console.log(`Game started with ${this.totalTargetAnimals} animals to deliver`);
  }

  private findValidSpawnPosition(): { x: number; y: number } {
    const config = this.app.container.get<ConfigService>('config');
    const gameConfig = config.getGameConfig();
    const minDistance = gameConfig.animal.minSpawnDistance;
    
    let attempts = 0;
    let position: { x: number; y: number };
    
    do {
      position = {
        x: Math.random() * this.app.pixi.screen.width,
        y: Math.random() * this.app.pixi.screen.height,
      };
      attempts++;
    } while (!this.isValidSpawnPosition(position, minDistance) && attempts < 100);

    return position;
  }

  private isValidSpawnPosition(position: { x: number; y: number }, minDistance: number): boolean {
    const hero = this.entities.find(e => e instanceof Hero);
    if (hero && this.distance(position.x, position.y, hero.position.x, hero.position.y) < minDistance) {
      return false;
    }

    const yard = this.entities.find(e => e instanceof Yard);
    if (yard && yard.isPointInYard(position.x, position.y)) {
      return false;
    }

    return true;
  }

  private distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  private createSystems(): void {
    const config = this.app.container.get<ConfigService>('config');
    const assets = this.app.container.get<AssetService>('assets');
    const gameConfig = config.getGameConfig();
    const keyConfig = config.getKeyConfig();

    const hero = this.entities.find(e => e instanceof Hero);
    const animals = this.entities.filter(e => e instanceof Animal);
    const yard = this.entities.find(e => e instanceof Yard);

    if (!hero || !yard) {
      throw new Error('Required entities not found');
    }

    const followSystem = new FollowSystem(
      hero,
      animals,
      gameConfig.hero.followTriggerDistance,
      gameConfig.hero.maxFollowers,
      gameConfig.performance.lagFramesPerFollower,
      assets
    );

    const autoDeliverSystem = new AutoDeliverSystem(
      hero,
      animals,
      yard,
      gameConfig.hero.radius,
      gameConfig.animal.autoDeliverSpeed
    );

    const patrolSystem = new PatrolSystem(
      animals,
      yard,
      this.app.pixi.screen.width,
      this.app.pixi.screen.height,
      gameConfig.animal.minSpawnDistance,
      12
    );

    const collisionSystem = new CollisionSystem(
      animals,
      yard,
      (animal: Animal) => {
        this.app.eventBus.emit('animalDelivered', animal);
        this.removeAnimal(animal);
      }
    );

    const scoreSystem = new ScoreSystem(this.app.eventBus);
    const inputSystem = new InputSystem(hero, this.app.eventBus, keyConfig);

    this.systems.push(
      followSystem,
      autoDeliverSystem,
      patrolSystem,
      collisionSystem,
      scoreSystem,
      inputSystem
    );

    this.systems.forEach(system => system.initialize());
    
    // Setup PixiJS stage events for input
    this.setupPixiInputEvents(inputSystem);
  }

  private setupPixiInputEvents(inputSystem: InputSystem): void {
    const stage = this.app.pixi.stage;
    stage.eventMode = 'static';
    stage.hitArea = new Rectangle(0, 0, this.app.pixi.screen.width, this.app.pixi.screen.height);

    stage.on('pointerdown', (event) => {
      if (!this.isRunning) return;
      inputSystem.handlePointerDown(event.global.x, event.global.y);
    });

    stage.on('pointermove', (event) => {
      if (!this.isRunning) return;
      inputSystem.handlePointerMove(event.global.x, event.global.y);
    });

    stage.on('pointerup', () => {
      if (!this.isRunning) return;
      inputSystem.handlePointerUp();
    });

    stage.on('pointerupoutside', () => {
      if (!this.isRunning) return;
      inputSystem.handlePointerUp();
    });

    stage.on('pointertap', (event) => {
      if (!this.isRunning) return;
      inputSystem.handlePointerTap(event.global.x, event.global.y);
    });
  }

  private removeAnimal(animal: Animal): void {
    const index = this.entities.indexOf(animal);
    if (index > -1) {
      this.entities.splice(index, 1);
      animal.destroy();
    }
  }

  private startGameLoop(): void {
    const gameLoop = () => {
      if (!this.isRunning) return;

      const deltaTime = this.app.clock.update();
      
      if (!this.isPaused) {
        this.update(deltaTime);
      }

      this.render();
      requestAnimationFrame(gameLoop);
    };

    this.app.clock.start();
    gameLoop();
  }

  private update(deltaTime: number): void {
    this.entities.forEach(entity => entity.update(deltaTime));
    this.systems.forEach(system => system.update(deltaTime));
  }

  private render(): void {
    this.entities.forEach(entity => entity.render());
  }

  private pauseGame(): void {
    this.isPaused = true;
    this.app.setState('paused');
    this.updatePauseButtonText();
  }

  private resumeGame(): void {
    this.isPaused = false;
    this.app.setState('running');
    this.updatePauseButtonText();
  }

  private updatePauseButtonText(): void {
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      const i18n = this.app.container.get<I18nService>('i18n');
      pauseBtn.textContent = this.isPaused ? i18n.translate('resume') : i18n.translate('pause');
    }
  }

  private checkWinCondition(): void {
    // Game ends when all animals have been delivered (deliveredCount equals total animals spawned)
    if (this.deliveredCount >= this.totalTargetAnimals) {
      console.log(`Game completed! All ${this.totalTargetAnimals} animals delivered.`);
      this.gameEndTime = Date.now();
      this.isRunning = false;
      this.app.setState('completed');
    }
  }

  private resetGame(): void {
    console.log('Resetting game...');
    this.isRunning = false;
    this.isPaused = false;
    this.deliveredCount = 0;
    
    // Hide completion modal
    const completionModal = this.ui.find(ui => ui instanceof CompletionModal);
    if (completionModal) {
      completionModal.hide();
    }
    
    // Reset score through ScoreSystem
    const scoreSystem = this.systems.find(system => system.name === 'ScoreSystem');
    if (scoreSystem && 'resetScore' in scoreSystem) {
      (scoreSystem as any).resetScore();
    }
    
    // Clean up all entities and systems
    this.entities.forEach(entity => entity.destroy());
    this.entities.length = 0;
    
    this.systems.forEach(system => system.destroy());
    this.systems.length = 0;

    // Hide pause button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.style.display = 'none';
    }

    // Recreate entities for the new game
    this.createEntities();
    
    // Recompute totalTargetAnimals for the new game
    this.totalTargetAnimals = this.entities.filter(e => e instanceof Animal).length;
    console.log(`Game reset complete. Total target animals: ${this.totalTargetAnimals}`);

    this.app.setState('boot');
  }

  destroy(): void {
    this.isRunning = false;
    this.entities.forEach(entity => entity.destroy());
    this.systems.forEach(system => system.destroy());
    this.ui.forEach(ui => ui.destroy());
    this.app.destroy();
  }
}
