import { Application, Graphics, Text, Sprite, Assets } from "pixi.js";
import { translations, getInitialLanguage, setLanguage, t, type LangCode } from "./i18n";

// Font loading utility
function loadFont(fontFamily: string, fontWeight: string = "400"): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if font is already loaded
    if (document.fonts && document.fonts.check) {
      if (document.fonts.check(`${fontWeight} 16px ${fontFamily}`)) {
        resolve();
        return;
      }
    }

    // Fallback: wait for font to load using FontFace API
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`${fontWeight} 16px ${fontFamily}`).then(() => {
        resolve();
      }).catch(() => {
        // If FontFace API fails, try a different approach
        setTimeout(() => {
          if (document.fonts && document.fonts.check) {
            if (document.fonts.check(`${fontWeight} 16px ${fontFamily}`)) {
              resolve();
            } else {
              // Font still not loaded, but continue anyway
              console.warn(`Font ${fontFamily} may not be fully loaded`);
              resolve();
            }
          } else {
            resolve();
          }
        }, 100);
      });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        resolve();
      }, 100);
    }
  });
}

const app = new Application();
await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundAlpha: 0,
  antialias: true,
  resolution: window.devicePixelRatio,
  autoDensity: true,
});
document.body.appendChild(app.canvas);

// Екран старту гри
let gameStarted = false;
let currentLang: LangCode = getInitialLanguage();

// Pause state
let isPaused = false;

// Completion state
let gameCompleted = false;
let totalTargetAnimals = 0;
let deliveredCount = 0;
let gameStartTime = 0;
let gameEndTime = 0;
const BEST_TIME_KEY = "herdsman_best_time";

// Wait for font to load before creating text
await loadFont("Montserrat", "400");

// Текст рахунку у верхньому лівому куті (оголошено рано для i18n)
let score = 0;
const scoreText = new Text({
  text: `${t(currentLang, "score")}: ${score}`,
  style: {
    fill: 0xffffff,
    fontSize: 24,
    fontFamily: "Montserrat, sans-serif",
  },
});
scoreText.x = 20;
scoreText.y = 15;
app.stage.addChild(scoreText);

const startOverlay = document.getElementById("start-overlay");
const startBtn = document.getElementById("start-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    gameStarted = true;
    gameStartTime = Date.now(); // Start the timer
    if (startOverlay) (startOverlay as HTMLElement).style.display = "none";
    
    // Show pause button when game starts
    const pauseBtn = document.getElementById("pause-btn");
    if (pauseBtn) {
      pauseBtn.style.display = "block";
    }
  });
}

// I18n застосування до DOM
function applyI18n(lang: LangCode) {
  document.title = translations[lang].title;
  const nodes = document.querySelectorAll<HTMLElement>("[data-i18n]");
  nodes.forEach((el) => {
    const key = el.getAttribute("data-i18n") as any;
    if (!key) return;
    if (el.tagName === "BUTTON") {
      (el as HTMLButtonElement).textContent = t(lang, key);
    } else {
      el.textContent = t(lang, key);
    }
  });
  scoreText.text = `${t(lang, "score")}: ${score}`;
}

// Налаштувати селектор мови після завантаження DOM
function setupLanguageSelector() {
  const langSelect = document.getElementById("lang-select") as HTMLSelectElement | null;
  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener("change", () => {
      const value = langSelect.value as LangCode;
      if (translations[value]) {
        currentLang = value;
        setLanguage(value);
        applyI18n(value);
      }
    });
  }
  applyI18n(currentLang);
}

// Setup pause functionality
function setupPauseControls() {
  // ESC key handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    }
  });

  // Pause button handler
  const pauseBtn = document.getElementById("pause-btn");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", pauseGame);
  }

  // Resume button handler
  const resumeBtn = document.getElementById("resume-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", resumeGame);
  }

  // Play again button handler
  const playAgainBtn = document.getElementById("play-again-btn");
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetGame);
  }
}

// Запустити налаштування після завантаження сторінки
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupLanguageSelector();
    setupPauseControls();
  });
} else {
  setupLanguageSelector();
  setupPauseControls();
}

