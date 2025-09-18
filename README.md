# Herdsman Game

A minimalistic 2D herding game prototype built with TypeScript and PixiJS, refactored for clean architecture, modularity, and maintainability.

## Architecture Overview

This project follows clean architecture principles with clear separation of concerns, SOLID principles, and design patterns.

### Project Structure

```
src/
├── core/           # Engine-level components
│   ├── App.ts      # Main application bootstrap
│   ├── Clock.ts    # Time management
│   ├── EventBus.ts # Event system
│   └── Container.ts # Dependency injection
├── config/         # Configuration files
│   ├── game.json   # Game parameters
│   ├── assets.json # Asset paths
│   ├── i18n.json   # Translations
│   ├── levels.json # Level definitions
│   └── keys.json   # Key bindings
├── entities/       # Game entities
│   ├── Hero.ts     # Player character
│   ├── Animal.ts   # Herdable animals
│   ├── Yard.ts     # Delivery target
│   └── Background.ts # Game background
├── systems/        # Game systems
│   ├── FollowSystem.ts      # Animal following logic
│   ├── AutoDeliverSystem.ts # Auto-delivery system
│   ├── PatrolSystem.ts      # Animal patrol behavior
│   ├── CollisionSystem.ts   # Collision detection
│   ├── ScoreSystem.ts       # Score management
│   └── InputSystem.ts       # Input handling
├── ui/             # User interface
│   ├── HUD.ts              # Heads-up display
│   ├── StartOverlay.ts     # Start screen
│   ├── PauseModal.ts       # Pause dialog
│   ├── CompletionModal.ts  # Game completion
│   └── LanguageSelector.ts # Language switcher
├── services/       # Business logic services
│   ├── Logger.ts        # Logging service
│   ├── StorageService.ts # Local storage
│   ├── AssetService.ts   # Asset loading
│   ├── I18nService.ts    # Internationalization
│   └── ConfigService.ts  # Configuration management
├── utils/          # Utility functions
│   ├── math.ts      # Mathematical utilities
│   ├── geometry.ts  # Geometric calculations
│   └── throttle.ts  # Throttling utilities
├── types/          # Type definitions
│   ├── game.ts      # Game types
│   ├── entities.ts  # Entity interfaces
│   ├── systems.ts   # System interfaces
│   ├── ui.ts        # UI interfaces
│   ├── i18n.ts      # I18n types
│   └── config.ts    # Config types
└── styles/         # CSS files
    └── main.css     # Main stylesheet
```

## SOLID Principles Implementation

### Single Responsibility Principle (S)
- Each class has a single, well-defined responsibility
- `Hero` handles only hero movement and state
- `ScoreSystem` manages only scoring logic
- `I18nService` handles only internationalization

### Open/Closed Principle (O)
- Systems are open for extension through configuration
- New animal behaviors can be added without modifying existing code
- UI components can be extended through inheritance

### Liskov Substitution Principle (L)
- All entities implement `IEntity` interface and can be substituted
- Movement strategies can be swapped without breaking functionality
- UI components implement common interfaces

### Interface Segregation Principle (I)
- Small, focused interfaces like `IUpdatable`, `IRenderable`
- `ISystem` interface is minimal and focused
- UI components have specific interfaces

### Dependency Inversion Principle (D)
- High-level modules depend on abstractions
- Services are injected through DI container
- Event bus decouples systems

## Design Patterns

### State Pattern
- `AnimalState` enum with different behaviors
- `GameState` manages overall game flow
- State transitions are handled cleanly

### Strategy Pattern
- Movement behaviors are swappable
- Different input strategies (keyboard, mouse, touch)
- Configurable game parameters

### Observer Pattern
- Event bus for decoupled communication
- UI components subscribe to game events
- Systems communicate through events

### Factory Pattern
- Entity creation through factories
- Asset loading through service
- Configuration-driven object creation

### Command Pattern
- Input mapping to commands
- Undo/redo capability (future)
- Macro commands for complex actions

### Repository Pattern
- `StorageService` abstracts data persistence
- `AssetService` manages asset loading
- `ConfigService` handles configuration

### Object Pool Pattern
- Animals can be pooled for performance
- Texture reuse for memory efficiency
- Event listener cleanup

## Best Practices

### TypeScript
- Strict type checking enabled
- No `any` types used
- Comprehensive type definitions
- Path aliases for clean imports

### Error Handling
- Centralized logging service
- Graceful degradation
- Clear error messages
- Safe fallbacks

### Performance
- Efficient rendering loops
- Object pooling where beneficial
- Minimal allocations per frame
- Responsive design

### Testing
- Unit tests for pure functions
- Mocked dependencies
- Isolated test cases
- Clear test structure

## Configuration

The game is highly configurable through JSON files:

- **game.json**: Core game parameters (speeds, distances, limits)
- **assets.json**: Asset paths and keys
- **i18n.json**: Multi-language support
- **levels.json**: Level definitions and spawn rules
- **keys.json**: Input key bindings

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Testing
```bash
npm test
```

## Architecture Decision Records (ADR)

### ADR-001: Event Bus for System Communication
**Decision**: Use a centralized event bus for inter-system communication
**Rationale**: Decouples systems, makes testing easier, provides clear communication patterns
**Consequences**: Slightly more complex than direct calls, but much more maintainable

### ADR-002: Configuration-Driven Design
**Decision**: Move all magic numbers and constants to JSON configuration files
**Rationale**: Makes the game easily modifiable without code changes
**Consequences**: More files to manage, but much more flexible

### ADR-003: Dependency Injection Container
**Decision**: Use a simple DI container for service management
**Rationale**: Makes testing easier, provides clear dependency management
**Consequences**: Slight overhead, but much better testability

## Future Enhancements

- [ ] Add more game levels
- [ ] Implement sound system
- [ ] Add particle effects
- [ ] Create level editor
- [ ] Add multiplayer support
- [ ] Implement save/load system
- [ ] Add achievements system
- [ ] Create mobile-specific controls
