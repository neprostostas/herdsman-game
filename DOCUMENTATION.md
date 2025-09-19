# 🎮 Herdsman Game - Complete Developer Documentation

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture](#-architecture)
3. [Project Structure](#-project-structure)
4. [Core Systems](#-core-systems)
5. [Entities](#-entities)
6. [Systems](#-systems)
7. [UI Components](#-ui-components)
8. [Services](#-services)
9. [Configuration](#-configuration)
10. [Types & Interfaces](#-types--interfaces)
11. [Utilities](#-utilities)
12. [Build & Development](#-build--development)
13. [Testing](#-testing)
14. [API Reference](#-api-reference)

---

## 🎯 Project Overview

**Herdsman Game** is a modern web-based game built with **TypeScript** and **PixiJS**. The game features a hero character that must collect and deliver animals to a designated yard area. The project follows clean architecture principles with modular design, dependency injection, and comprehensive internationalization support.

### **Key Features:**
- 🎮 **Interactive Gameplay**: Click/drag hero movement, animal collection mechanics
- 🌍 **Multi-language Support**: English, Ukrainian, Spanish, Polish
- 📱 **Responsive Design**: Adapts to different screen sizes
- 🎨 **Modern UI**: Smooth animations and professional interface
- 🏗️ **Clean Architecture**: SOLID principles, modular design
- ⚡ **Performance Optimized**: Efficient rendering and memory management

### **Technology Stack:**
- **Frontend**: TypeScript, PixiJS, HTML5, CSS3
- **Build Tool**: Vite
- **Testing**: Vitest
- **Architecture**: Clean Architecture, Dependency Injection

---

## 🏗️ Architecture

The project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │    UI       │ │  Entities   │ │      Systems        │    │
│  │ Components  │ │             │ │                     │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │    Game     │ │    App      │ │     EventBus        │    │
│  │ Controller  │ │  Bootstrap  │ │                     │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │   Services  │ │    Types    │ │     Utilities       │    │
│  │             │ │             │ │                     │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│  │   PixiJS    │ │  Storage    │ │      Config         │    │
│  │  Renderer   │ │             │ │                     │    │
│  └─────────────┘ └─────────────┘ └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### **Design Patterns Used:**
- **Dependency Injection**: Centralized service management
- **Observer Pattern**: Event-driven communication
- **State Pattern**: Game state management
- **Strategy Pattern**: Different movement modes
- **Factory Pattern**: Entity creation
- **Command Pattern**: Input handling

---

## 📁 Project Structure

```
herdsman-game/
├── 📁 src/                          # Source code directory
│   ├── 📁 core/                     # Core application logic
│   │   ├── App.ts                   # Main application bootstrap
│   │   ├── Game.ts                  # Game controller and orchestration
│   │   ├── Clock.ts                 # Game timing and ticker
│   │   ├── EventBus.ts              # Event system for communication
│   │   └── Container.ts             # Dependency injection container
│   │
│   ├── 📁 entities/                 # Game entities (objects)
│   │   ├── Hero.ts                  # Player character
│   │   ├── Animal.ts                # Collectible animals
│   │   ├── Yard.ts                  # Delivery target area
│   │   └── Background.ts            # Game background
│   │
│   ├── 📁 systems/                  # Game logic systems
│   │   ├── InputSystem.ts           # Input handling (keyboard/mouse)
│   │   ├── FollowSystem.ts          # Animal following logic
│   │   ├── PatrolSystem.ts          # Animal patrol behavior
│   │   ├── AutoDeliverSystem.ts     # Automatic delivery system
│   │   ├── CollisionSystem.ts       # Collision detection
│   │   └── ScoreSystem.ts           # Score management
│   │
│   ├── 📁 ui/                       # User interface components
│   │   ├── HUD.ts                   # Heads-up display (score)
│   │   ├── StartOverlay.ts          # Game start screen
│   │   ├── PauseModal.ts            # Pause menu with fun facts
│   │   ├── CompletionModal.ts       # Game completion screen
│   │   └── LanguageSelector.ts      # Language switching
│   │
│   ├── 📁 services/                 # Application services
│   │   ├── AssetService.ts          # Asset loading and caching
│   │   ├── ConfigService.ts         # Configuration management
│   │   ├── I18nService.ts           # Internationalization
│   │   ├── Logger.ts                # Logging system
│   │   └── StorageService.ts        # Local storage management
│   │
│   ├── 📁 types/                    # TypeScript type definitions
│   │   ├── game.ts                  # Game-specific types
│   │   ├── entities.ts              # Entity interfaces
│   │   ├── systems.ts               # System interfaces
│   │   ├── ui.ts                    # UI component interfaces
│   │   ├── i18n.ts                  # Internationalization types
│   │   ├── config.ts                # Configuration types
│   │   └── index.ts                 # Type exports
│   │
│   ├── 📁 config/                   # Configuration files
│   │   ├── game.json                # Game parameters
│   │   ├── assets.json              # Asset file mappings
│   │   ├── i18n.json                # Translation strings
│   │   ├── levels.json              # Level definitions
│   │   └── keys.json                # Key bindings
│   │
│   ├── 📁 utils/                    # Utility functions
│   │   ├── math.ts                  # Mathematical utilities
│   │   ├── geometry.ts              # Geometry calculations
│   │   └── throttle.ts              # Function throttling
│   │
│   ├── 📁 styles/                   # Styling
│   │   └── main.css                 # Main stylesheet
│   │
│   ├── main.ts                      # Application entry point
│   └── i18n.ts                      # i18n configuration
│
├── 📁 tests/                        # Test files
│   ├── setup.ts                     # Test configuration
│   └── 📁 utils/                    # Utility tests
│       └── math.test.ts             # Math utility tests
│
├── 📁 public/                       # Static assets
│   ├── 📁 assets/                   # Game assets
│   │   ├── hero.png                 # Hero character sprite
│   │   ├── animal.png               # Animal sprite
│   │   ├── animal-on.png            # Animal following sprite
│   │   ├── paddock.png              # Yard/paddock sprite
│   │   ├── bg.png                   # Background image
│   │   └── favicon.ico              # Site icon
│   └── 📁 fonts/                    # Font files
│
├── 📄 package.json                  # Project dependencies and scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 vite.config.ts                # Vite build configuration
├── 📄 vitest.config.ts              # Vitest test configuration
├── 📄 index.html                    # Main HTML file
├── 📄 manifest.json                 # PWA manifest
└── 📄 README.md                     # Project readme
```

---

## ⚙️ Core Systems

### 🎮 **App.ts** - Application Bootstrap
The main application class that initializes the PixiJS renderer and core services.

```typescript
export class App {
  public readonly pixi: Application;        // PixiJS application instance
  public readonly clock: Clock;             // Game timing system
  public readonly eventBus: EventBus;       // Event communication system
  public readonly container: DIContainer;   // Dependency injection container
  
  private _state: GameState = 'boot';       // Current application state
  private _isInitialized: boolean = false;  // Initialization flag
}
```

**Key Methods:**
- `initialize()`: Sets up PixiJS renderer and core services
- `setState()`: Manages application state transitions
- `destroy()`: Cleans up resources and event listeners

### 🎯 **Game.ts** - Game Controller
The central orchestrator that manages the game loop, entities, systems, and UI.

```typescript
export class Game {
  private app: App;                    // Application instance
  private gameContainer: Container;    // Main game scene container
  private systems: any[] = [];         // Active game systems
  private entities: any[] = [];        // Game entities
  private ui: any[] = [];              // UI components
  private isRunning: boolean = false;  // Game loop state
  private isPaused: boolean = false;   // Pause state
}
```

**Key Responsibilities:**
- **Game Loop Management**: Controls the main game update cycle
- **Entity Management**: Creates, updates, and destroys game objects
- **System Coordination**: Manages all game systems and their interactions
- **UI Orchestration**: Handles user interface state and interactions
- **State Management**: Manages game states (boot, running, paused, completed)

### ⏰ **Clock.ts** - Timing System
Provides precise timing for the game loop and animations.

```typescript
export class Clock {
  private _deltaTime: number = 0;      // Time since last frame
  private _elapsedTime: number = 0;    // Total elapsed time
  private _lastTime: number = 0;       // Last frame timestamp
  private _isRunning: boolean = false; // Clock state
}
```

**Features:**
- **Delta Time Calculation**: Provides frame-independent timing
- **Elapsed Time Tracking**: Tracks total game time
- **Performance Monitoring**: Measures frame rate and performance

### 📡 **EventBus.ts** - Event System
Implements the Observer pattern for decoupled communication between components.

```typescript
export class EventBus {
  private listeners: Map<string, Function[]> = new Map();
  
  emit(event: string, ...args: any[]): void;     // Emit events
  on(event: string, callback: Function): void;   // Subscribe to events
  off(event: string, callback: Function): void;  // Unsubscribe from events
  clear(): void;                                 // Clear all listeners
}
```

**Event Types:**
- `stateChanged`: Game state transitions
- `animalDelivered`: Animal delivery events
- `scoreChanged`: Score update events
- `pauseRequested`: Pause button clicks
- `resumeRequested`: Resume button clicks

### 🏗️ **Container.ts** - Dependency Injection
Manages service dependencies and provides a centralized registry.

```typescript
export class DIContainer {
  private services: Map<string, any> = new Map();
  
  register<T>(name: string, service: T): void;  // Register service
  get<T>(name: string): T;                      // Get service instance
  has(name: string): boolean;                   // Check if service exists
  clear(): void;                                // Clear all services
}
```

**Registered Services:**
- `logger`: Logging service
- `storage`: Local storage service
- `assets`: Asset loading service
- `i18n`: Internationalization service
- `config`: Configuration service

---

## 🎭 Entities

Entities represent the game objects that exist in the game world.

### 🦸 **Hero.ts** - Player Character
The main character controlled by the player.

```typescript
export class Hero implements IEntity, IMovable {
  public sprite: Sprite;                    // PixiJS sprite
  public position: Point;                   // Current position
  public velocity: Point;                   // Movement velocity
  public target: Point | null;              // Movement target
  public movementMode: MovementMode;        // Current movement mode
  public isDragging: boolean;               // Drag state
  public trail: Point[];                    // Movement trail
}
```

**Movement Modes:**
- `idle`: Not moving
- `click`: Moving to clicked position
- `drag`: Following mouse cursor
- `keyboard`: Moving with keyboard input

**Key Methods:**
- `moveTo(x, y)`: Move to specific coordinates
- `stop()`: Stop movement
- `updateMovement()`: Update position based on current mode
- `clampToScreen()`: Keep hero within screen bounds

### 🐑 **Animal.ts** - Collectible Animals
Animals that can be collected and delivered to the yard.

```typescript
export class Animal implements IEntity {
  public sprite: Sprite;                    // PixiJS sprite
  public position: Point;                   // Current position
  public velocity: Point;                   // Movement velocity
  public state: AnimalState;                // Current state
  public patrolTarget: Point | null;        // Patrol destination
  public autoTarget: Point | null;          // Auto-delivery target
  public isDelivered: boolean;              // Delivery status
}
```

**Animal States:**
- `idle`: Not following, patrolling
- `following`: Following the hero
- `autoDeliver`: Automatically moving to yard

**Key Methods:**
- `setState()`: Change animal behavior state
- `setPatrolTarget()`: Set patrol destination
- `setAutoTarget()`: Set auto-delivery target

### 🏠 **Yard.ts** - Delivery Target
The area where animals must be delivered to complete the game.

```typescript
export class Yard implements IEntity {
  public sprite: Sprite;                    // PixiJS sprite
  public bounds: Bounds;                    // Collision bounds
  public scale: number;                     // Visual scale
  public position: Point;                   // Position
}
```

**Key Methods:**
- `isPointInYard()`: Check if point is within yard bounds
- `updatePosition()`: Update yard position and bounds
- `calculateScale()`: Calculate appropriate scale

### 🌄 **Background.ts** - Game Background
The background image that covers the entire game area.

```typescript
export class Background implements IEntity {
  public sprite: Sprite;                    // PixiJS sprite
  public width: number;                     // Background width
  public height: number;                    // Background height
}
```

**Key Methods:**
- `resize()`: Update background size for different screen sizes

---

## 🔧 Systems

Systems contain the game logic and update entities each frame.

### 🎮 **InputSystem.ts** - Input Handling
Manages keyboard and mouse input for hero movement.

```typescript
export class InputSystem implements ISystem, IInputSystem {
  private hero: Hero;                       // Hero entity reference
  private keys: Set<string>;                // Currently pressed keys
  private keyConfig: KeyConfig;             // Key binding configuration
}
```

**Input Methods:**
- `handleKeyDown()`: Process key press events
- `handleKeyUp()`: Process key release events
- `handlePointerDown()`: Process mouse/pointer down
- `handlePointerMove()`: Process mouse/pointer movement
- `handlePointerUp()`: Process mouse/pointer up
- `handlePointerTap()`: Process click/tap events

**Supported Input:**
- **Keyboard**: WASD/Arrow keys for movement
- **Mouse**: Click to move, drag to follow cursor
- **Touch**: Tap and drag on mobile devices

### 🐑 **FollowSystem.ts** - Animal Following
Manages animals following the hero when they get close enough.

```typescript
export class FollowSystem implements ISystem {
  private hero: Hero;                       // Hero entity reference
  private animals: Animal[];                // Array of animals
  private followDistance: number;           // Trigger distance
  private maxFollowers: number;             // Maximum followers
}
```

**Follow Logic:**
1. Check distance between hero and each animal
2. If within trigger distance, change animal state to 'following'
3. Update animal position to follow hero with proper spacing
4. Switch animal texture to "following" state

### 🚶 **PatrolSystem.ts** - Animal Patrol
Makes idle animals patrol around the game area.

```typescript
export class PatrolSystem implements ISystem {
  private animals: Animal[];                // Array of animals
  private yard: Yard;                       // Yard entity reference
  private screenWidth: number;              // Screen width
  private screenHeight: number;             // Screen height
  private minDistance: number;              // Minimum spawn distance
  private patrolRadius: number;             // Patrol area radius
}
```

**Patrol Behavior:**
1. Animals move to random points within patrol radius
2. Avoid areas too close to yard
3. Maintain minimum distance from other animals
4. Return to patrol when not following hero

### 🚚 **AutoDeliverSystem.ts** - Automatic Delivery
Handles animals automatically moving to the yard when they're close enough.

```typescript
export class AutoDeliverSystem implements ISystem {
  private animals: Animal[];                // Array of animals
  private yard: Yard;                       // Yard entity reference
  private autoDeliverSpeed: number;         // Movement speed
}
```

**Auto-Delivery Logic:**
1. Check if animal is in 'following' state
2. If close to yard, change state to 'autoDeliver'
3. Move animal directly to yard center
4. Trigger delivery when animal reaches yard

### 💥 **CollisionSystem.ts** - Collision Detection
Detects when animals enter the yard and triggers delivery.

```typescript
export class CollisionSystem implements ISystem, ICollisionSystem {
  private animals: Animal[];                // Array of animals
  private yard: Yard;                       // Yard entity reference
  private onAnimalDelivered: (animal: Animal) => void; // Delivery callback
}
```

**Collision Detection:**
1. Check each animal's position against yard bounds
2. If animal is in yard and not already delivered:
   - Mark as delivered
   - Trigger delivery event
   - Update score

### 🏆 **ScoreSystem.ts** - Score Management
Manages the game score and high score tracking.

```typescript
export class ScoreSystem implements ISystem, IScoreSystem {
  private score: number = 0;                // Current score
  private highScore: number = 0;            // High score
  private storage: StorageService;          // Storage service
}
```

**Score Features:**
- **Score Tracking**: Increments on animal delivery
- **High Score**: Tracks and persists best score
- **Score Events**: Emits score change events for UI updates

---

## 🎨 UI Components

UI components handle the user interface and user interactions.

### 📊 **HUD.ts** - Heads-Up Display
Displays the current score and game information.

```typescript
export class HUD implements IHUD {
  private element: HTMLElement;             // DOM element
  private scoreElement: HTMLElement;        // Score display element
  private score: number = 0;                // Current score
}
```

**Features:**
- **Score Display**: Shows current score
- **Positioning**: Configurable position via CSS
- **Language Support**: Updates with language changes

### 🎬 **StartOverlay.ts** - Game Start Screen
The initial screen shown when the game loads.

```typescript
export class StartOverlay implements IOverlay {
  private element: HTMLElement;             // DOM element
  private i18n: I18nService;                // i18n service
  private onStartCallback?: () => void;     // Start callback
}
```

**Features:**
- **Game Instructions**: Shows how to play
- **Language Selector**: Allows language switching
- **Start Button**: Begins the game

### ⏸️ **PauseModal.ts** - Pause Menu
Modal shown when the game is paused.

```typescript
export class PauseModal implements IModal {
  private element: HTMLElement;             // DOM element
  private i18n: I18nService;                // i18n service
  private currentFunFactKey: string | null; // Current fun fact
  private onResumeCallback?: () => void;    // Resume callback
}
```

**Features:**
- **Fun Facts**: Displays random interesting facts
- **Resume Button**: Continues the game
- **Language Support**: Fun facts translate with language changes

### 🏁 **CompletionModal.ts** - Game End Screen
Modal shown when the game is completed.

```typescript
export class CompletionModal implements IModal {
  private element: HTMLElement;             // DOM element
  private i18n: I18nService;                // i18n service
  private storage: StorageService;          // Storage service
  private onPlayAgainCallback?: () => void; // Play again callback
}
```

**Features:**
- **Final Score**: Shows completion score
- **High Score**: Displays best score achieved
- **Play Again**: Restarts the game
- **Smooth Animation**: Fade and scale animations

### 🌍 **LanguageSelector.ts** - Language Switching
Component for switching between different languages.

```typescript
export class LanguageSelector implements ILanguageSelector {
  private element: HTMLElement;             // DOM element
  private i18n: I18nService;                // i18n service
  private currentLanguage: LangCode;        // Current language
}
```

**Supported Languages:**
- **English** (`en`): Default language
- **Ukrainian** (`uk`): Ukrainian translation
- **Spanish** (`es`): Spanish translation
- **Polish** (`pl`): Polish translation

---

## 🛠️ Services

Services provide core functionality and manage application state.

### 📦 **AssetService.ts** - Asset Management
Handles loading and caching of game assets.

```typescript
export class AssetService implements IAssetService {
  private textures: Map<string, Texture> = new Map(); // Texture cache
  private config: AssetConfig;                         // Asset configuration
}
```

**Asset Types:**
- **Textures**: PNG images for sprites
- **Fonts**: TTF/WOFF2 font files
- **Icons**: Favicon and app icons

**Key Methods:**
- `loadAssets()`: Load all configured assets
- `getTexture()`: Get cached texture by key
- `preloadTexture()`: Preload specific texture

### ⚙️ **ConfigService.ts** - Configuration Management
Loads and provides access to game configuration.

```typescript
export class ConfigService implements IConfigService {
  private gameConfig: GameConfig;           // Game parameters
  private assetConfig: AssetConfig;         // Asset mappings
  private i18nConfig: I18nConfig;          // Translation data
  private levelConfig: LevelConfig;         // Level definitions
  private keyConfig: KeyConfig;             // Key bindings
}
```

**Configuration Files:**
- `game.json`: Game parameters and settings
- `assets.json`: Asset file mappings
- `i18n.json`: Translation strings
- `levels.json`: Level definitions
- `keys.json`: Key binding configuration

### 🌍 **I18nService.ts** - Internationalization
Manages multiple language support and translations.

```typescript
export class I18nService implements II18nService {
  private currentLanguage: LangCode;        // Current language
  private translations: I18nConfig;         // Translation data
  private storage: StorageService;          // Storage service
}
```

**Features:**
- **Language Switching**: Change language at runtime
- **Translation Lookup**: Get translated strings by key
- **Persistence**: Remember selected language
- **Fallback**: Default to English if translation missing

### 📝 **Logger.ts** - Logging System
Provides structured logging with different levels.

```typescript
export class Logger {
  private level: LogLevel;                  // Current log level
  private prefix: string;                   // Log prefix
}
```

**Log Levels:**
- `ERROR`: Error messages
- `WARN`: Warning messages
- `INFO`: Informational messages
- `DEBUG`: Debug messages

### 💾 **StorageService.ts** - Local Storage
Manages browser local storage for persistence.

```typescript
export class StorageService {
  setItem(key: string, value: any): void;   // Store value
  getItem<T>(key: string): T | null;        // Retrieve value
  removeItem(key: string): void;            // Remove value
  clear(): void;                            // Clear all data
}
```

**Stored Data:**
- **Language**: Selected language preference
- **High Score**: Best score achieved
- **Settings**: User preferences

---

## ⚙️ Configuration

### 🎮 **game.json** - Game Parameters
Core game configuration including entity properties and UI settings.

```json
{
  "world": {
    "backgroundColor": 0,
    "backgroundAlpha": 0
  },
  "hero": {
    "radius": 30,
    "speed": 75.0,
    "followTriggerDistance": 50,
    "maxFollowers": 5
  },
  "animal": {
    "radius": 20,
    "patrolSpeed": 1,
    "followSpeed": 0.8,
    "autoDeliverSpeed": 50.0,
    "minSpawnDistance": 50,
    "count": 10
  },
  "yard": {
    "heightPercentage": 11,
    "buffer": 50,
    "margin": 20
  },
  "ui": {
    "scoreFontSize": 24,
    "scorePosition": { "x": 1.5, "y": 1.5 },
    "pauseButtonPosition": { "top": 2, "right": 10 }
  },
  "performance": {
    "resizeThrottleMs": 16,
    "resizeEndTimeout": 150,
    "maxTrailLength": 65,
    "lagFramesPerFollower": 1
  }
}
```

### 🎨 **assets.json** - Asset Mappings
Maps logical asset names to file paths.

```json
{
  "textures": {
    "hero": "/assets/hero.png",
    "animal": "/assets/animal.png",
    "animalOn": "/assets/animal-on.png",
    "paddock": "/assets/paddock.png",
    "background": "/assets/bg.png"
  },
  "fonts": {
    "montserrat": {
      "regular": "/fonts/Montserrat-Regular.ttf",
      "medium": "/fonts/Montserrat-Medium.ttf",
      "bold": "/fonts/Montserrat-Bold.ttf"
    },
    "fsElliotPro": {
      "regular": "/fonts/FSElliotPro-Regular.woff2",
      "bold": "/fonts/FSElliotPro-Bold.woff2",
      "heavy": "/fonts/FSElliotPro-Heavy.woff2"
    }
  },
  "icons": {
    "favicon": "/assets/favicon.ico"
  }
}
```

### 🌍 **i18n.json** - Translations
Multi-language translation strings.

```json
{
  "en": {
    "start": "Start Game",
    "pause": "Pause",
    "resume": "Resume",
    "score": "Score",
    "playAgain": "Play Again",
    "funFact1": "Sheep have excellent memories and can remember faces for years!",
    "funFact2": "A group of sheep is called a flock, herd, or mob.",
    "funFact3": "Sheep have rectangular pupils that give them excellent peripheral vision."
  },
  "uk": {
    "start": "Почати гру",
    "pause": "Пауза",
    "resume": "Продовжити",
    "score": "Рахунок",
    "playAgain": "Грати знову",
    "funFact1": "Вівці мають відмінну пам'ять і можуть пам'ятати обличчя роками!",
    "funFact2": "Групу овець називають зграєю, стадом або натовпом.",
    "funFact3": "Вівці мають прямокутні зіниці, що дає їм відмінний периферичний зір."
  }
}
```

---

## 📋 Types & Interfaces

### 🎮 **game.ts** - Game Types
Core game type definitions.

```typescript
export type GameState = 'boot' | 'running' | 'paused' | 'completed';
export type MovementMode = 'idle' | 'click' | 'drag' | 'keyboard';
export type AnimalState = 'idle' | 'following' | 'autoDeliver';

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
```

### 🎭 **entities.ts** - Entity Interfaces
Entity type definitions and interfaces.

```typescript
export interface IEntity {
  update(deltaTime: number): void;
  render(): void;
  destroy(): void;
}

export interface IMovable {
  position: Point;
  velocity: Point;
  moveTo(x: number, y: number): void;
  stop(): void;
}
```

### 🔧 **systems.ts** - System Interfaces
System type definitions and interfaces.

```typescript
export interface ISystem {
  name: string;
  initialize(): void;
  update(deltaTime: number): void;
  destroy(): void;
}

export interface IInputSystem extends ISystem {
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyUp(event: KeyboardEvent): void;
  handlePointerDown(x: number, y: number): void;
  handlePointerMove(x: number, y: number): void;
  handlePointerUp(): void;
  handlePointerTap(x: number, y: number): void;
}
```

---

## 🛠️ Utilities

### 🧮 **math.ts** - Mathematical Utilities
Common mathematical functions and calculations.

```typescript
export function distance(x1: number, y1: number, x2: number, y2: number): number;
export function clamp(value: number, min: number, max: number): number;
export function lerp(start: number, end: number, factor: number): number;
export function circleRectOverlap(circleX: number, circleY: number, radius: number, rect: Bounds): boolean;
```

### 📐 **geometry.ts** - Geometry Utilities
Geometric calculations and shape operations.

```typescript
export function createBounds(x: number, y: number, width: number, height: number): Bounds;
export function isPointInBounds(x: number, y: number, bounds: Bounds): boolean;
export function boundsIntersect(bounds1: Bounds, bounds2: Bounds): boolean;
```

### ⏱️ **throttle.ts** - Function Throttling
Utility for throttling function calls to improve performance.

```typescript
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void;
```

---

## 🚀 Build & Development

### 📦 **Package Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests
npm run test:ui  # Run tests with UI
```

### ⚙️ **Build Configuration**

#### **Vite Configuration** (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@systems': path.resolve(__dirname, './src/systems'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config')
    }
  }
});
```

#### **TypeScript Configuration** (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./src/core/*"],
      "@entities/*": ["./src/entities/*"],
      "@systems/*": ["./src/systems/*"],
      "@ui/*": ["./src/ui/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@config/*": ["./src/config/*"]
    }
  }
}
```

---

## 🧪 Testing

### 🧪 **Test Configuration**
- **Framework**: Vitest
- **Environment**: jsdom (browser simulation)
- **Coverage**: Unit tests for utilities and core functions

### 📁 **Test Structure**
```
tests/
├── setup.ts              # Test environment setup
└── utils/
    └── math.test.ts      # Math utility tests
```

### 🧮 **Example Test** (`math.test.ts`)
```typescript
import { describe, it, expect } from 'vitest';
import { distance, clamp, circleRectOverlap } from '../../src/utils/math';

describe('Math Utils', () => {
  it('should calculate distance correctly', () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
  });

  it('should clamp values correctly', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});
```

---

## 📚 API Reference

### 🎮 **Game Class API**

#### **Constructor**
```typescript
constructor()
```
Creates a new Game instance with default configuration.

#### **Methods**

##### **initialize()**
```typescript
async initialize(): Promise<void>
```
Initializes the game, loads assets, and sets up the initial state.

##### **startGame()**
```typescript
startGame(): void
```
Starts the game loop and begins gameplay.

##### **pauseGame()**
```typescript
pauseGame(): void
```
Pauses the game and shows the pause modal.

##### **resumeGame()**
```typescript
resumeGame(): void
```
Resumes the game from pause state.

##### **resetGame()**
```typescript
resetGame(): void
```
Resets the game to initial state.

### 🎭 **Entity APIs**

#### **Hero Methods**
```typescript
moveTo(x: number, y: number): void
stop(): void
updateMovement(deltaTime: number): void
clampToScreen(): void
```

#### **Animal Methods**
```typescript
setState(state: AnimalState): void
setPatrolTarget(target: Point): void
setAutoTarget(target: Point): void
```

#### **Yard Methods**
```typescript
isPointInYard(x: number, y: number): boolean
updatePosition(): void
calculateScale(): void
```

### 🔧 **System APIs**

#### **InputSystem Methods**
```typescript
handleKeyDown(event: KeyboardEvent): void
handleKeyUp(event: KeyboardEvent): void
handlePointerDown(x: number, y: number): void
handlePointerMove(x: number, y: number): void
handlePointerUp(): void
handlePointerTap(x: number, y: number): void
```

#### **ScoreSystem Methods**
```typescript
addScore(points: number): void
getScore(): number
getHighScore(): number
resetScore(): void
```

### 🎨 **UI Component APIs**

#### **HUD Methods**
```typescript
show(): void
hide(): void
updateScore(score: number): void
setPosition(x: number, y: number): void
updateLanguage(): void
```

#### **Modal Methods**
```typescript
show(): void
hide(): void
onResume(callback: () => void): void
onPlayAgain(callback: () => void): void
```

### 🛠️ **Service APIs**

#### **AssetService Methods**
```typescript
loadAssets(): Promise<void>
getTexture(key: string): Texture
preloadTexture(key: string): Promise<Texture>
```

#### **I18nService Methods**
```typescript
translate(key: string): string
setLanguage(language: LangCode): void
getCurrentLanguage(): LangCode
getAvailableLanguages(): LangCode[]
```

#### **StorageService Methods**
```typescript
setItem(key: string, value: any): void
getItem<T>(key: string): T | null
removeItem(key: string): void
clear(): void
```

---

## 🎯 **Conclusion**

The **Herdsman Game** is a well-architected, modern web game that demonstrates:

- **Clean Architecture** principles with clear separation of concerns
- **TypeScript** for type safety and better development experience
- **PixiJS** for high-performance 2D rendering
- **Modular Design** with dependency injection and event-driven communication
- **Internationalization** support for multiple languages
- **Responsive Design** that works across different screen sizes
- **Comprehensive Testing** with unit tests and proper test structure

The codebase is maintainable, extensible, and follows modern web development best practices. Each component has a clear responsibility, and the architecture allows for easy addition of new features and modifications.

---

*This documentation covers the complete codebase structure, functionality, and usage patterns. For specific implementation details, refer to the individual source files.*