// Завантаження текстур та створення спрайтів героя/тварин
const HERO_RADIUS = 30; // відображуваний радіус героя у пікселях
const ANIMAL_RADIUS = 20; // відображуваний радіус тварини у пікселях

const [heroTexture, animalTexture, animalOnTexture, paddockTexture, bgTexture] = await Promise.all([
  Assets.load("assets/hero.png"),
  Assets.load("assets/animal.png"),
  Assets.load("assets/animal-on.png"),
  Assets.load("assets/paddock.png"),
  Assets.load("assets/bg.png"),
]);

// Фонове зображення — розтягнути на весь екран і додати позаду всього
const background = new Sprite(bgTexture);
background.anchor.set(0, 0);
background.x = 0;
background.y = 0;
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChildAt(background, 0);

// Головний герой — спрайт
const hero = new Sprite(heroTexture);
hero.anchor.set(0.5);
const heroScale = (HERO_RADIUS * 2) / (heroTexture.width || 1);
hero.scale.set(heroScale);
hero.x = app.screen.width / 2;
hero.y = app.screen.height / 2;
app.stage.addChild(hero);

// Рух героя до точки кліку
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;
type TargetPoint = { x: number; y: number } | null;
let heroTarget: TargetPoint = null;
let movementMode: "idle" | "click" | "drag" | "keyboard" = "idle";
let isDragging = false;
const heroSpeed = 8.0; // пікселів за кадр
// Клавіатурний ввід
const pressedKeys = new Set<string>();
const movementKeyCodes = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "KeyW",
  "KeyS",
  "KeyA",
  "KeyD",
]);
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  pressedKeys.add(e.code);
  if (movementKeyCodes.has(e.code)) {
    // Перемкнутися в режим клавіатури і скасувати ціль кліку
    movementMode = "keyboard";
    heroTarget = null;
    isDragging = false;
  }
});
window.addEventListener("keyup", (e) => {
  pressedKeys.delete(e.code);
  // Якщо всі рухові клавіші відпущено — зупинити героя; не відновлювати стару ціль кліку
  let anyMovement = false;
  for (const code of movementKeyCodes) {
    if (pressedKeys.has(code)) {
      anyMovement = true;
      break;
    }
  }
  if (!anyMovement) {
    // Залишаємо режим (може бути keyboard), але рух за клавіатурою 0
    // Ціль кліку не відновлюємо
  }
});

app.stage.on("pointerdown", (event) => {
  if (!gameStarted) return;
  // Ігнорувати, якщо активний режим клавіатури
  if (movementMode === "keyboard") return;
  // Тільки основна кнопка миші
  if ((event as any).button !== undefined && (event as any).button !== 0) return;
  const { x, y } = event.global;
  movementMode = "drag";
  isDragging = true;
  heroTarget = { x, y };
});

// Оновлювати ціль під час перетягування
app.stage.on("pointermove", (event) => {
  if (!gameStarted) return;
  if (movementMode !== "drag" || !isDragging) return;
  const { x, y } = event.global;
  heroTarget = { x, y };
});

// Завершення перетягування: зупинка героя, ціль очищується
const endDrag = () => {
  isDragging = false;
  if (movementMode === "drag") {
    movementMode = "idle";
    heroTarget = null;
  }
};
app.stage.on("pointerup", endDrag);
app.stage.on("pointerupoutside", endDrag);
app.stage.on("pointercancel", endDrag as any);

// Клік (tap) встановлює одноразову ціль, якщо не у режимі клавіатури або перетягування
app.stage.on("pointertap", (event) => {
  if (!gameStarted) return;
  if (movementMode === "keyboard" || isDragging) return;
  const { x, y } = event.global;
  movementMode = "click";
  heroTarget = { x, y };
});

// Двір — спрайт з природним співвідношенням сторін
const yardHeight = 120; // фіксована висота двору
const yard = new Sprite(paddockTexture);
yard.anchor.set(0.5, 1); // прив'язка до нижнього центру
{
  const scale = yardHeight / (paddockTexture.height || 1);
  yard.scale.set(scale); // зберігає природне співвідношення сторін
}
yard.x = app.screen.width / 2; // центр по горизонталі
yard.y = app.screen.height; // внизу екрану
app.stage.addChild(yard);

