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

export interface BoundsWithBuffer extends Bounds {
  buffer: number;
}

export interface GameConfig {
  world: {
    backgroundColor: number;
    backgroundAlpha: number;
  };
  hero: {
    radius: number;
    speed: number;
    followTriggerDistance: number;
    maxFollowers: number;
  };
  animal: {
    radius: number;
    patrolSpeed: number;
    followSpeed: number;
    autoDeliverSpeed: number;
    minSpawnDistance: number;
    count: number;
  };
  yard: {
    heightPercentage: number;
    buffer: number;
    margin: number;
  };
  ui: {
    scoreFontSize: number;
    scorePosition: {
      x: number;
      y: number;
    };
    pauseButtonPosition: {
      top: number;
      right: number;
    };
  };
  performance: {
    resizeThrottleMs: number;
    resizeEndTimeout: number;
    maxTrailLength: number;
    lagFramesPerFollower: number;
  };
}

export interface AssetConfig {
  textures: {
    hero: string;
    animal: string;
    animalOn: string;
    paddock: string;
    background: string;
  };
  fonts: {
    montserrat: {
      regular: string;
      medium: string;
      bold: string;
    };
    fsElliotPro: {
      regular: string;
      bold: string;
      heavy: string;
    };
  };
  icons: {
    favicon: string;
  };
}

export interface LevelConfig {
  [key: string]: {
    name: string;
    animalCount: number;
    spawnRules: {
      minDistanceFromHero: number;
      minDistanceFromYard: number;
      minDistanceFromOtherAnimals: number;
      edgeMargin: number;
    };
    winCondition: {
      deliverAllAnimals: boolean;
    };
  };
}

export interface KeyConfig {
  movement: {
    up: string[];
    down: string[];
    left: string[];
    right: string[];
  };
  game: {
    pause: string[];
    resume: string[];
  };
  ui: {
    start: string[];
    playAgain: string[];
  };
}