// Тварини (рівно 10 у випадкових позиціях, не ближче 50px до героя/двора/інших тварин)
type AnimalState = "idle" | "following" | "autoDeliver";
type Animal = {
  sprite: Sprite;
  state: AnimalState;
  autoTarget?: { x: number; y: number };
  patrolTarget?: { x: number; y: number };
};
const numAnimals = 10;
const animals: Animal[] = [];

const MIN_SPAWN_DISTANCE = 50;
const animalRadius = ANIMAL_RADIUS;

function distance(aX: number, aY: number, bX: number, bY: number): number {
  return Math.hypot(aX - bX, aY - bY);
}

function distancePointToRect(x: number, y: number, left: number, top: number, right: number, bottom: number): number {
  const dx = x < left ? left - x : x > right ? x - right : 0;
  const dy = y < top ? top - y : y > bottom ? y - bottom : 0;
  return Math.hypot(dx, dy);
}

function isValidSpawn(x: number, y: number): boolean {
  // Від героя
  if (distance(x, y, hero.x, hero.y) < MIN_SPAWN_DISTANCE) return false;

  // Від двору з буферною зоною (50px)
  const { left, top, right, bottom } = getYardBoundsWithBuffer(MIN_SPAWN_DISTANCE);
  const dRect = distancePointToRect(x, y, left, top, right, bottom);
  if (dRect < MIN_SPAWN_DISTANCE) return false;

  // Від інших тварин
  for (const a of animals) {
    if (distance(x, y, a.sprite.x, a.sprite.y) < MIN_SPAWN_DISTANCE) return false;
  }
  return true;
}

function isValidPatrolTarget(x: number, y: number): boolean {
  // Від двору з буферною зоною (50px)
  const { left, top, right, bottom } = getYardBoundsWithBuffer(MIN_SPAWN_DISTANCE);
  const dRect = distancePointToRect(x, y, left, top, right, bottom);
  if (dRect < MIN_SPAWN_DISTANCE) return false;

  // Перевіряємо, що точка не занадто близько до країв екрану
  const margin = 12;
  if (x < margin || x > app.screen.width - margin || 
      y < margin || y > app.screen.height - margin) {
    return false;
  }

  return true;
}

function isInYardBuffer(x: number, y: number, buffer: number = MIN_SPAWN_DISTANCE): boolean {
  const { left, top, right, bottom } = getYardBoundsWithBuffer(buffer);
  return x >= left && x <= right && y >= top && y <= bottom;
}

function spawnInitialAnimals() {
  // Clear existing animals
  animals.forEach(animal => {
    app.stage.removeChild(animal.sprite);
  });
  animals.length = 0;
  
  // Set total target animals for win condition
  totalTargetAnimals = numAnimals;
  
  for (let i = 0; i < numAnimals; i++) {
    let x = 0;
    let y = 0;
    // Генеруємо, доки позиція не буде валідною
    // (з огляду на невелику кількість об'єктів це швидко)
    // Уникаємо країв, щоб коло повністю вміщалося
    do {
      x = Math.random() * app.screen.width;
      y = Math.random() * app.screen.height;
      // Клап для меж, щоб не було напівпоза екраном
      x = Math.max(animalRadius, Math.min(app.screen.width - animalRadius, x));
      y = Math.max(animalRadius, Math.min(app.screen.height - animalRadius, y));
    } while (!isValidSpawn(x, y));

    const sprite = new Sprite(animalTexture);
    sprite.anchor.set(0.5);
    const animalScale = (ANIMAL_RADIUS * 2) / (animalTexture.width || 1);
    sprite.scale.set(animalScale);
    sprite.x = x;
    sprite.y = y;

    app.stage.addChild(sprite);
    animals.push({ sprite, state: "idle" });
  }
}

// Spawn initial animals
spawnInitialAnimals();

// Респонсив: оновлювати фон та двір при зміні розміру вікна
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // @ts-ignore Pixi v8 дозволяє об'єкт
  app.renderer.resize({ width, height });
  background.width = app.screen.width;
  background.height = app.screen.height;
  yard.x = app.screen.width / 2; // центр по горизонталі
  yard.y = app.screen.height; // внизу екрану
}
window.addEventListener("resize", onResize);

// Логіка супроводу тварин і підрахунок очок
function getYardBounds() {
  // Оскільки anchor (0.5,1), x,y — це нижній центр
  const centerX = yard.x;
  const bottom = yard.y;
  const width = yard.width;
  const height = yard.height;
  return {
    left: centerX - width / 2,
    top: bottom - height,
    right: centerX + width / 2,
    bottom,
  };
}

function getYardBoundsWithBuffer(buffer: number = 50) {
  const bounds = getYardBounds();
  return {
    left: bounds.left - buffer,
    top: bounds.top - buffer,
    right: bounds.right + buffer,
    bottom: bounds.bottom + buffer,
  };
}

const followTriggerDistance = 80;
const maxFollowers = 5;
const patrolSpeed = 0.2; // значно повільніше за героя (герой=4.0)

// Global followers count for tracking
let followersCount = 0;

// Історія позицій героя для ефекту "змійки"
type Point = { x: number; y: number };
const heroTrail: Point[] = [];
const lagFramesPerFollower = 12; // затримка між ланками
const maxTrailLength = lagFramesPerFollower * maxFollowers + 60; // з запасом

// Pause functionality
function getRandomFunFact(): string {
  const funFactKeys = ['funFact1', 'funFact2', 'funFact3', 'funFact4', 'funFact5', 
                      'funFact6', 'funFact7', 'funFact8', 'funFact9', 'funFact10'] as const;
  const randomKey = funFactKeys[Math.floor(Math.random() * funFactKeys.length)];
  return t(currentLang, randomKey);
}

function showPauseModal() {
  const pauseOverlay = document.getElementById("pause-overlay");
  const funFactText = document.getElementById("fun-fact-text");
  
  if (pauseOverlay && funFactText) {
    funFactText.textContent = getRandomFunFact();
    pauseOverlay.style.display = "flex";
  }
}

function hidePauseModal() {
  const pauseOverlay = document.getElementById("pause-overlay");
  if (pauseOverlay) {
    pauseOverlay.style.display = "none";
  }
}

function pauseGame() {
  if (!gameStarted) return;
  isPaused = true;
  showPauseModal();
}

function resumeGame() {
  isPaused = false;
  hidePauseModal();
}

// Completion functionality
function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 100);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms}`;
}

function getBestTime(): number | null {
  const stored = localStorage.getItem(BEST_TIME_KEY);
  return stored ? parseInt(stored, 10) : null;
}

function setBestTime(time: number) {
  localStorage.setItem(BEST_TIME_KEY, time.toString());
}

function showCompletionModal() {
  const completionOverlay = document.getElementById("completion-overlay");
  const currentTimeElement = document.getElementById("current-time");
  const bestTimeElement = document.getElementById("best-time");
  
  if (completionOverlay && currentTimeElement && bestTimeElement) {
    const currentTime = gameEndTime - gameStartTime;
    const bestTime = getBestTime();
    
    currentTimeElement.textContent = formatTime(currentTime);
    
    if (bestTime === null || currentTime < bestTime) {
      setBestTime(currentTime);
      bestTimeElement.textContent = formatTime(currentTime);
    } else {
      bestTimeElement.textContent = formatTime(bestTime);
    }
    
    completionOverlay.style.display = "flex";
    
    // Focus the play again button for accessibility
    const playAgainBtn = document.getElementById("play-again-btn");
    if (playAgainBtn) {
      playAgainBtn.focus();
    }
  }
}

function hideCompletionModal() {
  const completionOverlay = document.getElementById("completion-overlay");
  if (completionOverlay) {
    completionOverlay.style.display = "none";
  }
}

function checkWinCondition() {
  if (deliveredCount >= totalTargetAnimals && !gameCompleted) {
    gameCompleted = true;
    gameEndTime = Date.now();
    isPaused = true; // Pause the game loop
    showCompletionModal();
  }
}

function resetGame() {
  // Reset game state
  gameCompleted = false;
  deliveredCount = 0;
  score = 0;
  scoreText.text = `${t(currentLang, "score")}: ${score}`;
  
  // Reset hero position
  hero.x = app.screen.width / 2;
  hero.y = app.screen.height / 2;
  
  // Clear hero trail
  heroTrail.length = 0;
  
  // Remove all existing animals
  animals.forEach(animal => {
    app.stage.removeChild(animal.sprite);
  });
  animals.length = 0;
  
  // Respawn initial animals
  spawnInitialAnimals();
  
  // Reset movement state
  movementMode = "idle";
  isDragging = false;
  heroTarget = null;
  
  // Hide completion modal
  hideCompletionModal();
  
  // Resume game loop
  isPaused = false;
}

app.ticker.add(() => {
  if (!gameStarted || isPaused) return;
  
  // Check Hero-yard overlap FIRST, before any other updates
  const { left: yLeft, top: yTop, right: yRight, bottom: yBottom } = getYardBounds();
  const heroInYardNow = circleRectOverlap(hero.x, hero.y, HERO_RADIUS, yLeft, yTop, yRight, yBottom);
  (triggerAutoDelivery as any)._prev = (triggerAutoDelivery as any)._prev ?? false;
  const prev = (triggerAutoDelivery as any)._prev as boolean;
  if (!prev && heroInYardNow) {
    triggerAutoDelivery();
  }
  (triggerAutoDelivery as any)._prev = heroInYardNow;
  
  // Попередня позиція героя для підрахунку швидкості за кадр
  const prevHeroX = hero.x;
  const prevHeroY = hero.y;
  // Оновити позицію героя
  if (movementMode === "keyboard") {
    let ix = 0;
    let iy = 0;
    if (pressedKeys.has("ArrowUp") || pressedKeys.has("KeyW")) iy -= 1;
    if (pressedKeys.has("ArrowDown") || pressedKeys.has("KeyS")) iy += 1;
    if (pressedKeys.has("ArrowLeft") || pressedKeys.has("KeyA")) ix -= 1;
    if (pressedKeys.has("ArrowRight") || pressedKeys.has("KeyD")) ix += 1;

    if (ix !== 0 || iy !== 0) {
      const len = Math.hypot(ix, iy) || 1;
      hero.x += (ix / len) * heroSpeed;
      hero.y += (iy / len) * heroSpeed;
    }
    // Якщо немає натиснутих — герой стоїть, ціль кліку не відновлюється
  } else if (movementMode === "click" || movementMode === "drag") {
    if (heroTarget) {
      const hdx = heroTarget.x - hero.x;
      const hdy = heroTarget.y - hero.y;
      const hdist = Math.hypot(hdx, hdy);
      if (hdist > 0.001) {
        const step = Math.min(heroSpeed, hdist);
        hero.x += (hdx / (hdist || 1)) * step;
        hero.y += (hdy / (hdist || 1)) * step;
      }
    }
  } else {
    // idle — не рухаємось
  }

  // Клап героя в межах екрана
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  hero.x = clamp(hero.x, HERO_RADIUS, app.screen.width - HERO_RADIUS);
  hero.y = clamp(hero.y, HERO_RADIUS, app.screen.height - HERO_RADIUS);

  // Фактична швидкість героя у пікселях за кадр
  const heroFrameSpeed = Math.hypot(hero.x - prevHeroX, hero.y - prevHeroY);

  // Додати поточну позицію героя до сліду (після оновлення позиції героя)
  heroTrail.push({ x: hero.x, y: hero.y });
  if (heroTrail.length > maxTrailLength) heroTrail.shift();

  // Порахувати скільки тварин уже слідують
  followersCount = 0;
  for (const a of animals) if (a.state === "following") followersCount++;

  // Оновити тварин
  for (let i = animals.length - 1; i >= 0; i--) {
    const animal = animals[i];
    const sprite = animal.sprite;

    // Якщо не слідує — спробувати активувати, якщо герой поруч і ще є місця
    if (animal.state === "idle" && followersCount < maxFollowers) {
      const dxh = hero.x - sprite.x;
      const dyh = hero.y - sprite.y;
      if (Math.hypot(dxh, dyh) <= followTriggerDistance) {
        animal.state = "following";
        // Змінити текстуру на "animal-on" без зміни позиції/масштабу/якоря
        const prevX = sprite.x;
        const prevY = sprite.y;
        const prevScaleX = sprite.scale.x;
        const prevScaleY = sprite.scale.y;
        const prevAnchorX = sprite.anchor.x;
        const prevAnchorY = sprite.anchor.y;
        sprite.texture = animalOnTexture;
        // Перерахувати масштаб, щоб зберегти візуальний розмір
        const scale = (ANIMAL_RADIUS * 2) / (animalOnTexture.width || 1);
        sprite.scale.set(scale);
        // Відновити якір і позицію (позиція не змінювалась, але для гарантії)
        sprite.anchor.set(prevAnchorX, prevAnchorY);
        sprite.x = prevX;
        sprite.y = prevY;
        followersCount++;
      }
    }

    // Патрулювання для вільних тварин (idle)
    if (animal.state === "idle") {
      // Перевіряємо, чи тварина не потрапила в буферну зону двору
      if (isInYardBuffer(sprite.x, sprite.y)) {
        // Негайно перенаправити на безпечну ціль
        let attempts = 0;
        do {
          animal.patrolTarget = {
            x: 12 + Math.random() * Math.max(1, app.screen.width - 24),
            y: 12 + Math.random() * Math.max(1, app.screen.height - 24),
          };
          attempts++;
        } while (!isValidPatrolTarget(animal.patrolTarget.x, animal.patrolTarget.y) && attempts < 50);
        
        // Якщо не вдалося знайти валідну ціль, використовуємо поточну позицію
        if (attempts >= 50) {
          animal.patrolTarget = { x: sprite.x, y: sprite.y };
        }
      }

      // Призначити ціль, якщо відсутня або досягнута
      if (!animal.patrolTarget) {
        // Генеруємо валідну ціль патруля (поза буферною зоною двору)
        let attempts = 0;
        do {
          animal.patrolTarget = {
            x: 12 + Math.random() * Math.max(1, app.screen.width - 24),
            y: 12 + Math.random() * Math.max(1, app.screen.height - 24),
          };
          attempts++;
        } while (!isValidPatrolTarget(animal.patrolTarget.x, animal.patrolTarget.y) && attempts < 50);
        
        // Якщо не вдалося знайти валідну ціль, використовуємо поточну позицію
        if (attempts >= 50) {
          animal.patrolTarget = { x: sprite.x, y: sprite.y };
        }
      }

      const tx = animal.patrolTarget.x;
      const ty = animal.patrolTarget.y;
      const dx = tx - sprite.x;
      const dy = ty - sprite.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 4) {
        // Обрати нову точку негайно (з урахуванням буферної зони двору)
        let attempts = 0;
        do {
          animal.patrolTarget = {
            x: 12 + Math.random() * Math.max(1, app.screen.width - 24),
            y: 12 + Math.random() * Math.max(1, app.screen.height - 24),
          };
          attempts++;
        } while (!isValidPatrolTarget(animal.patrolTarget.x, animal.patrolTarget.y) && attempts < 50);
        
        // Якщо не вдалося знайти валідну ціль, використовуємо поточну позицію
        if (attempts >= 50) {
          animal.patrolTarget = { x: sprite.x, y: sprite.y };
        }
      } else if (dist) {
        // Перевіряємо, чи рух не приведе в буферну зону двору
        const nextX = sprite.x + (dx / dist) * Math.min(patrolSpeed, dist);
        const nextY = sprite.y + (dy / dist) * Math.min(patrolSpeed, dist);
        
        if (isInYardBuffer(nextX, nextY)) {
          // Перенаправити на нову безпечну ціль
          let attempts = 0;
          do {
            animal.patrolTarget = {
              x: 12 + Math.random() * Math.max(1, app.screen.width - 24),
              y: 12 + Math.random() * Math.max(1, app.screen.height - 24),
            };
            attempts++;
          } while (!isValidPatrolTarget(animal.patrolTarget.x, animal.patrolTarget.y) && attempts < 50);
          
          // Якщо не вдалося знайти валідну ціль, зупинитися
          if (attempts >= 50) {
            animal.patrolTarget = { x: sprite.x, y: sprite.y };
          }
        } else {
          // Безпечний рух
          const step = Math.min(patrolSpeed, dist);
          sprite.x += (dx / dist) * step;
          sprite.y += (dy / dist) * step;
        }
      }
    } else {
      // У нефрі станах — скасувати ціль патруля
      animal.patrolTarget = undefined;
    }

    // Якщо слідує — рух із затримкою по сліду героя
    if (animal.state === "following") {
      // Індекс у послідовності що слідують
      let followerIndex = 0;
      for (const a of animals) {
        if (a.state === "following") {
          if (a === animal) break;
          followerIndex++;
        }
      }

      const desiredTrailIndex = heroTrail.length - 1 - (followerIndex + 1) * lagFramesPerFollower;
      const target = desiredTrailIndex >= 0 ? heroTrail[desiredTrailIndex] : { x: hero.x, y: hero.y };

      const dx = target.x - sprite.x;
      const dy = target.y - sprite.y;
      const dist = Math.hypot(dx, dy) || 1;
      const step = Math.min(heroFrameSpeed, dist);
      sprite.x += (dx / dist) * step;
      sprite.y += (dy / dist) * step;

      // Якщо дісталося до двору — прибрати та додати очко
      {
        const { left, right, top, bottom } = getYardBounds();
        if (
          sprite.x >= left &&
          sprite.x <= right &&
          sprite.y >= top &&
          sprite.y <= bottom
        ) {
          app.stage.removeChild(sprite);
          animals.splice(i, 1);
          score += 1;
          deliveredCount += 1;
          scoreText.text = `${t(currentLang, "score")}: ${score}`;
          followersCount = Math.max(0, followersCount - 1);
          checkWinCondition();
        }
      }
    }

    // Стан авто-доставки
    if (animal.state === "autoDeliver") {
      // If no target, set one to yard center
      if (!animal.autoTarget) {
        const { left, top, right, bottom } = getYardBounds();
        animal.autoTarget = {
          x: (left + right) / 2,
          y: (top + bottom) / 2
        };
      }
      
      const tx = animal.autoTarget.x;
      const ty = animal.autoTarget.y;
      const dx = tx - sprite.x;
      const dy = ty - sprite.y;
      const dist = Math.hypot(dx, dy) || 1;
      // Use independent speed for autoDeliver animals (same as hero speed)
      const autoDeliverSpeed = heroSpeed;
      const step = Math.min(autoDeliverSpeed, dist);
      sprite.x += (dx / dist) * step;
      sprite.y += (dy / dist) * step;

      {
        const { left, right, top, bottom } = getYardBounds();
        if (
          sprite.x >= left &&
          sprite.x <= right &&
          sprite.y >= top &&
          sprite.y <= bottom
        ) {
          app.stage.removeChild(sprite);
          animals.splice(i, 1);
          score += 1;
          deliveredCount += 1;
          scoreText.text = `${t(currentLang, "score")}: ${score}`;
          checkWinCondition();
        }
      }
    }
  }

  // Допоміжні функції для двору
  function circleRectOverlap(cx: number, cy: number, r: number, left: number, top: number, right: number, bottom: number) {
    const closestX = Math.max(left, Math.min(cx, right));
    const closestY = Math.max(top, Math.min(cy, bottom));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= r * r;
  }

  function randomPointInYard(padding: number) {
    const { left, top, right, bottom } = getYardBounds();
    return {
      x: left + padding + Math.random() * Math.max(1, right - left - 2 * padding),
      y: top + padding + Math.random() * Math.max(1, bottom - top - 2 * padding),
    };
  }

  function triggerAutoDelivery() {
    // Find all currently following animals
    const followingAnimals = animals.filter(a => a.state === "following");
    
    // Switch them to autoDeliver mode
    for (const a of followingAnimals) {
      a.state = "autoDeliver";
      a.autoTarget = randomPointInYard(8);
      // Clear patrol target to ensure they focus on delivery
      a.patrolTarget = undefined;
    }
    
    // Clear the following group count to reset the cap
    followersCount = 0;
  }

});
